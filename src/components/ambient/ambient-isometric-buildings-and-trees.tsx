"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { toScreen, GRID_COLS, GRID_ROWS } from "@/src/utils/isometric-helpers";
import { isNearDistrict, isOnPath } from "@/src/data/connection-path-data";

extend({ Graphics });

/** Simple seeded pseudo-random for deterministic placement */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Prop {
  x: number;
  y: number;
  type: "building" | "tree";
  height: number;
  color: number;
  neon: number;
  phase: number;
}

const BUILDING_COLORS = [0x0f1a2e, 0x121f33, 0x0d1628, 0x151d30, 0x0a1520];
const TREE_COLORS = [0x1a3a2a, 0x0f2e1f, 0x1e4530, 0x143525, 0x0b2618];

/** Wide variety of neon accent colors */
const NEON_COLORS = [
  0x00e5ff, 0x00bcd4, 0x18ffff,   // cyans
  0xff6b35, 0xff9f1c, 0xffab00,   // oranges/golds
  0x76ff03, 0x69f0ae, 0x00ff88,   // greens
  0xe040fb, 0xea80fc, 0xff4081,   // pinks/purples
  0xffdd44, 0xffd700, 0xffee88,   // yellows
  0x536dfe, 0x448aff, 0x82b1ff,   // blues
];

function generateProps(): Prop[] {
  const rng = seededRandom(42);
  const props: Prop[] = [];

  for (let col = 1; col < GRID_COLS; col++) {
    for (let row = 1; row < GRID_ROWS; row++) {
      if (isNearDistrict(col, row, 4)) continue;
      if (isOnPath(col, row)) continue;

      const roll = rng();
      if (roll > 0.12) continue;

      const pos = toScreen(col, row);
      const isBuilding = rng() > 0.45;
      const neon = NEON_COLORS[Math.floor(rng() * NEON_COLORS.length)];
      const phase = rng() * Math.PI * 2;

      if (isBuilding) {
        props.push({
          x: pos.x, y: pos.y, type: "building",
          height: 24 + Math.floor(rng() * 45),
          color: BUILDING_COLORS[Math.floor(rng() * BUILDING_COLORS.length)],
          neon, phase,
        });
      } else {
        props.push({
          x: pos.x, y: pos.y, type: "tree",
          height: 10 + Math.floor(rng() * 14),
          color: TREE_COLORS[Math.floor(rng() * TREE_COLORS.length)],
          neon, phase,
        });
      }
    }
  }
  return props;
}

const PROPS = generateProps();

/** Draw building with pulsing neon glow */
function drawBuilding(g: Graphics, p: Prop, glowAlpha: number) {
  const bw = 22;
  const bh = 12;
  const h = p.height;

  // Left face
  g.moveTo(p.x - bw, p.y - bh / 2);
  g.lineTo(p.x, p.y);
  g.lineTo(p.x, p.y - h);
  g.lineTo(p.x - bw, p.y - bh / 2 - h);
  g.closePath();
  g.fill({ color: p.color, alpha: 0.9 });

  // Right face
  g.moveTo(p.x, p.y);
  g.lineTo(p.x + bw, p.y - bh / 2);
  g.lineTo(p.x + bw, p.y - bh / 2 - h);
  g.lineTo(p.x, p.y - h);
  g.closePath();
  g.fill({ color: ((p.color & 0xfefefe) >> 1) + 0x080808, alpha: 0.9 });

  // Top face
  g.moveTo(p.x, p.y - h);
  g.lineTo(p.x + bw, p.y - bh / 2 - h);
  g.lineTo(p.x, p.y - bh - h);
  g.lineTo(p.x - bw, p.y - bh / 2 - h);
  g.closePath();
  g.fill({ color: ((p.color & 0xfcfcfc) >> 2) + 0x1a1a1a, alpha: 0.9 });

  // Neon edge outlines — pulsing
  g.moveTo(p.x - bw, p.y - bh / 2 - h);
  g.lineTo(p.x, p.y - h);
  g.stroke({ width: 1, color: p.neon, alpha: glowAlpha * 0.8 });
  g.moveTo(p.x, p.y - h);
  g.lineTo(p.x + bw, p.y - bh / 2 - h);
  g.stroke({ width: 1, color: p.neon, alpha: glowAlpha * 0.7 });
  g.moveTo(p.x, p.y);
  g.lineTo(p.x, p.y - h);
  g.stroke({ width: 1, color: p.neon, alpha: glowAlpha * 0.5 });

  // Base glow on ground
  g.moveTo(p.x - bw, p.y - bh / 2);
  g.lineTo(p.x, p.y);
  g.lineTo(p.x + bw, p.y - bh / 2);
  g.stroke({ width: 1, color: p.neon, alpha: glowAlpha * 0.3 });

  // Glowing windows — pulsing
  const windowRows = Math.min(3, Math.floor(h / 12));
  for (let i = 0; i < windowRows; i++) {
    g.rect(p.x - bw + 4, p.y - bh / 2 - 6 - i * 10, 3, 3);
    g.fill({ color: p.neon, alpha: glowAlpha * 0.8 });
    g.rect(p.x + 4, p.y - bh / 2 - 8 - i * 10, 3, 3);
    g.fill({ color: p.neon, alpha: glowAlpha * 0.65 });
  }

  // Rooftop light for taller buildings
  if (h > 25) {
    g.circle(p.x, p.y - bh - h - 3, 1.5 + glowAlpha * 0.5);
    g.fill({ color: p.neon, alpha: glowAlpha });
  }
}

/** Draw a small pixel tree */
function drawTree(g: Graphics, p: Prop) {
  const h = p.height;
  g.rect(p.x - 1, p.y - h / 2, 2, h / 2);
  g.fill({ color: 0x3d2817, alpha: 0.8 });
  for (let i = 0; i < 2; i++) {
    const ty = p.y - h / 2 - i * 6;
    const sz = 8 - i * 2;
    g.moveTo(p.x, ty - sz);
    g.lineTo(p.x + sz, ty);
    g.lineTo(p.x - sz, ty);
    g.closePath();
    g.fill({ color: p.color, alpha: 0.85 - i * 0.1 });
  }
}

/** Ambient buildings with pulsing neon glow + trees */
export function AmbientIsometricBuildingsAndTrees() {
  const gfxRef = useRef<Graphics | null>(null);
  const timeRef = useRef(0);

  useTick((ticker) => {
    timeRef.current += ticker.deltaTime * 0.025;
    const g = gfxRef.current;
    if (!g) return;
    g.clear();

    const t = timeRef.current;
    for (const p of PROPS) {
      if (p.type === "building") {
        // Each building pulses at its own phase
        const glow = 0.35 + Math.sin(t + p.phase) * 0.25;
        drawBuilding(g, p, glow);
      } else {
        drawTree(g, p);
      }
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  return <pixiGraphics draw={initDraw} ref={gfxRef} />;
}
