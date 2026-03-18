"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { CONNECTION_PATHS } from "@/src/data/connection-path-data";

extend({ Graphics });

/** Pedestrian colors — skin/outfit variety */
const PED_COLORS = [0x00e5ff, 0xff6b35, 0x76ff03, 0xe040fb, 0xffab00, 0x69f0ae, 0xff4081, 0x448aff];

interface Pedestrian {
  pathIdx: number;
  t: number;
  dir: 1 | -1;
  color: number;
  speed: number;
  walkPhase: number;
}

/** Seed pedestrians — 3 per path */
function initPedestrians(): Pedestrian[] {
  const peds: Pedestrian[] = [];
  for (let i = 0; i < CONNECTION_PATHS.length; i++) {
    const pts = CONNECTION_PATHS[i].points;
    if (pts.length < 2) continue;
    const segCount = pts.length - 1;
    for (let j = 0; j < 3; j++) {
      peds.push({
        pathIdx: i,
        t: (j / 3) * segCount,
        dir: j % 2 === 0 ? 1 : -1,
        color: PED_COLORS[(i * 3 + j) % PED_COLORS.length],
        speed: 12 + j * 4,
        walkPhase: j * 2,
      });
    }
  }
  return peds;
}

const pedestrians = initPedestrians();

/** Interpolate position on a path */
function getPos(pathIdx: number, t: number): { x: number; y: number } {
  const pts = CONNECTION_PATHS[pathIdx].points;
  const seg = Math.floor(t);
  const frac = t - seg;
  const a = pts[Math.min(seg, pts.length - 1)];
  const b = pts[Math.min(seg + 1, pts.length - 1)];
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
}

/** Draw a tiny pixel person */
function drawPed(g: Graphics, x: number, y: number, color: number, legOffset: number) {
  // Head
  g.circle(x, y - 7, 2);
  g.fill({ color, alpha: 0.85 });
  // Body
  g.moveTo(x, y - 5);
  g.lineTo(x, y - 1);
  g.stroke({ width: 1.5, color, alpha: 0.7 });
  // Legs (animated walk)
  g.moveTo(x, y - 1);
  g.lineTo(x - 1.5 + legOffset, y + 2);
  g.stroke({ width: 1, color, alpha: 0.6 });
  g.moveTo(x, y - 1);
  g.lineTo(x + 1.5 - legOffset, y + 2);
  g.stroke({ width: 1, color, alpha: 0.6 });
  // Arms
  g.moveTo(x - 2, y - 4);
  g.lineTo(x - 3 + legOffset * 0.5, y - 2);
  g.stroke({ width: 1, color, alpha: 0.5 });
  g.moveTo(x + 2, y - 4);
  g.lineTo(x + 3 - legOffset * 0.5, y - 2);
  g.stroke({ width: 1, color, alpha: 0.5 });
}

/** Tiny pixel pedestrians walking along connection paths */
export function AmbientPixelPedestriansWalkingOnPaths() {
  const gfxRef = useRef<Graphics | null>(null);

  useTick((ticker) => {
    const g = gfxRef.current;
    if (!g) return;
    g.clear();

    const dt = ticker.deltaTime / 60;

    for (const p of pedestrians) {
      const segCount = CONNECTION_PATHS[p.pathIdx].points.length - 1;
      p.t += p.dir * p.speed * dt / 64;
      p.walkPhase += ticker.deltaTime * 0.15;

      // Bounce at endpoints
      if (p.t >= segCount) { p.t = segCount; p.dir = -1; }
      else if (p.t <= 0) { p.t = 0; p.dir = 1; }

      const pos = getPos(p.pathIdx, p.t);
      const legOffset = Math.sin(p.walkPhase) * 1.5;
      drawPed(g, pos.x, pos.y, p.color, legOffset);
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  return <pixiGraphics draw={initDraw} ref={gfxRef} />;
}
