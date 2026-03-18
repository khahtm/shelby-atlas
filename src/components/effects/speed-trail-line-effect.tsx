"use client";

import { useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

interface Point {
  x: number;
  y: number;
}

interface SpeedTrailLineEffectProps {
  points: Point[];
  color: number;
}

/** Fading trail drawn behind a moving entity — older points are more transparent */
export function SpeedTrailLineEffect({ points, color }: SpeedTrailLineEffectProps) {
  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      if (points.length < 2) return;

      for (let i = 1; i < points.length; i++) {
        const alpha = i / points.length; // newer = higher alpha
        const prev = points[i - 1];
        const curr = points[i];
        g.moveTo(prev.x, prev.y);
        g.lineTo(curr.x, curr.y);
        g.stroke({ width: 2, color, alpha });
      }
    },
    [points, color],
  );

  return <pixiGraphics draw={draw} />;
}
