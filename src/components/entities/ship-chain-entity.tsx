"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics, Text, TextStyle } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import type { ShipMeta } from "@/src/data/ship-metadata";
import { useAtlasDispatch } from "@/src/stores/atlas-store";

extend({ Graphics, Text });

const STATE_OPACITY: Record<ShipMeta["state"], number> = {
  docked: 1.0,
  approaching: 0.85,
  further: 0.7,
  horizon: 0.5,
};

interface ShipChainEntityProps {
  ship: ShipMeta;
}

/** Isometric ship entity representing a cross-chain integration at The Docks */
export function ShipChainEntity({ ship }: ShipChainEntityProps) {
  const dispatch = useAtlasDispatch();
  const bobRef = useRef(0);
  const containerRef = useRef<{ y: number } | null>(null);
  const baseY = useRef(0);

  const color = parseInt(ship.color.replace("#", ""), 16);
  const opacity = STATE_OPACITY[ship.state];

  useTick((delta) => {
    bobRef.current += delta.deltaTime * 0.04;
    const container = containerRef.current as { y: number } | null;
    if (container) {
      container.y = baseY.current + Math.sin(bobRef.current) * 2;
    }
  });

  const drawShip = useCallback(
    (g: Graphics) => {
      g.clear();

      // Ship hull — isometric trapezoid shape
      g.moveTo(-18, 0);
      g.lineTo(18, 0);
      g.lineTo(14, 10);
      g.lineTo(-14, 10);
      g.closePath();
      g.fill({ color, alpha: opacity });
      g.stroke({ width: 1, color, alpha: 1 });

      // Deck top face
      g.moveTo(-12, -4);
      g.lineTo(12, -4);
      g.lineTo(10, 0);
      g.lineTo(-10, 0);
      g.closePath();
      g.fill({ color, alpha: opacity * 0.7 });

      // Mast line
      g.moveTo(0, -4);
      g.lineTo(0, -18);
      g.stroke({ width: 1.5, color: 0xcccccc, alpha: opacity });

      // Colored flag rectangle
      g.rect(0, -18, 8, 5);
      g.fill({ color, alpha: 1 });
    },
    [color, opacity],
  );

  const handlePointerDown = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: `docks-${ship.id}` });
      dispatch({ type: "MARK_EXPLORED", id: "docks" });
    },
    [dispatch, ship.id],
  );

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 12,
    fill: ship.color,
    align: "center",
  });

  return (
    <pixiContainer
      ref={containerRef as React.RefObject<never>}
      x={ship.localOffset.x}
      y={ship.localOffset.y}
    >
      <pixiGraphics
        draw={drawShip}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handlePointerDown}
      />
      <pixiText
        text={ship.name}
        style={labelStyle}
        anchor={0.5}
        y={-26}
      />
    </pixiContainer>
  );
}
