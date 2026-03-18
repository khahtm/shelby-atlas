"use client";

import { useEffect, useRef, useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container, Text, TextStyle } from "pixi.js";
import gsap from "gsap";

extend({ Graphics, Container, Text });

interface DataPacketFiberEntityProps {
  startX: number;
  endX: number;
  y: number;
  speed: number; // pixels per second
  color: number;
  label?: string;
}

/** Fast diamond-shaped data packet racing along a fiber lane with speed label */
export function DataPacketFiberEntity({
  startX,
  endX,
  y,
  speed,
  color,
  label,
}: DataPacketFiberEntityProps) {
  const containerRef = useRef<Container | null>(null);

  const drawDiamond = useCallback(
    (g: Graphics) => {
      g.clear();
      g.moveTo(0, -10);
      g.lineTo(10, 0);
      g.lineTo(0, 10);
      g.lineTo(-10, 0);
      g.closePath();
      g.fill({ color, alpha: 1 });
      g.stroke({ width: 1, color: 0xffffff, alpha: 0.6 });
    },
    [color],
  );

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 16,
    fill: "#ffffff",
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.x = startX;
    container.y = y;

    const distance = Math.abs(endX - startX);
    const duration = distance / speed;

    const tween = gsap.to(container, {
      x: endX,
      duration,
      ease: "none",
      repeat: -1,
      onRepeat() {
        if (containerRef.current) containerRef.current.x = startX;
      },
    });

    return () => {
      tween.kill();
    };
  }, [startX, endX, y, speed]);

  return (
    <pixiContainer ref={containerRef}>
      <pixiGraphics draw={drawDiamond} />
      {label && (
        <pixiText
          text={label}
          style={labelStyle}
          anchor={{ x: 0.5, y: 1 }}
          y={-10}
        />
      )}
    </pixiContainer>
  );
}
