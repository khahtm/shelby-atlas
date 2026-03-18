"use client";

import { useEffect, useRef, useState } from "react";
import {
  TERMINAL_LINES,
  TYPING_SPEED_MS,
  TERMINAL_LOOP_PAUSE_MS,
} from "@/src/data/terminal-sequence";

interface DisplayLine {
  text: string;
  isCommand: boolean;
  complete: boolean;
}

/** Typewriter CLI terminal for the Workshop district */
export function MiniTerminalTypewriterWorkshop() {
  const [lines, setLines] = useState<DisplayLine[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const scheduleTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  useEffect(() => {
    // Blinking cursor interval
    const cursorId = setInterval(
      () => setCursorVisible((v) => !v),
      800,
    );

    function runSequence() {
      setLines([]);
      let totalDelay = 0;

      TERMINAL_LINES.forEach((line, lineIdx) => {
        totalDelay += line.delay;

        if (line.type === "blank") {
          // Just pause, no output
          return;
        }

        if (line.type === "output") {
          scheduleTimeout(() => {
            setLines((prev) => [
              ...prev,
              { text: line.text, isCommand: false, complete: true },
            ]);
          }, totalDelay);
          return;
        }

        // Command: type char by char
        const chars = line.text.split("");
        // Push empty command line placeholder
        scheduleTimeout(() => {
          setLines((prev) => [
            ...prev,
            { text: "", isCommand: true, complete: false },
          ]);
        }, totalDelay);

        chars.forEach((_, charIdx) => {
          totalDelay += TYPING_SPEED_MS;
          const capturedDelay = totalDelay;
          const partial = line.text.slice(0, charIdx + 1);
          scheduleTimeout(() => {
            setLines((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.isCommand) {
                next[next.length - 1] = {
                  ...last,
                  text: partial,
                  complete: charIdx === chars.length - 1,
                };
              }
              return next;
            });
          }, capturedDelay);
        });
      });

      // Loop restart after final pause
      totalDelay += TERMINAL_LOOP_PAUSE_MS;
      scheduleTimeout(() => {
        clearTimeouts();
        runSequence();
      }, totalDelay);
    }

    runSequence();

    return () => {
      clearTimeouts();
      clearInterval(cursorId);
    };
  }, []);

  return (
    <div
      style={{
        width: 320,
        height: 200,
        background: "#0a0e1a",
        border: "1px solid rgba(0,255,136,0.3)",
        borderRadius: 6,
        padding: "12px 14px",
        overflow: "hidden",
        fontFamily: "VT323, monospace",
        fontSize: 14,
        color: "#00ff88",
        lineHeight: 1.5,
        position: "relative",
      }}
    >
      {/* Terminal header bar */}
      <div
        style={{
          fontSize: 11,
          color: "rgba(0,255,136,0.4)",
          marginBottom: 8,
          borderBottom: "1px solid rgba(0,255,136,0.15)",
          paddingBottom: 4,
        }}
      >
        shelby-cli v0.1 — shelbynet
      </div>

      {/* Lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            <span style={{ color: line.isCommand ? "#00ff88" : "rgba(0,255,136,0.65)" }}>
              {line.text}
            </span>
            {/* Blinking cursor on last incomplete command line */}
            {i === lines.length - 1 && line.isCommand && !line.complete && (
              <span style={{ opacity: cursorVisible ? 1 : 0 }}>_</span>
            )}
          </div>
        ))}
        {/* Trailing cursor when all lines complete */}
        {(lines.length === 0 || lines[lines.length - 1]?.complete) && (
          <div>
            <span style={{ opacity: cursorVisible ? 1 : 0 }}>_</span>
          </div>
        )}
      </div>
    </div>
  );
}
