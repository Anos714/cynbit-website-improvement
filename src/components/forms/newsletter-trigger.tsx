"use client";

import { cn } from "@/lib/utils";

export function NewsletterTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("cynbit:newsletter"))}
      className={cn(
        "inline-flex min-h-9 items-center text-xs font-medium transition-colors hover:text-white",
        className,
      )}
    >
      Newsletter
    </button>
  );
}
