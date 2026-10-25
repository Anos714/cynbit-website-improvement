"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { submitContact } from "@/lib/actions/contact";
import { FieldError, FormFeedback } from "@/components/forms/form-feedback";
import { useHydrated } from "@/lib/use-hydrated";
import { Button } from "@/components/ui/button";
import {
  contactInterests,
  initialFormState,
  isContactInterest,
} from "@/lib/forms";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialFormState);
  const hydrated = useHydrated();
  const interestRef = useRef<HTMLSelectElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("interest");
    if (isContactInterest(requested) && interestRef.current) {
      interestRef.current.value = requested;
    }
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="mt-8">
        <FormFeedback state={state} />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <FormFeedback state={state} />
      <form action={formAction} className="grid gap-5" noValidate>
        <input ref={startedAtRef} type="hidden" name="startedAt" />
        <div className="form-honey" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="contact-name">
              Your name *
            </label>
            <input
              className="field-input"
              id="contact-name"
              name="name"
              autoComplete="name"
              maxLength={120}
              placeholder="Rahul Sain"
              aria-invalid={Boolean(state.fieldErrors?.name)}
              aria-describedby={state.fieldErrors?.name ? "contact-name-error" : undefined}
              required
            />
            <FieldError id="contact-name" message={state.fieldErrors?.name?.[0]} />
          </div>
          <div>
            <label className="field-label" htmlFor="contact-email">
              Work email *
            </label>
            <input
              className="field-input"
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder="you@company.com"
              aria-invalid={Boolean(state.fieldErrors?.email)}
              aria-describedby={state.fieldErrors?.email ? "contact-email-error" : undefined}
              required
            />
            <FieldError id="contact-email" message={state.fieldErrors?.email?.[0]} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="contact-company">
              Company
            </label>
            <input
              className="field-input"
              id="contact-company"
              name="company"
              autoComplete="organization"
              maxLength={160}
              placeholder="Company or team"
              aria-invalid={Boolean(state.fieldErrors?.company)}
              aria-describedby={state.fieldErrors?.company ? "contact-company-error" : undefined}
            />
            <FieldError id="contact-company" message={state.fieldErrors?.company?.[0]} />
          </div>
          <div>
            <label className="field-label" htmlFor="contact-interest">
              What is this about?
            </label>
            <select
              ref={interestRef}
              className="field-input"
              id="contact-interest"
              name="interest"
              defaultValue="project"
              aria-invalid={Boolean(state.fieldErrors?.interest)}
              aria-describedby={state.fieldErrors?.interest ? "contact-interest-error" : undefined}
            >
              {contactInterests.map((interest) => (
                <option key={interest.value} value={interest.value}>
                  {interest.label}
                </option>
              ))}
            </select>
            <FieldError id="contact-interest" message={state.fieldErrors?.interest?.[0]} />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="contact-message">
            What are you building? *
          </label>
          <textarea
            className="field-input"
            id="contact-message"
            name="message"
            maxLength={5000}
            placeholder="The problem, the outcome you need and any constraints worth knowing."
            aria-invalid={Boolean(state.fieldErrors?.message)}
            aria-describedby={state.fieldErrors?.message ? "contact-message-error" : undefined}
            required
          />
          <FieldError id="contact-message" message={state.fieldErrors?.message?.[0]} />
        </div>

        <div className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            value="yes"
            className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
            aria-invalid={Boolean(state.fieldErrors?.consent)}
            aria-describedby={state.fieldErrors?.consent ? "contact-consent-error" : undefined}
            required
          />
          <div>
            <label htmlFor="contact-consent">
              I agree that Cynbit may use these details to respond to this inquiry. See the{" "}
              <Link href="/privacy" className="font-bold text-brand underline underline-offset-4">
                privacy policy
              </Link>
              .
            </label>
            <FieldError id="contact-consent" message={state.fieldErrors?.consent?.[0]} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            size="large"
            disabled={pending || !hydrated}
            aria-busy={pending || !hydrated}
          >
            {pending ? "Sending..." : "Send inquiry"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
          <p className="max-w-xs text-xs leading-relaxed text-muted">
            This form is not a newsletter sign-up. We will not add you to a marketing list.
          </p>
        </div>
      </form>
    </div>
  );
}
