"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const phrases = ["what's next.", "what works.", "what lasts.", "what scales."];
const ROTATE_MS = 3200;

export function HeroRotator() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      const next = (indexRef.current + 1) % phrases.length;
      setPrevious(indexRef.current);
      setCurrent(next);
      setAnimated(true);
      indexRef.current = next;
    }, ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <span className="hero-rotator" aria-hidden="true">
      {phrases.map((phrase, index) => (
        <span
          key={phrase}
          className={cn(
            "hero-rotator-word text-brand",
            index === current && (animated ? "is-entering" : "is-current"),
            index === previous && "is-leaving",
          )}
        >
          {phrase}
        </span>
      ))}
    </span>
  );
}
