"use client";

import { useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

/** Padding beyond DISTRICT_SIZE for the territory border */
const BORDER_PAD = 40;

interface DistrictTerritoryBorderProps {
  hw: number;
  hh: number;
  color: number;
  alpha?: number;
  fillAlpha?: number;
  /** When true, neon light chases around the border */
  hovered?: boolean;
}

/** Get a point along the diamond perimeter at progress t (0-1) */
function diamondPoint(bw: number, bh: number, t: number): { x: number; y: number } {
  const p = ((t % 1) + 1) % 1; // normalize 0-1
  if (p < 0.25) {
    const s = p / 0.25;
    return { x: bw * s, y: -bh * (1 - s) };
  } else if (p < 0.5) {
    const s = (p - 0.25) / 0.25;
    return { x: bw * (1 - s), y: bh * s };
  } else if (p < 0.75) {
    const s = (p - 0.5) / 0.25;
    return { x: -bw * s, y: bh * (1 - s) };
  } else {
    const s = (p - 0.75) / 0.25;
    return { x: -bw * (1 - s), y: -bh * s };
  }
}

/** Isometric diamond border with animated neon chase on hover */
export function DistrictTerritoryBorder({
  hw,
  hh,
  color,
  alpha = 0.35,
  fillAlpha = 0.08,
  hovered = false,
}: DistrictTerritoryBorderProps) {
  const bw = hw + BORDER_PAD;
  const bh = hh + BORDER_PAD / 2;
  const gfxRef = useRef<Graphics | null>(null);
  const phaseRef = useRef(0);

  useTick((ticker) => {
    const g = gfxRef.current;
    if (!g) return;

    if (hovered) phaseRef.current += ticker.deltaTime * 0.008;

    g.clear();

    // Subtle fill — brighter on hover
    g.moveTo(0, -bh);
    g.lineTo(bw, 0);
    g.lineTo(0, bh);
    g.lineTo(-bw, 0);
    g.closePath();
    g.fill({ color, alpha: hovered ? fillAlpha * 2.5 : fillAlpha });

    // Border stroke — brighter on hover
    g.moveTo(0, -bh);
    g.lineTo(bw, 0);
    g.lineTo(0, bh);
    g.lineTo(-bw, 0);
    g.closePath();
    g.stroke({ width: hovered ? 3 : 2, color, alpha: hovered ? alpha + 0.3 : alpha });

    // Corner tick marks
    const tick = 16;
    const ta = hovered ? alpha + 0.4 : alpha + 0.2;
    g.moveTo(-tick, -bh + tick / 2); g.lineTo(0, -bh); g.lineTo(tick, -bh + tick / 2);
    g.stroke({ width: 3, color, alpha: ta });
    g.moveTo(bw - tick, -tick / 2); g.lineTo(bw, 0); g.lineTo(bw - tick, tick / 2);
    g.stroke({ width: 3, color, alpha: ta });
    g.moveTo(-tick, bh - tick / 2); g.lineTo(0, bh); g.lineTo(tick, bh - tick / 2);
    g.stroke({ width: 3, color, alpha: ta });
    g.moveTo(-bw + tick, -tick / 2); g.lineTo(-bw, 0); g.lineTo(-bw + tick, tick / 2);
    g.stroke({ width: 3, color, alpha: ta });

    // Neon chase lights when hovered
    if (hovered) {
      const t = phaseRef.current;
      const numDots = 6;
      for (let i = 0; i < numDots; i++) {
        const progress = (t + i / numDots) % 1;
        const pt = diamondPoint(bw, bh, progress);
        // Outer glow
        g.circle(pt.x, pt.y, 6);
        g.fill({ color, alpha: 0.15 });
        // Core dot
        g.circle(pt.x, pt.y, 3);
        g.fill({ color, alpha: 0.7 });
        // Bright center
        g.circle(pt.x, pt.y, 1.5);
        g.fill({ color: 0xffffff, alpha: 0.5 });
      }

      // Outer glow border (wider, faint)
      g.moveTo(0, -bh);
      g.lineTo(bw, 0);
      g.lineTo(0, bh);
      g.lineTo(-bw, 0);
      g.closePath();
      g.stroke({ width: 6, color, alpha: 0.1 });
    }
  });

  return <pixiGraphics ref={gfxRef as React.RefObject<never>} draw={() => {}} />;
}
