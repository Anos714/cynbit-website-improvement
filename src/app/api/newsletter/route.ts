import { NextResponse } from "next/server";
import { sendFormEmail } from "@/lib/email";
import { checkFormRateLimits } from "@/lib/rate-limit";
import { createReference, requestIpFromHeaders } from "@/lib/request";
import { newsletterSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function envelope(
  code: string,
  message: string,
  reference: string,
  extra: Record<string, unknown> = {},
) {
  return { error: { code, message, reference, ...extra } };
}

export async function POST(request: Request) {
  const reference = createReference();
  const headers = {
    "Cache-Control": "no-store, max-age=0",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  };

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      envelope("invalid_json", "Expected a JSON body.", reference),
      { status: 400, headers },
    );
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      envelope("invalid_input", "Enter a valid email address and accept the privacy notice.", reference, {
        fields: parsed.error.flatten().fieldErrors,
      }),
      { status: 422, headers },
    );
  }

  const limit = await checkFormRateLimits(
    "newsletter",
    requestIpFromHeaders(request.headers),
    parsed.data.email,
  );

  if (!limit.allowed) {
    return NextResponse.json(
      envelope("rate_limited", "Too many attempts. Please wait before trying again.", reference, {
        retryAfterSeconds: limit.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: { ...headers, "Retry-After": String(limit.retryAfterSeconds) },
      },
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
    return NextResponse.json(
      envelope("delivery_failed", "The sign-up could not be delivered. Please try again.", reference),
      { status: 503, headers },
    );
  }

  return NextResponse.json(
    { data: { accepted: true, reference, transport: delivery.transport } },
    { status: 202, headers },
  );
}
