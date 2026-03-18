"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { CONNECTION_PATHS } from "@/src/data/connection-path-data";

extend({ Graphics });

/** Pixels per second each vehicle travels */
const SPEED = 40;

interface Vehicle {
  pathIdx: number;
  /** Progress along segment list (float, integer part = segment index) */
  t: number;
  /** Total path length in segments */
  segCount: number;
  /** 1 = forward, -1 = reverse */
  dir: 1 | -1;
  color: number;
  size: number;
}

/** Seed vehicles — 2 per path, offset so they don't stack */
function initVehicles(): Vehicle[] {
  const vehicles: Vehicle[] = [];
  for (let i = 0; i < CONNECTION_PATHS.length; i++) {
    const pts = CONNECTION_PATHS[i].points;
    if (pts.length < 2) continue;
    const segCount = pts.length - 1;
    const color = CONNECTION_PATHS[i].color;

    vehicles.push({ pathIdx: i, t: 0, segCount, dir: 1, color, size: 4 });
    vehicles.push({
      pathIdx: i,
      t: segCount * 0.5,
      segCount,
      dir: -1,
      color,
      size: 3,
    });
  }
  return vehicles;
}

const vehicles = initVehicles();

/** Interpolate position along a path at float progress t */
function getPos(pathIdx: number, t: number): { x: number; y: number } {
  const pts = CONNECTION_PATHS[pathIdx].points;
  const seg = Math.floor(t);
  const frac = t - seg;
  const a = pts[Math.min(seg, pts.length - 1)];
  const b = pts[Math.min(seg + 1, pts.length - 1)];
  return {
    x: a.x + (b.x - a.x) * frac,
    y: a.y + (b.y - a.y) * frac,
  };
}

/** Renders small neon vehicles that travel along connection paths */
export function AmbientNeonVehiclesMovingOnPaths() {
  const gfxRef = useRef<Graphics | null>(null);

  useTick((ticker) => {
    const g = gfxRef.current;
    if (!g) return;

    const dt = ticker.deltaTime / 60; // seconds

    g.clear();
    for (const v of vehicles) {
      // Advance
      v.t += v.dir * SPEED * dt / 64; // 64px per grid tile roughly

      // Bounce at endpoints
      if (v.t >= v.segCount) {
        v.t = v.segCount;
        v.dir = -1;
      } else if (v.t <= 0) {
        v.t = 0;
        v.dir = 1;
      }

      const pos = getPos(v.pathIdx, v.t);

      // Glow
      g.circle(pos.x, pos.y, v.size + 4);
      g.fill({ color: v.color, alpha: 0.1 });
      // Body
      g.circle(pos.x, pos.y, v.size);
      g.fill({ color: v.color, alpha: 0.7 });
      // Bright core
      g.circle(pos.x, pos.y, v.size / 2);
      g.fill({ color: 0xffffff, alpha: 0.5 });
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  return <pixiGraphics draw={initDraw} ref={gfxRef} />;
}
