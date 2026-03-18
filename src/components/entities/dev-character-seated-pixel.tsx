"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

interface DevCharacterSeatedPixelProps {
  x?: number;
  y?: number;
  color?: number;
}

/** Seated pixel developer character with subtle idle head-bob animation */
export function DevCharacterSeatedPixel({
  x = 0,
  y = 0,
  color = 0x69f0ae,
}: DevCharacterSeatedPixelProps) {
  const bobRef = useRef(0);
  const headGRef = useRef<Graphics>(null);

  useTick((delta) => {
    bobRef.current += delta.deltaTime * 0.03;
    const g = headGRef.current;
    if (g) {
      g.y = Math.sin(bobRef.current) * 1.5;
    }
  });

  const drawBody = useCallback(
    (g: Graphics) => {
      g.clear();

      // Desk rectangle
      g.rect(-16, 6, 32, 5);
      g.fill({ color: 0x2a3a4a, alpha: 0.9 });
      g.stroke({ width: 1, color: color, alpha: 0.3 });

      // Desk legs
      g.rect(-14, 11, 3, 8);
      g.fill({ color: 0x1a2a3a, alpha: 0.8 });
      g.rect(11, 11, 3, 8);
      g.fill({ color: 0x1a2a3a, alpha: 0.8 });

      // Body (torso)
      g.rect(-5, -4, 10, 10);
      g.fill({ color, alpha: 0.8 });

      // Arms at keyboard
      g.rect(-10, 0, 6, 4);
      g.fill({ color, alpha: 0.6 });
      g.rect(4, 0, 6, 4);
      g.fill({ color, alpha: 0.6 });

      // Monitor on desk
      g.rect(-8, -14, 16, 10);
      g.fill({ color: 0x0a0e1a, alpha: 0.95 });
      g.stroke({ width: 1, color: color, alpha: 0.5 });
      // Screen glow
      g.rect(-6, -13, 12, 8);
      g.fill({ color: 0x001a0f, alpha: 0.9 });
      // Code line on screen
      g.rect(-5, -12, 7, 1);
      g.fill({ color: color, alpha: 0.7 });
      g.rect(-5, -10, 5, 1);
      g.fill({ color: color, alpha: 0.5 });
    },
    [color],
  );

  const drawHead = useCallback(
    (g: Graphics) => {
      g.clear();
      // Head circle approximated with rect for pixel feel
      g.rect(-4, -20, 8, 8);
      g.fill({ color: 0xffd0a0, alpha: 0.9 });
      // Eyes
      g.rect(-3, -18, 2, 2);
      g.fill({ color: 0x000000, alpha: 1 });
      g.rect(1, -18, 2, 2);
      g.fill({ color: 0x000000, alpha: 1 });
    },
    [],
  );

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics draw={drawBody} />
      <pixiGraphics ref={headGRef} draw={drawHead} />
    </pixiContainer>
  );
}
