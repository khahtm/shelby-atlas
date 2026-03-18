"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "█▓▒░╔╗╚╝║═╬┼┴┬├┤▄▀■□●○◆◇★☆⊕⊗∆∇";

interface DecryptedTextRevealProps {
  /** Final revealed text */
  text: string;
  /** Milliseconds per tick (default 40) */
  speed?: number;
  /** How many ticks each char stays encrypted before revealing (default 6) */
  revealDelay?: number;
  /** Whether to loop the animation (default false) */
  loop?: boolean;
  /** Pause between loops in ms (default 2000) */
  loopPause?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

/** Text that decrypts character-by-character from random symbols to the real text */
export function DecryptedTextReveal({
  text,
  speed = 40,
  revealDelay = 6,
  loop = false,
  loopPause = 2000,
  className,
  style,
}: DecryptedTextRevealProps) {
  const [display, setDisplay] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function run() {
      let tick = 0;

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        const result = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            // Each char reveals after (i * revealDelay) ticks
            const charTick = tick - i * revealDelay;
            if (charTick < 0) return ""; // not yet visible
            if (charTick >= revealDelay) return char; // fully revealed
            // Still decrypting — show random char
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplay(result);
        tick++;

        // All characters revealed
        const totalTicks = text.length * revealDelay + revealDelay;
        if (tick > totalTicks) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplay(text);

          if (loop) {
            timeoutRef.current = setTimeout(() => {
              setDisplay("");
              run();
            }, loopPause);
          }
        }
      }, speed);
    }

    run();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, revealDelay, loop, loopPause]);

  return (
    <span className={className} style={{ ...style, whiteSpace: "pre" }}>
      {display}
    </span>
  );
}
