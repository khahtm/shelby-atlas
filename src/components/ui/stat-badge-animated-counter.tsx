"use client";

import { useEffect, useRef, useState } from "react";

interface StatBadgeAnimatedCounterProps {
  value: number;
  label: string;
  x: number;
  y: number;
}

/** Floating animated counter that counts up from 0 to value on mount */
export function StatBadgeAnimatedCounter({
  value,
  label,
  x,
  y,
}: StatBadgeAnimatedCounterProps) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const duration = 1200;

  useEffect(() => {
    startRef.current = null;

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const formatted = displayed.toLocaleString();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div
        className="font-pixel"
        style={{
          color: "#00e5ff",
          fontSize: 10,
          lineHeight: 1.4,
          textShadow: "0 0 8px rgba(0,229,255,0.6)",
        }}
      >
        {formatted}
      </div>
      <div
        className="font-mono-pixel"
        style={{
          color: "var(--text-muted)",
          fontSize: 13,
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}
