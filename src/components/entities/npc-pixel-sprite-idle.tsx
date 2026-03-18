"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

const TICKS_PER_FRAME = 30; // ~2fps at 60fps

interface NpcPixelSpriteIdleProps {
  x?: number;
  y?: number;
  color?: number;
}

/** 2-frame idle NPC pixel sprite — toggles arm position every ~30 ticks */
export function NpcPixelSpriteIdle({ x = 0, y = 0, color = 0xffcc88 }: NpcPixelSpriteIdleProps) {
  const graphicsRef = useRef<Graphics | null>(null);
  const tickRef = useRef(0);
  const frameRef = useRef(0);

  const drawFrame = useCallback(
    (g: Graphics, frame: number) => {
      g.clear();
      // Head
      g.rect(-6, -28, 12, 12);
      g.fill({ color, alpha: 1 });
      // Body
      g.rect(-8, -16, 16, 14);
      g.fill({ color: 0x3366cc, alpha: 1 });
      // Legs
      g.rect(-8, -2, 6, 10);
      g.fill({ color: 0x222244, alpha: 1 });
      g.rect(2, -2, 6, 10);
      g.fill({ color: 0x222244, alpha: 1 });
      // Arms — toggle position per frame
      if (frame === 0) {
        g.rect(-14, -16, 6, 10);
        g.fill({ color: 0x3366cc, alpha: 1 });
        g.rect(8, -16, 6, 10);
        g.fill({ color: 0x3366cc, alpha: 1 });
      } else {
        g.rect(-14, -12, 6, 10);
        g.fill({ color: 0x3366cc, alpha: 1 });
        g.rect(8, -12, 6, 10);
        g.fill({ color: 0x3366cc, alpha: 1 });
      }
    },
    [color],
  );

  const draw = useCallback(
    (g: Graphics) => {
      drawFrame(g, 0);
    },
    [drawFrame],
  );

  useTick(() => {
    tickRef.current++;
    if (tickRef.current < TICKS_PER_FRAME) return;
    tickRef.current = 0;
    frameRef.current = frameRef.current === 0 ? 1 : 0;
    const g = graphicsRef.current;
    if (g) drawFrame(g, frameRef.current);
  });

  return (
    <pixiGraphics ref={graphicsRef} draw={draw} x={x} y={y} />
  );
}
