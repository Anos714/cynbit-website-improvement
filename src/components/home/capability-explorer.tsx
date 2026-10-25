"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import type { ServicePractice } from "@/content/site-pages";
import { cn } from "@/lib/utils";

const toneClasses = {
  mint: "bg-mint",
  sky: "bg-sky",
  peach: "bg-peach",
} as const;

export function CapabilityExplorer({ practices }: { practices: ServicePractice[] }) {
  const [activeId, setActiveId] = useState(practices[0]?.id);
  const shouldReduceMotion = useReducedMotion();
  const panelId = useId();
  const activePractice = practices.find((practice) => practice.id === activeId) ?? practices[0];

  if (!activePractice) return null;

  return (
    <div className="rounded-[2rem] bg-shell p-4 md:p-5">
      <div
        className="grid grid-cols-3 gap-1.5 rounded-[1.25rem] bg-ground p-1.5"
        aria-label="Choose a Cynbit practice"
      >
        {practices.map((practice) => {
          const isActive = practice.id === activePractice.id;
          return (
            <button
              key={practice.id}
              type="button"
              aria-pressed={isActive}
              aria-controls={panelId}
              onClick={() => setActiveId(practice.id)}
              className={cn(
                "min-h-11 rounded-[0.95rem] px-2 text-[0.78rem] font-bold leading-tight transition-colors md:text-[0.84rem]",
                isActive
                  ? cn(toneClasses[practice.tone], "text-ink")
                  : "text-muted hover:bg-white hover:text-ink",
              )}
            >
              {practice.title}
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        className="mt-3 min-h-[24.5rem] overflow-hidden rounded-[1.4rem] bg-brand-deep p-5 text-white md:min-h-[25.5rem] md:p-6"
        aria-live="polite"
      >
        <AnimatePresence initial={false} mode="wait">
          <m.div
            key={activePractice.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold text-white/55">One studio. Three ways in.</p>
            <h2 className="mt-4 font-headline text-[clamp(2rem,3.4vw,3.15rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
              {activePractice.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-[0.95rem]">
              {activePractice.summary}
            </p>

            <ul className="mt-6 grid gap-3">
              {activePractice.services.slice(0, 3).map((service) => (
                <li key={service.title} className="flex items-start gap-3 text-sm">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-amber" />
                  <span className="font-semibold text-white">{service.title}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/services#${activePractice.id}`}
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-bold text-peach transition-colors hover:text-white"
            >
              Explore this practice
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
