"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { submitCareerApplication } from "@/lib/actions/careers";
import { FieldError, FormFeedback } from "@/components/forms/form-feedback";
import { useHydrated } from "@/lib/use-hydrated";
import { Button } from "@/components/ui/button";
import { initialFormState } from "@/lib/forms";

export function CareerApplicationForm({
  roleSlug,
  roleTitle,
}: {
  roleSlug: string;
  roleTitle: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitCareerApplication,
    initialFormState,
  );
  const hydrated = useHydrated();
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="mt-5">
        <FormFeedback state={state} />
      </div>
    );
  }

  return (
    <div>
      <FormFeedback state={state} />
      <form
        action={formAction}
        className="mt-5 grid gap-5 rounded-card bg-shell p-6 md:p-8"
        noValidate
      >
        <input type="hidden" name="role" value={roleSlug} />
        <input ref={startedAtRef} type="hidden" name="startedAt" />
        <p className="sr-only">Applying for {roleTitle}</p>
        <div className="form-honey" aria-hidden="true">
          <label htmlFor="career-website">Website</label>
          <input id="career-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="career-name">
              Full name *
            </label>
            <input
              className="field-input"
              id="career-name"
              name="name"
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(state.fieldErrors?.name)}
              aria-describedby={state.fieldErrors?.name ? "career-name-error" : undefined}
              required
            />
            <FieldError id="career-name" message={state.fieldErrors?.name?.[0]} />
          </div>
          <div>
            <label className="field-label" htmlFor="career-email">
              Email *
            </label>
            <input
              className="field-input"
              id="career-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              aria-describedby={state.fieldErrors?.email ? "career-email-error" : undefined}
              required
            />
            <FieldError id="career-email" message={state.fieldErrors?.email?.[0]} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="career-location">
              Current location
            </label>
            <input
              className="field-input"
              id="career-location"
              name="location"
              autoComplete="address-level2"
              maxLength={120}
              placeholder="City, country"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="career-portfolio">
              Portfolio or GitHub *
            </label>
            <input
              className="field-input"
              id="career-portfolio"
              name="portfolio"
              type="url"
              maxLength={500}
              placeholder="https://"
              aria-invalid={Boolean(state.fieldErrors?.portfolio)}
              aria-describedby={
                state.fieldErrors?.portfolio ? "career-portfolio-error" : undefined
              }
              required
            />
            <FieldError id="career-portfolio" message={state.fieldErrors?.portfolio?.[0]} />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="career-linkedin">
            LinkedIn or resume link
          </label>
          <input
            className="field-input"
            id="career-linkedin"
            name="linkedin"
            type="url"
            maxLength={500}
            placeholder="https://"
            aria-invalid={Boolean(state.fieldErrors?.linkedin)}
            aria-describedby={state.fieldErrors?.linkedin ? "career-linkedin-error" : undefined}
          />
          <FieldError id="career-linkedin" message={state.fieldErrors?.linkedin?.[0]} />
        </div>
        <div>
          <label className="field-label" htmlFor="career-message">
            Why this role? *
          </label>
          <textarea
            className="field-input"
            id="career-message"
            name="message"
            maxLength={5000}
            placeholder="A short note on the work you have done and what you want to build next."
            aria-invalid={Boolean(state.fieldErrors?.message)}
            aria-describedby={state.fieldErrors?.message ? "career-message-error" : undefined}
            required
          />
          <FieldError id="career-message" message={state.fieldErrors?.message?.[0]} />
        </div>
        <div className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            id="career-consent"
            name="consent"
            type="checkbox"
            value="yes"
            className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
            aria-invalid={Boolean(state.fieldErrors?.consent)}
            aria-describedby={state.fieldErrors?.consent ? "career-consent-error" : undefined}
            required
          />
          <div>
            <label htmlFor="career-consent">
              I agree that Cynbit may use these details to assess this application. See the{" "}
              <Link href="/privacy" className="font-bold text-brand underline underline-offset-4">
                privacy policy
              </Link>
              .
            </label>
            <FieldError id="career-consent" message={state.fieldErrors?.consent?.[0]} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            size="large"
            disabled={pending || !hydrated}
            aria-busy={pending || !hydrated}
          >
            {pending ? "Sending..." : "Send application"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
          <p className="max-w-xs text-xs leading-relaxed text-muted">
            Applications are reviewed by the team you would work with.
          </p>
        </div>
      </form>
    </div>
  );
}
