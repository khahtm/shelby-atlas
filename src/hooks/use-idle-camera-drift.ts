"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const IDLE_THRESHOLD_MS = 10_000;

/** Tracks user inactivity and signals when camera should auto-drift */
export function useIdleCameraDrift() {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdle = useCallback(() => {
    setIsIdle(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsIdle(true), IDLE_THRESHOLD_MS);
  }, []);

  useEffect(() => {
    const events = ["pointermove", "pointerdown", "wheel", "keydown"] as const;

    events.forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }));

    // Start the initial idle timer
    timerRef.current = setTimeout(() => setIsIdle(true), IDLE_THRESHOLD_MS);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetIdle));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetIdle]);

  return { isIdle, resetIdle };
}
