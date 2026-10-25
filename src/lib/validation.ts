import { z } from "zod";
import { contactInterests, MIN_FORM_SECONDS } from "@/lib/forms";

const trimmedText = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .min(min, message)
    .max(max, `Please keep this under ${max.toLocaleString("en-IN")} characters.`);

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "That email address is too long.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

const httpUrl = z
  .string()
  .trim()
  .max(500, "That link is too long.")
  .url("Enter a full URL, including https://.")
  .refine((value) => /^https?:\/\//i.test(value), "Use an http or https link.");

const optionalHttpUrl = z
  .string()
  .trim()
  .max(500, "That link is too long.")
  .refine((value) => value === "" || /^https?:\/\//i.test(value), "Use an http or https link.")
  .optional();

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max.toLocaleString("en-IN")} characters.`)
    .optional();

const consent = z.boolean().refine(Boolean, "Please accept the privacy notice to continue.");

const interestValues = contactInterests.map((interest) => interest.value);

export const contactSchema = z
  .object({
    name: trimmedText(2, 120, "Enter your name."),
    email,
    company: optionalText(160),
    interest: z.enum(interestValues),
    message: trimmedText(20, 5000, "Tell us a little about the project (at least 20 characters)."),
    consent,
  })
  .strict();

export const careerApplicationSchema = z
  .object({
    role: z.string().trim().min(1, "Choose a role.").max(120),
    name: trimmedText(2, 120, "Enter your full name."),
    email,
    location: optionalText(120),
    portfolio: httpUrl,
    linkedin: optionalHttpUrl,
    message: trimmedText(20, 5000, "Tell us why this role interests you (at least 20 characters)."),
    consent,
  })
  .strict();

export const newsletterSchema = z
  .object({
    email,
    consent,
  })
  .strict();

export function isFormTooFast(startedAt: string, now = Date.now()) {
  const value = Number(startedAt);
  if (!startedAt || !Number.isFinite(value) || value <= 0) return true;
  return now - value < MIN_FORM_SECONDS * 1000;
}

export type ContactInput = z.infer<typeof contactSchema>;
export type CareerApplicationInput = z.infer<typeof careerApplicationSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
