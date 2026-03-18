"use client";

import { useCallback, useState } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import type { DistrictMeta } from "@/src/data/types";
import { toScreen, DISTRICT_SIZE } from "@/src/utils/isometric-helpers";
import { useAtlasDispatch } from "@/src/stores/atlas-store";

extend({ Graphics, Container, Text });

interface PlaceholderDistrictProps {
  district: DistrictMeta;
}

/** Interactive colored isometric diamond placeholder for a district */
export function PlaceholderDistrict({ district }: PlaceholderDistrictProps) {
  const dispatch = useAtlasDispatch();
  const [hovered, setHovered] = useState(false);

  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);
  const color = parseInt(district.color.replace("#", ""), 16);
  const hw = DISTRICT_SIZE.w / 2;
  const hh = DISTRICT_SIZE.h / 2;

  const drawShape = useCallback(
    (g: Graphics) => {
      g.clear();

      // Isometric diamond shape
      g.moveTo(0, -hh);
      g.lineTo(hw, 0);
      g.lineTo(0, hh);
      g.lineTo(-hw, 0);
      g.closePath();
      g.fill({ color, alpha: hovered ? 0.9 : 0.6 });
      g.stroke({ width: 2, color, alpha: 1 });

      // Glow effect on hover
      if (hovered) {
        g.moveTo(0, -hh - 2);
        g.lineTo(hw + 2, 0);
        g.lineTo(0, hh + 2);
        g.lineTo(-hw - 2, 0);
        g.closePath();
        g.stroke({ width: 1, color, alpha: 0.4 });
      }
    },
    [color, hw, hh, hovered],
  );

  const handlePointerOver = useCallback(() => setHovered(true), []);
  const handlePointerOut = useCallback(() => setHovered(false), []);
  const handlePointerDown = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: district.id });
      dispatch({ type: "MARK_EXPLORED", id: district.id });
    },
    [dispatch, district.id],
  );

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 14,
    fill: district.color,
    align: "center",
  });

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <pixiGraphics
        draw={drawShape}
        eventMode="static"
        cursor="pointer"
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        hitArea={{
          contains: (x: number, y: number) => {
            // Diamond hit test
            return Math.abs(x) / hw + Math.abs(y) / hh <= 1;
          },
        }}
      />
      <pixiText
        text={district.name}
        style={labelStyle}
        anchor={0.5}
        y={-hh - 12}
      />
    </pixiContainer>
  );
}
