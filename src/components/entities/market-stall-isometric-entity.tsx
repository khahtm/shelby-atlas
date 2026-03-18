"use client";

import { useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import type { StallMeta } from "@/src/data/stall-metadata";
import { useAtlasDispatch } from "@/src/stores/atlas-store";

extend({ Graphics, Container, Text });

interface MarketStallIsometricEntityProps {
  stall: StallMeta;
  x: number;
  y: number;
}

/** Individual isometric market stall box with label — clickable to open stall detail */
export function MarketStallIsometricEntity({ stall, x, y }: MarketStallIsometricEntityProps) {
  const dispatch = useAtlasDispatch();
  const color = parseInt(stall.color.replace("#", ""), 16);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const w = 40;
      const h = 28;
      // Top face
      g.moveTo(0, -h);
      g.lineTo(w, -h / 2);
      g.lineTo(0, 0);
      g.lineTo(-w, -h / 2);
      g.closePath();
      g.fill({ color, alpha: 0.9 });
      // Right face
      g.moveTo(w, -h / 2);
      g.lineTo(w, h / 2);
      g.lineTo(0, h);
      g.lineTo(0, 0);
      g.closePath();
      g.fill({ color: Math.max(0, color - 0x303030), alpha: 0.95 });
      // Left face
      g.moveTo(0, 0);
      g.lineTo(0, h);
      g.lineTo(-w, h / 2);
      g.lineTo(-w, -h / 2);
      g.closePath();
      g.fill({ color: Math.max(0, color - 0x202020), alpha: 0.95 });
      g.stroke({ width: 1, color, alpha: 0.6 });
    },
    [color],
  );

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: `mint-${stall.id}` });
    },
    [dispatch, stall.id],
  );

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 16,
    fill: stall.color,
    align: "center",
  });

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics
        draw={draw}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleClick}
      />
      <pixiText text={stall.name} style={labelStyle} anchor={0.5} y={-48} />
    </pixiContainer>
  );
}
