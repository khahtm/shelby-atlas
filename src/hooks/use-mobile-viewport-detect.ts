"use client";

import { useEffect, useState } from "react";

/** Detects mobile viewport via matchMedia and touch capability */
export function useMobileViewportDetect(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const narrowScreen = window.matchMedia("(max-width: 768px)").matches;
      const hasTouch = "ontouchstart" in window;
      setIsMobile(narrowScreen || hasTouch);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
