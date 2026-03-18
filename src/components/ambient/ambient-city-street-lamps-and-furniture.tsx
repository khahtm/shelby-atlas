"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { toScreen, GRID_COLS, GRID_ROWS } from "@/src/utils/isometric-helpers";
import { isNearDistrict, isOnPath } from "@/src/data/connection-path-data";

extend({ Graphics });

/** Seeded random */
function srand(seed: number) {
  let s = seed;
  return () => { s = (s * 48271) % 2147483647; return (s - 1) / 2147483646; };
}

/** Neon lamp colors */
const LAMP_COLORS = [0x00e5ff, 0xffab00, 0x76ff03, 0xe040fb, 0x69f0ae, 0xff6b35];

interface StreetLamp { x: number; y: number; color: number; phase: number }
interface ParkedCar { x: number; y: number; color: number; dir: number }
interface Bench { x: number; y: number }
interface Billboard { x: number; y: number; color: number; w: number }

/** Pre-generate all city furniture */
function generateFurniture() {
  const rng = srand(77);
  const lamps: StreetLamp[] = [];
  const cars: ParkedCar[] = [];
  const benches: Bench[] = [];
  const billboards: Billboard[] = [];

  for (let col = 1; col < GRID_COLS; col++) {
    for (let row = 1; row < GRID_ROWS; row++) {
      // Street lamps go along paths
      if (isOnPath(col, row) && rng() < 0.3) {
        const pos = toScreen(col, row);
        lamps.push({
          x: pos.x + (rng() - 0.5) * 20,
          y: pos.y + (rng() - 0.5) * 10,
          color: LAMP_COLORS[Math.floor(rng() * LAMP_COLORS.length)],
          phase: rng() * Math.PI * 2,
        });
      }

      // Cars and benches go near buildings (not on paths, not near districts)
      if (!isOnPath(col, row) && !isNearDistrict(col, row, 5) && rng() < 0.06) {
        const pos = toScreen(col, row);
        const roll = rng();
        if (roll < 0.5) {
          cars.push({
            x: pos.x + (rng() - 0.5) * 30,
            y: pos.y + (rng() - 0.5) * 15,
            color: LAMP_COLORS[Math.floor(rng() * LAMP_COLORS.length)],
            dir: rng() > 0.5 ? 1 : -1,
          });
        } else if (roll < 0.75) {
          benches.push({
            x: pos.x + (rng() - 0.5) * 20,
            y: pos.y + (rng() - 0.5) * 10,
          });
        } else {
          billboards.push({
            x: pos.x,
            y: pos.y,
            color: LAMP_COLORS[Math.floor(rng() * LAMP_COLORS.length)],
            w: 14 + Math.floor(rng() * 10),
          });
        }
      }
    }
  }
  return { lamps, cars, benches, billboards };
}

const FURNITURE = generateFurniture();

function drawLamp(g: Graphics, l: StreetLamp, glow: number) {
  // Pole
  g.moveTo(l.x, l.y);
  g.lineTo(l.x, l.y - 18);
  g.stroke({ width: 1.5, color: 0x444444, alpha: 0.7 });
  // Arm
  g.moveTo(l.x, l.y - 18);
  g.lineTo(l.x + 5, l.y - 20);
  g.stroke({ width: 1, color: 0x444444, alpha: 0.6 });
  // Light bulb glow
  g.circle(l.x + 5, l.y - 20, 3 + glow);
  g.fill({ color: l.color, alpha: 0.1 + glow * 0.15 });
  g.circle(l.x + 5, l.y - 20, 1.5);
  g.fill({ color: l.color, alpha: 0.7 + glow * 0.2 });
  // Ground light pool
  g.ellipse(l.x + 3, l.y + 2, 8, 3);
  g.fill({ color: l.color, alpha: 0.04 + glow * 0.03 });
}

function drawCar(g: Graphics, c: ParkedCar) {
  const d = c.dir;
  // Body
  g.moveTo(c.x + d * 12, c.y);
  g.lineTo(c.x + d * 8, c.y - 4);
  g.lineTo(c.x - d * 8, c.y - 4);
  g.lineTo(c.x - d * 10, c.y);
  g.lineTo(c.x - d * 8, c.y + 2);
  g.lineTo(c.x + d * 8, c.y + 2);
  g.closePath();
  g.fill({ color: 0x0a1520, alpha: 0.9 });
  g.stroke({ width: 1, color: c.color, alpha: 0.5 });
  // Roof
  g.moveTo(c.x + d * 4, c.y - 4);
  g.lineTo(c.x + d * 2, c.y - 7);
  g.lineTo(c.x - d * 4, c.y - 7);
  g.lineTo(c.x - d * 6, c.y - 4);
  g.closePath();
  g.fill({ color: 0x0a1520, alpha: 0.95 });
  g.stroke({ width: 1, color: c.color, alpha: 0.4 });
  // Headlight
  g.circle(c.x + d * 11, c.y, 1.5);
  g.fill({ color: c.color, alpha: 0.7 });
  // Taillight
  g.circle(c.x - d * 9, c.y, 1);
  g.fill({ color: 0xff2222, alpha: 0.5 });
  // Wheels
  g.circle(c.x + d * 6, c.y + 2, 2);
  g.fill({ color: 0x222222, alpha: 0.8 });
  g.circle(c.x - d * 5, c.y + 2, 2);
  g.fill({ color: 0x222222, alpha: 0.8 });
}

function drawBench(g: Graphics, b: Bench) {
  // Seat
  g.moveTo(b.x - 8, b.y);
  g.lineTo(b.x + 8, b.y - 2);
  g.lineTo(b.x + 8, b.y);
  g.lineTo(b.x - 8, b.y + 2);
  g.closePath();
  g.fill({ color: 0x3a2010, alpha: 0.8 });
  g.stroke({ width: 1, color: 0x69f0ae, alpha: 0.3 });
  // Legs
  g.moveTo(b.x - 6, b.y + 1);
  g.lineTo(b.x - 6, b.y + 4);
  g.stroke({ width: 1, color: 0x555555, alpha: 0.6 });
  g.moveTo(b.x + 6, b.y - 1);
  g.lineTo(b.x + 6, b.y + 3);
  g.stroke({ width: 1, color: 0x555555, alpha: 0.6 });
}

function drawBillboard(g: Graphics, bb: Billboard, glow: number) {
  const h = 24;
  // Pole
  g.moveTo(bb.x, bb.y);
  g.lineTo(bb.x, bb.y - h);
  g.stroke({ width: 2, color: 0x333333, alpha: 0.7 });
  // Board
  g.rect(bb.x - bb.w / 2, bb.y - h - 12, bb.w, 12);
  g.fill({ color: 0x0a0a1a, alpha: 0.95 });
  g.stroke({ width: 1.5, color: bb.color, alpha: 0.5 + glow * 0.3 });
  // Neon text lines on board
  for (let i = 0; i < 2; i++) {
    const lw = bb.w * (0.6 - i * 0.15);
    g.rect(bb.x - lw / 2, bb.y - h - 10 + i * 5, lw, 2);
    g.fill({ color: bb.color, alpha: 0.4 + glow * 0.3 });
  }
  // Top spotlight
  g.circle(bb.x, bb.y - h - 14, 2);
  g.fill({ color: bb.color, alpha: 0.5 + glow * 0.3 });
}

/** Street lamps, parked cars, benches, billboards — with pulsing lamp glow */
export function AmbientCityStreetLampsAndFurniture() {
  const gfxRef = useRef<Graphics | null>(null);
  const timeRef = useRef(0);

  useTick((ticker) => {
    timeRef.current += ticker.deltaTime * 0.02;
    const g = gfxRef.current;
    if (!g) return;
    g.clear();

    const t = timeRef.current;

    // Static furniture
    for (const c of FURNITURE.cars) drawCar(g, c);
    for (const b of FURNITURE.benches) drawBench(g, b);

    // Pulsing lamps
    for (const l of FURNITURE.lamps) {
      const glow = 0.3 + Math.sin(t + l.phase) * 0.3;
      drawLamp(g, l, glow);
    }

    // Pulsing billboards
    for (const bb of FURNITURE.billboards) {
      const glow = 0.3 + Math.sin(t * 1.5 + bb.x * 0.01) * 0.3;
      drawBillboard(g, bb, glow);
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  return <pixiGraphics draw={initDraw} ref={gfxRef} />;
}
