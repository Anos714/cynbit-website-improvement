import "server-only";
import { emailTransport, env } from "@/lib/env";

type MailKind = "contact" | "career" | "newsletter";

type MailInput = {
  kind: MailKind;
  subject: string;
  text: string;
  replyTo: string;
  reference: string;
};

type MailResult =
  | { ok: true; transport: "resend" | "demo" }
  | { ok: false; reason: "not_configured" | "delivery_failed"; status?: number };

function plainHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}

export async function sendFormEmail({
  kind,
  subject,
  text,
  replyTo,
  reference,
}: MailInput): Promise<MailResult> {
  const transport = emailTransport();

  if (transport === "demo") {
    // Deliberately does not log the sender, message body or reply address.
    console.info(
      `[email:demo] kind=${kind} reference=${reference} accepted without a configured provider.`,
    );
    return { ok: true, transport: "demo" };
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.RESEND_FROM_EMAIL) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: plainHeader(env.RESEND_FROM_EMAIL),
        to: [env.CONTACT_TO_EMAIL],
        subject: plainHeader(subject),
        text,
        reply_to: plainHeader(replyTo),
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error(
        `[email:resend] kind=${kind} reference=${reference} status=${response.status}`,
      );
      return { ok: false, reason: "delivery_failed", status: response.status };
    }

    return { ok: true, transport: "resend" };
  } catch {
    console.error(`[email:resend] kind=${kind} reference=${reference} network_failure`);
    return { ok: false, reason: "delivery_failed" };
  }
}
