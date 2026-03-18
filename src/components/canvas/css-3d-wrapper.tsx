"use client";

import { forwardRef, type ReactNode } from "react";

interface CSS3DWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper div with CSS perspective for pseudo-3D fly-in effects.
 * GSAP can animate transform on this ref in later phases.
 */
export const CSS3DWrapper = forwardRef<HTMLDivElement, CSS3DWrapperProps>(
  function CSS3DWrapper({ children }, ref) {
    return (
      <div
        ref={ref}
        className="h-full w-full"
        style={{
          perspective: "800px",
          willChange: "transform",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    );
  },
);
