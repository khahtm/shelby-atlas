"use client";

import { useEffect, useRef, useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container } from "pixi.js";
import gsap from "gsap";

extend({ Graphics, Container });

interface SnailLegacyLaneEntityProps {
  startX: number;
  endX: number;
  y: number;
}

/** Very slow snail crawling across the legacy lane — visually contrasts fast packets */
export function SnailLegacyLaneEntity({ startX, endX, y }: SnailLegacyLaneEntityProps) {
  const containerRef = useRef<Container | null>(null);

  const draw = useCallback((g: Graphics) => {
    g.clear();
    // Body: soft tan slug shape
    g.ellipse(2, 1, 7, 3);
    g.fill({ color: 0xaa9977, alpha: 0.9 });
    // Shell: brown spiral circle on top
    g.circle(-1, -2, 5);
    g.fill({ color: 0x8b5e3c, alpha: 1 });
    g.stroke({ width: 1, color: 0x5a3a1a, alpha: 0.8 });
    // Shell spiral detail
    g.circle(-1, -2, 3);
    g.stroke({ width: 0.8, color: 0x6b4e2c, alpha: 0.6 });
    g.circle(-1, -2.5, 1.2);
    g.fill({ color: 0x6b4e2c, alpha: 0.5 });
    // Head bump
    g.circle(6, 0, 2);
    g.fill({ color: 0xaa9977, alpha: 0.9 });
    // Eyes on stalks
    g.moveTo(6, -1);
    g.lineTo(8, -5);
    g.stroke({ width: 1, color: 0xaa9977, alpha: 0.8 });
    g.circle(8, -5, 1);
    g.fill({ color: 0x222222, alpha: 0.9 });
    g.moveTo(5, -1);
    g.lineTo(6, -6);
    g.stroke({ width: 1, color: 0xaa9977, alpha: 0.8 });
    g.circle(6, -6, 1);
    g.fill({ color: 0x222222, alpha: 0.9 });
    // Slime trail behind
    g.moveTo(-5, 3);
    g.lineTo(-12, 3);
    g.stroke({ width: 1, color: 0x888888, alpha: 0.2 });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.x = startX;
    container.y = y;

    const distance = Math.abs(endX - startX);
    const duration = 30 + Math.random() * 15; // 30-45 seconds — very slow

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
  }, [startX, endX, y]);

  return (
    <pixiContainer ref={containerRef}>
      <pixiGraphics draw={draw} />
    </pixiContainer>
  );
}
