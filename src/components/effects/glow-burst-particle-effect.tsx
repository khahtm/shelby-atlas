"use client";

import { useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: number;
  life: number; // 0-1, decreasing
}

const PARTICLE_COLORS = [0xff6b00, 0xffaa00, 0xffdd00, 0xff4500];

export interface GlowBurstHandle {
  trigger: (x: number, y: number) => void;
}

interface GlowBurstParticleEffectProps {
  baseX?: number;
  baseY?: number;
}

/** Orange/yellow particle burst effect — call trigger() via ref to spawn burst */
export const GlowBurstParticleEffect = forwardRef<GlowBurstHandle, GlowBurstParticleEffectProps>(
  function GlowBurstParticleEffect({ baseX = 0, baseY = 0 }, ref) {
    const graphicsRef = useRef<Graphics | null>(null);
    const particles = useRef<Particle[]>([]);

    useImperativeHandle(ref, () => ({
      trigger(x: number, y: number) {
        const count = 10 + Math.floor(Math.random() * 6);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2.5;
          particles.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
            life: 1,
          });
        }
      },
    }));

    useTick((ticker) => {
      const g = graphicsRef.current;
      if (!g) return;

      const delta = typeof ticker === "number" ? ticker : ticker.deltaTime;
      const decay = 0.03 * delta;
      particles.current = particles.current.filter((p) => p.life > 0);

      g.clear();
      for (const p of particles.current) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.life -= decay;
        p.alpha = p.life;
        g.circle(p.x - baseX, p.y - baseY, 3);
        g.fill({ color: p.color, alpha: Math.max(0, p.alpha) });
      }
    });

    const draw = useCallback((g: Graphics) => {
      g.clear();
    }, []);

    return <pixiGraphics ref={graphicsRef} draw={draw} />;
  },
);
