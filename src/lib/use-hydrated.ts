"use client";

import { useEffect, useState } from "react";

/**
 * Returns false until the component has hydrated and painted once.
 *
 * Forms disable their submit button while this is false so a very early click
 * cannot fall through to the browser's native form submission before React has
 * attached the Server Action. The state update is scheduled in a frame callback
 * rather than synchronously inside the effect.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return hydrated;
}
