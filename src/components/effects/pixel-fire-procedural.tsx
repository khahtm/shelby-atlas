"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

// Fire frame definitions: each frame is an array of [x, y, w, h, color] rects
const FIRE_FRAMES: Array<Array<[number, number, number, number, number]>> = [
  [
    [-2, 0, 12, 16, 0xff4500],
    [-6, -8, 8, 12, 0xff6b00],
    [4, -12, 6, 10, 0xffaa00],
  ],
  [
    [-4, 0, 12, 16, 0xff3000],
    [4, -10, 8, 12, 0xff6b00],
    [-4, -14, 6, 10, 0xffcc00],
  ],
  [
    [-2, 0, 10, 16, 0xff4500],
    [-4, -8, 6, 10, 0xff8c00],
    [2, -16, 8, 12, 0xffaa00],
  ],
  [
    [0, 0, 12, 16, 0xff5500],
    [-2, -10, 8, 10, 0xff6b00],
    [6, -14, 4, 10, 0xffd000],
  ],
  [
    [-4, 0, 10, 16, 0xff3500],
    [4, -6, 6, 12, 0xff8000],
    [-6, -12, 8, 10, 0xffbb00],
  ],
  [
    [-2, 0, 12, 14, 0xff4000],
    [-4, -10, 10, 10, 0xff7000],
    [4, -18, 6, 12, 0xffaa00],
  ],
];

const TICKS_PER_FRAME = 8; // ~8fps at 60fps ticker

interface PixelFireProceduralProps {
  x?: number;
  y?: number;
}

/** Procedural pixel fire animation using Graphics frame cycling */
export function PixelFireProcedural({ x = 0, y = 0 }: PixelFireProceduralProps) {
  const graphicsRef = useRef<Graphics | null>(null);
  const tickRef = useRef(0);
  const frameRef = useRef(0);

  useTick(() => {
    tickRef.current++;
    if (tickRef.current < TICKS_PER_FRAME) return;
    tickRef.current = 0;
    frameRef.current = (frameRef.current + 1) % FIRE_FRAMES.length;

    const g = graphicsRef.current;
    if (!g) return;

    g.clear();
    const rects = FIRE_FRAMES[frameRef.current];
    for (const [rx, ry, rw, rh, color] of rects) {
      g.rect(rx, ry, rw, rh);
      g.fill({ color, alpha: 0.9 });
    }
  });

  const draw = useCallback((g: Graphics) => {
    g.clear();
    const rects = FIRE_FRAMES[0];
    for (const [rx, ry, rw, rh, color] of rects) {
      g.rect(rx, ry, rw, rh);
      g.fill({ color, alpha: 0.9 });
    }
  }, []);

  return (
    <pixiGraphics
      ref={graphicsRef}
      draw={draw}
      x={x}
      y={y}
    />
  );
}
