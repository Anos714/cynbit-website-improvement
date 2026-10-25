"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Container } from "@/components/ui/container";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(`[error-boundary] digest=${error.digest ?? "none"}`);
  }, [error]);

  return (
    <div className="section-space">
      <Container>
        <div className="max-w-2xl rounded-card bg-shell p-8 md:p-12">
          <p className="text-sm font-bold text-brand">Something broke on our side</p>
          <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-[-0.045em] md:text-5xl">
            This section could not load.
          </h1>
          <p className="body-lead mt-5 max-w-xl">
            The rest of the site is still here. Retry the section, or head back to the homepage
            if the problem continues.
          </p>
          {error.digest ? (
            <p className="mt-5 text-sm text-muted">
              Reference: <span className="font-mono text-ink">{error.digest}</span>
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3 text-sm font-bold transition-colors hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
