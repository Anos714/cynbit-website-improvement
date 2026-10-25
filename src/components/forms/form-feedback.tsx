import { CircleAlert, CircleCheck } from "lucide-react";
import type { FormState } from "@/lib/forms";

export function FormFeedback({
  state,
  showReset = true,
}: {
  state: FormState;
  showReset?: boolean;
}) {
  if (state.status === "idle") return null;

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-card bg-mint p-6">
        <CircleCheck aria-hidden="true" className="size-6 text-brand" />
        <p className="mt-3 font-headline text-xl font-extrabold tracking-[-0.03em]">
          Received.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{state.message}</p>
        {state.transport === "demo" ? (
          <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs leading-relaxed text-muted">
            Demo mode: no email provider is configured. The submission was accepted and logged
            with a reference, but no email was sent.
          </p>
        ) : null}
        {state.reference ? (
          <p className="mt-3 text-xs text-muted">
            Reference: <span className="font-mono">{state.reference}</span>
          </p>
        ) : null}
        {showReset ? (
          <a href="." className="mt-4 inline-flex min-h-10 items-center font-bold text-brand">
            Send another
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div role="alert" className="rounded-card border-2 border-danger/25 bg-danger/5 p-4">
      <p className="flex items-start gap-2 text-sm font-semibold leading-relaxed text-danger">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        {state.message}
      </p>
      {state.retryAfterSeconds ? (
        <p className="mt-2 pl-6 text-xs font-semibold text-danger/80">
          Try again in {state.retryAfterSeconds} seconds.
        </p>
      ) : null}
      {state.reference ? (
        <p className="mt-2 pl-6 text-xs text-muted">
          Reference: <span className="font-mono">{state.reference}</span>
        </p>
      ) : null}
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-danger">
      {message}
    </p>
  );
}
