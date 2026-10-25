"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  as?: "div" | "section" | "article" | "li";
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = m[as];

  return (
    <Component
      data-reveal=""
      className={cn(className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
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
