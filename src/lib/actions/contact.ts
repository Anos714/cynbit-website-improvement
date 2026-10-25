"use server";

import { sendFormEmail } from "@/lib/email";
import { contactInterests, type FormState } from "@/lib/forms";
import { checkFormRateLimits } from "@/lib/rate-limit";
import { createReference, requestIp } from "@/lib/request";
import { contactSchema, isFormTooFast } from "@/lib/validation";
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

export async function submitContact(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const reference = createReference();

  if (formValue(formData, "website")) {
    return {
      status: "success",
      message: "Thanks. Your message has been received.",
      reference,
      transport: "demo",
    };
  }

  if (isFormTooFast(formValue(formData, "startedAt"))) {
    return failure("Please take a moment to review your message and try again.", reference);
  }

  const parsed = contactSchema.safeParse({
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    company: formValue(formData, "company"),
    interest: formValue(formData, "interest"),
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
    "contact",
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

  const interest =
    contactInterests.find((item) => item.value === parsed.data.interest)?.label ?? "General inquiry";
  const text = [
    "New public website inquiry",
    "",
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    `Company: ${parsed.data.company || "Not provided"}`,
    `Interest: ${interest}`,
    "",
    "Message:",
    parsed.data.message,
  ].join("\n");

  const delivery = await sendFormEmail({
    kind: "contact",
    subject: `Website inquiry: ${parsed.data.name}`,
    text,
    replyTo: parsed.data.email,
    reference,
  });

  if (!delivery.ok) {
    if (delivery.reason === "not_configured") {
      console.error(`[contact] reference=${reference} email delivery is not configured`);
      return failure(
        `Online delivery is not available right now. Please email ${site.email} directly.`,
        reference,
      );
    }

    console.error(`[contact] reference=${reference} delivery failed`);
    return failure(
      `We could not deliver your message. Please try again or email ${site.email} directly.`,
      reference,
    );
  }

  return {
    status: "success",
    message: "Thanks. Your inquiry is with the Cynbit team and we will reply by email.",
    reference,
    transport: delivery.transport,
  };
}
