import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  intro,
  action,
  tone = "default",
  className,
  headingLevel: Heading = "h2",
}: {
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "inverted";
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "grid items-end gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.7fr)]",
        className,
      )}
    >
      <div>
        <Heading className="display-section">{title}</Heading>
        {intro ? (
          <p
            className={cn(
              "body-lead mt-7",
              tone === "inverted" && "text-white/75",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="lg:justify-self-end">{action}</div> : null}
    </div>
  );
}
