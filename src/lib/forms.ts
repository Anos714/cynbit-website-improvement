export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  reference?: string;
  retryAfterSeconds?: number;
  transport?: "resend" | "demo";
};

export const initialFormState: FormState = {
  status: "idle",
  message: "",
};

export const MIN_FORM_SECONDS = 2.5;
export const NEWSLETTER_SEEN_KEY = "cynbit_newsletter_seen";

export const contactInterests = [
  { value: "project", label: "A new project" },
  { value: "ai", label: "AI automation" },
  { value: "software", label: "Software engineering" },
  { value: "product", label: "Cynbit products" },
  { value: "bitelevate", label: "BitElevate" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Something else" },
] as const;

export type ContactInterest = (typeof contactInterests)[number]["value"];

export function isContactInterest(value: string | null): value is ContactInterest {
  return contactInterests.some((interest) => interest.value === value);
}
