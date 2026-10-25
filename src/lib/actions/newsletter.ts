"use server";

import { sendFormEmail } from "@/lib/email";
import { type FormState } from "@/lib/forms";
import { checkFormRateLimits } from "@/lib/rate-limit";
import { createReference, requestIp } from "@/lib/request";
import { isFormTooFast, newsletterSchema } from "@/lib/validation";
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

export async function subscribeToNewsletter(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const reference = createReference();

  if (formValue(formData, "website")) {
    return {
      status: "success",
      message: "Thanks. You are on the list.",
      reference,
      transport: "demo",
    };
  }

  if (isFormTooFast(formValue(formData, "startedAt"))) {
    return failure("Please take a moment and try again.", reference);
  }

  const parsed = newsletterSchema.safeParse({
    email: formValue(formData, "email"),
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
    "newsletter",
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

  const delivery = await sendFormEmail({
    kind: "newsletter",
    subject: "Newsletter sign-up",
    text: `New newsletter sign-up.\n\nEmail: ${parsed.data.email}`,
    replyTo: parsed.data.email,
    reference,
  });

  if (!delivery.ok) {
    console.error(`[newsletter] reference=${reference} delivery failed`);
    return failure(
      `We could not add you to the list. Please try again or email ${site.email} directly.`,
      reference,
    );
  }

  return {
    status: "success",
    message: "Thanks. You are on the list for occasional Cynbit notes.",
    reference,
    transport: delivery.transport,
  };
}
