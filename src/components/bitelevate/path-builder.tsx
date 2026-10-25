"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { learningDimensions } from "@/content/site-pages";
import { cn } from "@/lib/utils";

type Dimension = (typeof learningDimensions)[number];
type Cluster = Dimension["cluster"];

const clusters: Cluster[] = ["Build", "Intelligence", "Infrastructure", "Growth"];
const clusterTone: Record<Cluster, string> = {
  Build: "bg-mint",
  Intelligence: "bg-sky",
  Infrastructure: "bg-peach",
  Growth: "bg-white",
};

const MAX_SELECTION = 4;

export function PathBuilder({ dimensions }: { dimensions: readonly Dimension[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const selectedDimensions = selected
    .map((id) => dimensions.find((dimension) => dimension.id === id))
    .filter((dimension): dimension is Dimension => Boolean(dimension));

  function toggle(id: string) {
    if (selected.includes(id)) {
      setSelected((current) => current.filter((item) => item !== id));
      setMessage("");
      return;
    }

    if (selected.length >= MAX_SELECTION) {
      setMessage("Four modules is the maximum. Remove one to make room for another.");
      return;
    }

    setSelected((current) => [...current, id]);
    setMessage("");
  }

  const contactHref = `/contact?interest=bitelevate${
    selected.length ? `&path=${encodeURIComponent(selected.join(","))}` : ""
  }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="grid gap-8">
        {clusters.map((cluster) => {
          const clusterDimensions = dimensions.filter((dimension) => dimension.cluster === cluster);
          return (
            <fieldset key={cluster}>
              <legend className="mb-3 flex items-center gap-3 font-headline text-xl font-extrabold tracking-[-0.03em]">
                <span className={cn("grid size-7 place-items-center rounded-full text-[0.65rem] font-extrabold", clusterTone[cluster])}>
                  {clusterDimensions.length}
                </span>
                {cluster}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {clusterDimensions.map((dimension) => {
                  const isSelected = selected.includes(dimension.id);
                  const isAtLimit = selected.length >= MAX_SELECTION && !isSelected;
                  return (
                    <button
                      key={dimension.id}
                      type="button"
                      onClick={() => toggle(dimension.id)}
                      aria-pressed={isSelected}
                      aria-describedby={message ? "path-limit-message" : undefined}
                      className={cn(
                        "group flex min-h-[5.7rem] w-full items-start justify-between gap-4 rounded-[1.15rem] p-4 text-left transition-colors",
                        isSelected
                          ? "bg-brand-deep text-white"
                          : "bg-shell text-ink hover:bg-mint",
                        isAtLimit && "opacity-45",
                      )}
                    >
                      <span>
                        <span className="block text-[0.95rem] font-bold leading-snug">
                          {dimension.name}
                        </span>
                        <span
                          className={cn(
                            "mt-1 block text-xs leading-relaxed",
                            isSelected ? "text-white/65" : "text-muted",
                          )}
                        >
                          {dimension.description}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full",
                          isSelected ? "bg-amber text-ink" : "bg-white text-muted",
                        )}
                      >
                        {isSelected ? (
                          <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                        ) : (
                          <span aria-hidden="true" className="text-base leading-none">
                            +
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        <p
          id="path-limit-message"
          aria-live="polite"
          className="min-h-6 text-sm font-semibold text-danger"
        >
          {message}
        </p>
      </div>

      <aside className="rounded-card bg-brand-deep p-6 text-white lg:sticky lg:top-28">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/55">Your working path</p>
            <p className="mt-1 font-headline text-2xl font-extrabold tracking-[-0.04em]">
              {selected.length} of {MAX_SELECTION} chosen
            </p>
          </div>
          {selected.length ? (
            <button
              type="button"
              onClick={() => {
                setSelected([]);
                setMessage("");
              }}
              className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Reset learning path"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-2.5">
          {selectedDimensions.length ? (
            selectedDimensions.map((dimension) => (
              <div key={dimension.id} className="rounded-[1rem] bg-white/[0.07] p-3.5">
                <p className="text-xs font-semibold text-peach">{dimension.cluster}</p>
                <p className="mt-1 text-sm font-bold">{dimension.name}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[1rem] bg-white/[0.07] p-4 text-sm leading-relaxed text-white/60">
              Pick a few directions to assemble a starting point. You do not need to know the whole
              route before the first conversation.
            </div>
          )}
        </div>

        {selected.length ? (
          <Link href={contactHref} className="button-base button-on-dark mt-6 w-full">
            Talk through this path
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <span className="button-base mt-6 w-full bg-white/15 text-white/50">
            Talk through this path
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        )}
        <p className="mt-3 text-center text-xs leading-relaxed text-white/45">
          This is a conversation starter, not a formal enrolment.
        </p>
      </aside>
    </div>
  );
}
