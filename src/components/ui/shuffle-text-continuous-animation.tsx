"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface ShuffleTextContinuousProps {
  /** The text to display and shuffle */
  text: string;
  /** Milliseconds between each character reveal (default 30) */
  speed?: number;
  /** Milliseconds to pause after full reveal before reshuffling (default 2000) */
  pauseDuration?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

/** Text that continuously shuffles random characters then reveals the real text, repeating forever */
export function ShuffleTextContinuous({
  text,
  speed = 30,
  pauseDuration = 2000,
  className,
  style,
}: ShuffleTextContinuousProps) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runShuffle = useCallback(() => {
    let iteration = 0;
    const len = text.length;

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const revealed = Math.floor(iteration / 3); // reveal 1 char every 3 ticks

      const result = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealed) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplay(result);
      iteration++;

      if (revealed >= len) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplay(text);
        // Pause then reshuffle
        timeoutRef.current = setTimeout(runShuffle, pauseDuration);
      }
    }, speed);
  }, [text, speed, pauseDuration]);

  useEffect(() => {
    runShuffle();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [runShuffle]);

  return (
    <span className={className} style={style}>
      {display}
    </span>
  );
}
