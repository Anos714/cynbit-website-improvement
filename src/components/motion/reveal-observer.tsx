"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * A single observer for every data-reveal element keeps the effect out of each
 * section component. It falls back to visible content when IntersectionObserver
 * is unavailable and the CSS honours prefers-reduced-motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!("IntersectionObserver" in window)) {
      for (const element of elements) element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    for (const element of elements) {
      if (!element.classList.contains("is-visible")) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
