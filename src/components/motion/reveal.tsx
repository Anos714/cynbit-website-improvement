import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const revealTags = {
  div: "div",
  section: "section",
  article: "article",
  li: "li",
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 26,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  as?: keyof typeof revealTags;
}) {
  const Component = revealTags[as];
  const style = {
    "--reveal-delay": `${delay}s`,
    "--reveal-distance": `${distance}px`,
  } as CSSProperties;

  return (
    <Component data-reveal="" className={cn(className)} style={style}>
      {children}
    </Component>
  );
}

export function RevealHeading({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal className={className} delay={delay}>
      {children}
    </Reveal>
  );
}
