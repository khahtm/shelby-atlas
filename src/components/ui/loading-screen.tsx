"use client";

import { useEffect, useState } from "react";
import { DecryptedTextReveal } from "./decrypted-text-reveal-animation";

interface LoadingScreenProps {
  isReady: boolean;
}

/** Full-screen loading overlay — Press Start 2P title, progress bar, version tag */
export function LoadingScreen({ isReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dotFrame, setDotFrame] = useState(0);

  useEffect(() => {
    if (isReady) {
      // Slow ramp to 100% then hold for a moment so user can read
      const ramp = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(ramp); return 100; }
          return Math.min(p + 2, 100);
        });
      }, 30);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => { clearInterval(ramp); clearTimeout(timer); };
    }
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 6, 85));
    }, 400);
    return () => clearInterval(interval);
  }, [isReady]);

  // Animate dots by cycling visibility
  useEffect(() => {
    const interval = setInterval(() => {
      setDotFrame((f) => (f + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const dots = ["·", "· ·", "· · ·"][Math.min(dotFrame, 2)];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-deep)]"
      style={{
        opacity: isReady ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        pointerEvents: isReady ? "none" : "auto",
      }}
    >
      {/* Sub-label above title */}
      <p className="font-pixel text-[14px] text-[var(--cyan)] tracking-[4px] mb-6" style={{ opacity: 0.5 }}>
        SHELBY ATLAS
      </p>

      {/* Main title */}
      <h1 className="font-pixel text-[18px] text-[var(--text-primary)] mb-3 tracking-wide">
        Forging the Atlas...
      </h1>

      {/* Animated dots */}
      <p className="font-mono text-[24px] font-bold text-[var(--cyan)] tracking-[8px] mb-8 min-h-[32px]">
        {dots}
      </p>

      {/* Progress bar — 360px wide, 6px tall */}
      <div className="w-[360px] h-[6px] rounded-[3px] bg-[var(--bg-card)] overflow-hidden mb-3">
        <div
          className="h-full rounded-[3px] transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #22D3EE, #00f0ff)",
            boxShadow: "0 0 12px #00f0ff66",
          }}
        />
      </div>

      {/* Percentage */}
      <p className="font-mono text-[11px] font-medium text-[var(--text-muted)] tracking-[1.5px]">
        {Math.round(progress)}%
      </p>

      {/* Decrypted text flavor */}
      <div className="mt-6">
        <DecryptedTextReveal
          text="Shelby, i need API, pls!!!"
          speed={45}
          revealDelay={5}
          loop
          loopPause={1500}
          className="font-mono text-[12px] tracking-[1px]"
          style={{ color: "var(--cyan)", opacity: 0.6 }}
        />
      </div>

      {/* Version tag — pinned near bottom */}
      <p
        className="absolute bottom-8 font-mono text-[10px] font-medium text-[var(--text-muted)] tracking-[2px]"
        style={{ opacity: 0.4 }}
      >
        v0.1.0
      </p>
    </div>
  );
}
