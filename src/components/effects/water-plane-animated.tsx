"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

interface WaterPlaneAnimatedProps {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

/** Animated water surface with sin-wave top edge for The Docks district */
export function WaterPlaneAnimated({
  width,
  height,
  x = 0,
  y = 0,
}: WaterPlaneAnimatedProps) {
  const offsetRef = useRef(0);
  const graphicsRef = useRef<Graphics | null>(null);

  // Initial draw — content redrawn imperatively in useTick
  const draw = useCallback((g: Graphics) => { g.clear(); }, []);

  useTick((delta) => {
    offsetRef.current += delta.deltaTime * 0.05;
    const g = graphicsRef.current;
    if (!g) return;

    g.clear();

    // Dark blue water base
    g.rect(0, 0, width, height);
    g.fill({ color: 0x0a1628, alpha: 0.85 });

    // Wavy top edge highlights
    g.moveTo(0, 0);
    const segments = 12;
    const segW = width / segments;
    for (let i = 0; i <= segments; i++) {
      const wx = i * segW;
      const wy = Math.sin(i * 0.8 + offsetRef.current) * 3;
      if (i === 0) g.moveTo(wx, wy);
      else g.lineTo(wx, wy);
    }
    g.stroke({ width: 1.5, color: 0x1e4d7a, alpha: 0.7 });

    // Second wave layer slightly offset
    g.moveTo(0, 4);
    for (let i = 0; i <= segments; i++) {
      const wx = i * segW;
      const wy = 4 + Math.sin(i * 0.6 + offsetRef.current * 1.3 + 1.5) * 2;
      if (i === 0) g.moveTo(wx, wy);
      else g.lineTo(wx, wy);
    }
    g.stroke({ width: 1, color: 0x2a6fa8, alpha: 0.4 });
  });

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics ref={graphicsRef} draw={draw} />
    </pixiContainer>
  );
}
