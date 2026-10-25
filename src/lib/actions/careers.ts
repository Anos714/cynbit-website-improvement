"use server";

import { careers } from "@/content/careers";
import { sendFormEmail } from "@/lib/email";
import { type FormState } from "@/lib/forms";
import { checkFormRateLimits } from "@/lib/rate-limit";
import { createReference, requestIp } from "@/lib/request";
import { careerApplicationSchema, isFormTooFast } from "@/lib/validation";
import { site } from "@/lib/site";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function failure(
  message: string,
  reference: string,
  options: Pick<FormState, "fieldErrors" | "retryAfterSeconds"> = {},
): FormState {
  return { status: "error", message, reference, ...options };
}

export async function submitCareerApplication(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const reference = createReference();

  if (formValue(formData, "website")) {
    return {
      status: "success",
      message: "Thanks. Your application has been received.",
      reference,
      transport: "demo",
    };
  }

  if (isFormTooFast(formValue(formData, "startedAt"))) {
    return failure("Please take a moment to review your application and try again.", reference);
  }

  const parsed = careerApplicationSchema.safeParse({
    role: formValue(formData, "role"),
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    location: formValue(formData, "location"),
    portfolio: formValue(formData, "portfolio"),
    linkedin: formValue(formData, "linkedin"),
    message: formValue(formData, "message"),
    consent: formValue(formData, "consent") === "yes",
  });

  if (!parsed.success) {
    return failure(
      "Please check the highlighted fields and try again.",
      reference,
      { fieldErrors: parsed.error.flatten().fieldErrors },
    );
  }

  const limit = await checkFormRateLimits(
    "career",
    await requestIp(),
    parsed.data.email,
  );
  if (!limit.allowed) {
    return failure(
      "Too many attempts from this connection. Please wait before trying again.",
      reference,
      { retryAfterSeconds: limit.retryAfterSeconds },
    );
  }

  const role = careers.find((item) => item.slug === parsed.data.role);
  if (!role) {
    return failure("That role is no longer available. Please choose another open role.", reference, {
      fieldErrors: { role: ["This role is no longer available."] },
    });
  }

  const text = [
    `New application: ${role.title}`,
    "",
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    `Location: ${parsed.data.location || "Not provided"}`,
    `Portfolio: ${parsed.data.portfolio}`,
    `LinkedIn or resume: ${parsed.data.linkedin || "Not provided"}`,
    `Role: ${role.title} (${role.slug})`,
    "",
    "Why this role:",
    parsed.data.message,
  ].join("\n");

  const delivery = await sendFormEmail({
    kind: "career",
    subject: `Application: ${parsed.data.name} for ${role.title}`,
    text,
    replyTo: parsed.data.email,
    reference,
  });

  if (!delivery.ok) {
    if (delivery.reason === "not_configured") {
      console.error(`[careers] reference=${reference} email delivery is not configured`);
      return failure(
        `Online applications are not available right now. Please email ${site.email} directly.`,
        reference,
      );
    }

    console.error(`[careers] reference=${reference} delivery failed`);
    return failure(
      `We could not deliver your application. Please try again or email ${site.email} directly.`,
      reference,
    );
  }

  return {
    status: "success",
    message: "Thanks. Your application is with the team, and we will reply by email if there is a fit.",
    reference,
    transport: delivery.transport,
  };
}
