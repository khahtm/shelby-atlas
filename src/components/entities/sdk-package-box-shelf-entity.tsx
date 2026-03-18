"use client";

import { useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics, Text, TextStyle } from "pixi.js";

extend({ Graphics, Text });

interface SdkPackageBoxShelfEntityProps {
  x?: number;
  y?: number;
  color?: number;
  label?: string;
}

/** Small isometric SDK package box displayed on workshop shelf */
export function SdkPackageBoxShelfEntity({
  x = 0,
  y = 0,
  color = 0x69f0ae,
  label = "pkg",
}: SdkPackageBoxShelfEntityProps) {
  const drawBox = useCallback(
    (g: Graphics) => {
      g.clear();

      // Top face of isometric box
      g.moveTo(0, -8);
      g.lineTo(10, -4);
      g.lineTo(0, 0);
      g.lineTo(-10, -4);
      g.closePath();
      g.fill({ color, alpha: 0.9 });

      // Right face (darker)
      g.moveTo(0, 0);
      g.lineTo(10, -4);
      g.lineTo(10, 6);
      g.lineTo(0, 10);
      g.closePath();
      g.fill({ color, alpha: 0.55 });

      // Left face (darkest)
      g.moveTo(0, 0);
      g.lineTo(-10, -4);
      g.lineTo(-10, 6);
      g.lineTo(0, 10);
      g.closePath();
      g.fill({ color, alpha: 0.35 });

      // Outline
      g.stroke({ width: 1, color, alpha: 0.6 });
    },
    [color],
  );

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 11,
    fill: `#${color.toString(16).padStart(6, "0")}`,
    align: "center",
  });

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics draw={drawBox} />
      <pixiText text={label} style={labelStyle} anchor={0.5} y={16} />
    </pixiContainer>
  );
}
