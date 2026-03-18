"use client";

import { useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";

extend({ Graphics, Container });

type GuardPostState = "healthy" | "attacked" | "recovering";

const STATE_COLORS: Record<GuardPostState, number> = {
  healthy: 0x00ff88,
  attacked: 0xff2244,
  recovering: 0xffcc00,
};

interface GuardPostSecurityEntityProps {
  x: number;
  y: number;
  state: GuardPostState;
  onClick?: () => void;
}

/** Small isometric guard post cube — color reflects health state, clickable to trigger attack */
export function GuardPostSecurityEntity({
  x,
  y,
  state,
  onClick,
}: GuardPostSecurityEntityProps) {
  const color = STATE_COLORS[state];

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const w = 24;
      const h = 20;
      // Top
      g.moveTo(0, -h);
      g.lineTo(w, -h / 2);
      g.lineTo(0, 0);
      g.lineTo(-w, -h / 2);
      g.closePath();
      g.fill({ color, alpha: 0.9 });
      // Right
      g.moveTo(w, -h / 2);
      g.lineTo(w, h / 2);
      g.lineTo(0, h);
      g.lineTo(0, 0);
      g.closePath();
      g.fill({ color: Math.max(0, color - 0x303030), alpha: 1 });
      // Left
      g.moveTo(0, 0);
      g.lineTo(0, h);
      g.lineTo(-w, h / 2);
      g.lineTo(-w, -h / 2);
      g.closePath();
      g.fill({ color: Math.max(0, color - 0x202020), alpha: 1 });
      g.stroke({ width: 1, color, alpha: 0.7 });
    },
    [color],
  );

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      onClick?.();
    },
    [onClick],
  );

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics
        draw={draw}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleClick}
      />
    </pixiContainer>
  );
}
