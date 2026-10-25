"use client";

import { X } from "lucide-react";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function NewsletterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="newsletter-title"
      aria-describedby="newsletter-copy"
      className="m-auto w-[min(92vw,32rem)] max-w-none rounded-card bg-shell p-0 text-ink backdrop:bg-ink/55"
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <LazyMotion features={domAnimation} strict>
        <m.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative p-6 md:p-8"
        >
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-mint text-ink"
            aria-label="Close newsletter dialog"
          >
            <X aria-hidden="true" className="size-4" />
          </button>

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Cynbit notes
          </p>
          <h2
            id="newsletter-title"
            className="mt-3 max-w-[15ch] font-headline text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-[0.98] tracking-[-0.05em]"
          >
            One useful idea, once a month.
          </h2>
          <p id="newsletter-copy" className="mt-3 text-sm leading-relaxed text-muted">
            Short notes on shipping AI, building durable software and the decisions behind the
            work. No drip sequence, no daily noise.
          </p>

          <div className="mt-6">
            <NewsletterForm />
          </div>
        </m.div>
      </LazyMotion>
    </dialog>
  );
}
