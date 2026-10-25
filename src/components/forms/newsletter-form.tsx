"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";
import { FieldError, FormFeedback } from "@/components/forms/form-feedback";
import { useHydrated } from "@/lib/use-hydrated";
import { Button } from "@/components/ui/button";
import { initialFormState } from "@/lib/forms";

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialFormState,
  );
  const hydrated = useHydrated();
  const emailRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    emailRef.current?.focus();
  }, []);

  if (state.status === "success") {
    return <FormFeedback state={state} showReset={false} />;
  }

  return (
    <div>
      <FormFeedback state={state} />
      <form action={formAction} className="mt-4 grid gap-4" noValidate>
        <input ref={startedAtRef} type="hidden" name="startedAt" />
        <div className="form-honey" aria-hidden="true">
          <label htmlFor="newsletter-website">Website</label>
          <input
            id="newsletter-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="newsletter-email">
            Email address *
          </label>
          <input
            ref={emailRef}
            className="field-input"
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@company.com"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? "newsletter-email-error" : undefined}
            required
          />
          <FieldError id="newsletter-email" message={state.fieldErrors?.email?.[0]} />
        </div>

        <div className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            id="newsletter-consent"
            name="consent"
            type="checkbox"
            value="yes"
            className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
            aria-invalid={Boolean(state.fieldErrors?.consent)}
            aria-describedby={state.fieldErrors?.consent ? "newsletter-consent-error" : undefined}
            required
          />
          <div>
            <label htmlFor="newsletter-consent">
              I agree that Cynbit may email me occasional notes. No more than once a month.
            </label>
            <FieldError id="newsletter-consent" message={state.fieldErrors?.consent?.[0]} />
          </div>
        </div>

        <Button
          type="submit"
          size="large"
          disabled={pending || !hydrated}
          aria-busy={pending || !hydrated}
        >
          {pending ? "Joining..." : "Join the list"}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </form>
    </div>
  );
}
