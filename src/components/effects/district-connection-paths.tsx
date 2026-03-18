"use client";

import { useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { CONNECTION_PATHS } from "@/src/data/connection-path-data";

extend({ Graphics });

/** Draw a neon glowing polyline along waypoints */
function drawNeonPath(g: Graphics, points: Array<{ x: number; y: number }>, color: number) {
  if (points.length < 2) return;

  const layers = [
    { width: 10, alpha: 0.08 },
    { width: 6, alpha: 0.15 },
    { width: 3, alpha: 0.35 },
    { width: 1.5, alpha: 0.8 },
  ];

  for (const layer of layers) {
    g.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      g.lineTo(points[i].x, points[i].y);
    }
    g.stroke({ width: layer.width, color, alpha: layer.alpha });
  }

  // Bright dots at each turn point
  for (let i = 1; i < points.length - 1; i++) {
    g.circle(points[i].x, points[i].y, 2);
    g.fill({ color, alpha: 0.6 });
  }
}

/** Renders neon grid-aligned paths connecting districts */
export function DistrictConnectionPaths() {
  const draw = useCallback((g: Graphics) => {
    g.clear();
    for (const { points, color } of CONNECTION_PATHS) {
      drawNeonPath(g, points, color);
    }
  }, []);

  return <pixiGraphics draw={draw} />;
}
