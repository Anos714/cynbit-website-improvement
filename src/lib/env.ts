import "server-only";
import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();
const optionalUrl = z.string().trim().url().optional();

const schema = z
  .object({
    NEXT_PUBLIC_SITE_URL: optionalUrl,
    RESEND_API_KEY: optionalText,
    CONTACT_TO_EMAIL: z.string().trim().email().optional(),
    RESEND_FROM_EMAIL: optionalText,
    REVALIDATE_SECRET: z.string().min(32).optional(),
    UPSTASH_REDIS_REST_URL: optionalUrl,
    UPSTASH_REDIS_REST_TOKEN: optionalText,
    EMAIL_TRANSPORT: z.enum(["resend", "demo"]).optional(),
    CSP_ENFORCE: z.enum(["true", "false"]).optional(),
  })
  .superRefine((value, context) => {
    const hasUpstashUrl = Boolean(value.UPSTASH_REDIS_REST_URL);
    const hasUpstashToken = Boolean(value.UPSTASH_REDIS_REST_TOKEN);

    if (hasUpstashUrl !== hasUpstashToken) {
      context.addIssue({
        code: "custom",
        message:
          "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together.",
        path: ["UPSTASH_REDIS_REST_URL"],
      });
    }

    if (value.EMAIL_TRANSPORT === "resend") {
      if (!value.RESEND_API_KEY || !value.CONTACT_TO_EMAIL || !value.RESEND_FROM_EMAIL) {
        context.addIssue({
          code: "custom",
          message:
            "EMAIL_TRANSPORT=resend requires RESEND_API_KEY, CONTACT_TO_EMAIL and RESEND_FROM_EMAIL.",
          path: ["EMAIL_TRANSPORT"],
        });
      }
    }

    if (value.REVALIDATE_SECRET && value.REVALIDATE_SECRET.length < 32) {
      context.addIssue({
        code: "custom",
        message: "REVALIDATE_SECRET must be at least 32 characters.",
        path: ["REVALIDATE_SECRET"],
      });
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid server environment: ${details}`);
}

export const env = parsed.data;

export const upstashConfigured = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN,
);

export function emailTransport(): "resend" | "demo" {
  if (env.EMAIL_TRANSPORT) return env.EMAIL_TRANSPORT;

  return env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.RESEND_FROM_EMAIL
    ? "resend"
    : "demo";
}

export const resendConfigured = Boolean(
  env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.RESEND_FROM_EMAIL,
);
