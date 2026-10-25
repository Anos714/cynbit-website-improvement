import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Tag({
  className,
  tone = "default",
  ...props
}: ComponentPropsWithoutRef<"span"> & {
  tone?: "default" | "brand" | "amber" | "on-dark";
}) {
  const tones = {
    default: "bg-white/75 text-ink",
    brand: "bg-brand text-white",
    amber: "bg-amber text-ink",
    "on-dark": "bg-white/12 text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-3 py-1 text-[0.8rem] font-bold leading-none",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
