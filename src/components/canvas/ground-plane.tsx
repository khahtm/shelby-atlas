"use client";

import { useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import {
  TILE_W,
  TILE_H,
  GRID_COLS,
  GRID_ROWS,
  toScreen,
} from "@/src/utils/isometric-helpers";

extend({ Graphics });

const LINE_COLOR = 0x1e2d50;
const LINE_ALPHA = 0.55;

/** Draws a subtle isometric grid on the ground plane */
export function GroundPlane() {
  const draw = useCallback((g: Graphics) => {
    g.clear();

    // Draw isometric grid lines
    for (let col = 0; col <= GRID_COLS; col++) {
      const start = toScreen(col, 0);
      const end = toScreen(col, GRID_ROWS);
      g.moveTo(start.x, start.y);
      g.lineTo(end.x, end.y);
      g.stroke({ width: 1, color: LINE_COLOR, alpha: LINE_ALPHA });
    }

    for (let row = 0; row <= GRID_ROWS; row++) {
      const start = toScreen(0, row);
      const end = toScreen(GRID_COLS, row);
      g.moveTo(start.x, start.y);
      g.lineTo(end.x, end.y);
      g.stroke({ width: 1, color: LINE_COLOR, alpha: LINE_ALPHA });
    }
  }, []);

  return <pixiGraphics draw={draw} />;
}
