"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "shelby-atlas-tour-completed";

interface TourStep {
  title: string;
  text: string;
  /** CSS position of the tooltip bubble */
  position: { top?: string; bottom?: string; left?: string; right?: string };
  /** Arrow direction pointing toward the target */
  arrow: "down" | "up" | "left" | "right" | "none";
}

const STEPS: TourStep[] = [
  {
    title: "Welcome to Shelby Atlas",
    text: "An interactive city map of the Shelby ecosystem. Let's take a quick tour!",
    position: { top: "50%", left: "50%" },
    arrow: "none",
  },
  {
    title: "Districts",
    text: "Each glowing zone is a District — a core pillar of Shelby's infrastructure.",
    position: { top: "45%", left: "50%" },
    arrow: "down",
  },
  {
    title: "Hover to Preview",
    text: "Hover over any district to see its border light up with neon glow and a quick info tooltip.",
    position: { top: "40%", left: "35%" },
    arrow: "right",
  },
  {
    title: "Click to Explore",
    text: "Click a district to zoom in and open a detailed info panel on the right side.",
    position: { top: "35%", left: "55%" },
    arrow: "left",
  },
  {
    title: "Track Your Progress",
    text: "The HUD in the top-right tracks how many districts you've explored. Discover them all!",
    position: { top: "90px", right: "380px" },
    arrow: "right",
  },
  {
    title: "Navigate Freely",
    text: "Drag to pan, scroll to zoom. Press ESC to return to the overview. Enjoy exploring!",
    position: { top: "50%", left: "50%" },
    arrow: "none",
  },
];

/** Step-by-step onboarding tour for first-time visitors */
export function OnboardingStepByStepTourOverlay() {
  const [step, setStep] = useState(-1); // -1 = not started / completed
  const [visible, setVisible] = useState(false);

  // Always show tour on page load (delayed so scene loads first)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(0);
      setVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = useCallback(() => {
    if (step >= STEPS.length - 1) {
      // Tour complete
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, "true");
      setTimeout(() => setStep(-1), 300);
    } else {
      setStep((s) => s + 1);
    }
  }, [step]);

  const handleSkip = useCallback(() => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
    setTimeout(() => setStep(-1), 300);
  }, []);

  if (step < 0) return null;

  const current = STEPS[step];
  const isCenter = !current.position.right && current.position.left === "50%";

  return (
    <>
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={handleSkip}
      />

      {/* Tooltip bubble */}
      <div
        className="fixed z-50 transition-all duration-300"
        style={{
          ...current.position,
          transform: isCenter ? "translate(-50%, -50%)" : undefined,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative rounded-lg px-6 py-5 font-mono max-w-[320px]"
          style={{
            background: "rgba(10, 14, 26, 0.95)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            boxShadow: "0 0 30px rgba(0, 240, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Arrow indicators */}
          {current.arrow === "down" && (
            <div
              className="absolute left-1/2 -bottom-2"
              style={{
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid rgba(0, 240, 255, 0.3)",
              }}
            />
          )}
          {current.arrow === "up" && (
            <div
              className="absolute left-1/2 -top-2"
              style={{
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "8px solid rgba(0, 240, 255, 0.3)",
              }}
            />
          )}
          {current.arrow === "right" && (
            <div
              className="absolute top-1/2 -right-2"
              style={{
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "8px solid rgba(0, 240, 255, 0.3)",
              }}
            />
          )}
          {current.arrow === "left" && (
            <div
              className="absolute top-1/2 -left-2"
              style={{
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderRight: "8px solid rgba(0, 240, 255, 0.3)",
              }}
            />
          )}

          {/* Step counter */}
          <div
            className="text-[9px] tracking-[2px] uppercase mb-2"
            style={{ color: "rgba(0, 240, 255, 0.5)" }}
          >
            STEP {step + 1} OF {STEPS.length}
          </div>

          {/* Title */}
          <h3
            className="font-pixel text-[16px] tracking-[2px] mb-2"
            style={{ color: "var(--cyan)" }}
          >
            {current.title}
          </h3>

          {/* Body */}
          <p className="text-[12px] text-[var(--text-muted)] leading-[1.5] mb-4">
            {current.text}
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-[10px] tracking-[1px] text-[var(--text-muted)] bg-transparent border-0 cursor-pointer hover:text-white transition-colors"
            >
              SKIP TOUR
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded text-[11px] tracking-[1px] font-medium cursor-pointer border-0 transition-all duration-200"
              style={{
                background: "rgba(0, 240, 255, 0.15)",
                color: "var(--cyan)",
                border: "1px solid rgba(0, 240, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 240, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 240, 255, 0.15)";
              }}
            >
              {step >= STEPS.length - 1 ? "START EXPLORING" : "NEXT"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
