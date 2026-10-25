"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(`[global-error] digest=${error.digest ?? "none"}`);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="grid min-h-svh place-items-center px-6 py-16">
          <div className="w-full max-w-xl rounded-card bg-shell p-8 md:p-12">
            <p className="text-sm font-bold text-brand">Cynbit Technologies</p>
            <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-[-0.045em]">
              The site could not start.
            </h1>
            <p className="mt-5 text-muted">
              A critical error interrupted rendering. Reloading usually fixes it; if not,
              email{" "}
              <a className="font-bold text-brand underline" href="mailto:support@cynbit.in">
                support@cynbit.in
              </a>
              .
            </p>
            {error.digest ? (
              <p className="mt-5 text-sm text-muted">
                Reference: <span className="font-mono text-ink">{error.digest}</span>
              </p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Reload the site
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
