import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export function PageHeader({
  title,
  intro,
  children,
  tone = "mint",
  className,
}: {
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  tone?: "mint" | "sky" | "peach" | "ground";
  className?: string;
}) {
  const background = {
    mint: "bg-mint",
    sky: "bg-sky",
    peach: "bg-peach",
    ground: "bg-ground",
  }[tone];

  return (
    <header className={cn("pb-16 pt-16 md:pb-24 md:pt-24", background, className)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)] lg:items-end">
          <div>
            <h1 className="display-page max-w-[13ch]">{title}</h1>
            {intro ? <p className="body-lead mt-8 max-w-2xl">{intro}</p> : null}
          </div>
          {children ? <div className="lg:justify-self-end">{children}</div> : null}
        </div>
      </Container>
    </header>
  );
}
