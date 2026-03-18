"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

const HEX_RADIUS = 60;
const BASE_ALPHA = 0.15;
const PULSE_SPEED = 0.02;

/** Semi-transparent cyan hexagonal shield overlay with subtle alpha pulse */
export function ShieldWallHexagonalOverlay() {
  const graphicsRef = useRef<Graphics | null>(null);
  const phaseRef = useRef(0);

  useTick(() => {
    const g = graphicsRef.current;
    if (!g) return;
    phaseRef.current += PULSE_SPEED;
    const alpha = BASE_ALPHA + Math.sin(phaseRef.current) * 0.06;
    g.clear();
    drawHex(g, alpha);
  });

  const draw = useCallback((g: Graphics) => {
    drawHex(g, BASE_ALPHA);
  }, []);

  return <pixiGraphics ref={graphicsRef} draw={draw} />;
}

function drawHex(g: Graphics, alpha: number) {
  const sides = 6;
  const points: number[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(Math.cos(angle) * HEX_RADIUS, Math.sin(angle) * HEX_RADIUS);
  }
  g.poly(points);
  g.fill({ color: 0x00f0ff, alpha });
  g.stroke({ width: 2, color: 0x00f0ff, alpha: alpha * 4 });
}
