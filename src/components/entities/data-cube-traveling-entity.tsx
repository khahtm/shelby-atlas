"use client";

import { useEffect, useRef, useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container } from "pixi.js";
import gsap from "gsap";
import { quadraticBezier, randomControlPoint } from "@/src/utils/bezier-path";

extend({ Graphics, Container });

const CUBE_COLORS = [0xff6b35, 0xff9f1c, 0xffcc00, 0xff4500, 0xffa500];
const DURATION_MIN = 3;
const DURATION_MAX = 5;

interface DataCubeTravelingEntityProps {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onArrive?: () => void;
}

/** Small colored cube that travels along a bezier arc to the furnace, then calls onArrive */
export function DataCubeTravelingEntity({
  startX,
  startY,
  targetX,
  targetY,
  onArrive,
}: DataCubeTravelingEntityProps) {
  const containerRef = useRef<Container | null>(null);
  const color = useRef(CUBE_COLORS[Math.floor(Math.random() * CUBE_COLORS.length)]);

  const draw = useCallback((g: Graphics) => {
    g.clear();
    g.rect(-8, -8, 16, 16);
    g.fill({ color: color.current, alpha: 0.9 });
    g.stroke({ width: 1, color: 0xffffff, alpha: 0.4 });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.x = startX;
    container.y = startY;

    const start = { x: startX, y: startY };
    const end = { x: targetX, y: targetY };
    const control = randomControlPoint(start, end, 60);
    const duration = DURATION_MIN + Math.random() * (DURATION_MAX - DURATION_MIN);

    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: 1,
      duration,
      ease: "power1.inOut",
      onUpdate() {
        const pt = quadraticBezier(start, control, end, proxy.t);
        if (containerRef.current) {
          containerRef.current.x = pt.x;
          containerRef.current.y = pt.y;
        }
      },
      onComplete() {
        onArrive?.();
        if (containerRef.current) {
          containerRef.current.visible = false;
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [startX, startY, targetX, targetY, onArrive]);

  return (
    <pixiContainer ref={containerRef}>
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}
