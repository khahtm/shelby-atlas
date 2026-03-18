"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { DISTRICTS } from "@/src/data/district-metadata";
import { toScreen } from "@/src/utils/isometric-helpers";

extend({ Graphics });

/** Compute the centroid of all districts for orbit center */
const CENTER = (() => {
  const pts = DISTRICTS.map((d) => toScreen(d.gridPosition.col, d.gridPosition.row));
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
  };
})();

/** 3 helicopters with different orbits, speeds, and colors */
const HELIS = [
  { color: 0x00e5ff, orbitRx: 500, orbitRy: 220, speed: 0.008, phase: 0, bladeSpeed: 0.3 },
  { color: 0xff6b35, orbitRx: 380, orbitRy: 170, speed: 0.012, phase: Math.PI * 0.7, bladeSpeed: 0.35 },
  { color: 0xe040fb, orbitRx: 440, orbitRy: 200, speed: 0.006, phase: Math.PI * 1.4, bladeSpeed: 0.28 },
];

/** Draw a small neon helicopter */
function drawHeli(
  g: Graphics,
  x: number, y: number,
  color: number,
  bladeAngle: number,
  dir: number,
) {
  // Body — small rounded fuselage
  g.moveTo(x + dir * 14, y);
  g.lineTo(x + dir * 4, y - 5);
  g.lineTo(x - dir * 10, y - 4);
  g.lineTo(x - dir * 14, y - 1);
  g.lineTo(x - dir * 10, y + 3);
  g.lineTo(x + dir * 4, y + 4);
  g.closePath();
  g.fill({ color: 0x0a1520, alpha: 0.95 });
  g.stroke({ width: 1.5, color, alpha: 0.8 });

  // Cockpit window
  g.moveTo(x + dir * 10, y - 1);
  g.lineTo(x + dir * 5, y - 4);
  g.lineTo(x + dir * 5, y + 1);
  g.closePath();
  g.fill({ color, alpha: 0.3 });

  // Tail boom
  g.moveTo(x - dir * 10, y - 2);
  g.lineTo(x - dir * 22, y - 4);
  g.lineTo(x - dir * 22, y - 2);
  g.lineTo(x - dir * 10, y + 1);
  g.closePath();
  g.fill({ color: 0x0a1520, alpha: 0.9 });
  g.stroke({ width: 1, color, alpha: 0.5 });

  // Tail rotor
  g.moveTo(x - dir * 22, y - 8);
  g.lineTo(x - dir * 22, y + 2);
  g.stroke({ width: 1.5, color, alpha: 0.6 });

  // Skids (landing gear)
  g.moveTo(x + dir * 6, y + 5);
  g.lineTo(x - dir * 6, y + 5);
  g.stroke({ width: 1, color, alpha: 0.4 });
  g.moveTo(x + dir * 6, y + 7);
  g.lineTo(x - dir * 6, y + 7);
  g.stroke({ width: 1, color, alpha: 0.3 });

  // Main rotor blades (spinning)
  const rotorX = x;
  const rotorY = y - 7;
  const bladeLen = 18;
  for (let i = 0; i < 2; i++) {
    const a = bladeAngle + i * Math.PI;
    const bx = Math.cos(a) * bladeLen;
    const by = Math.sin(a) * bladeLen * 0.3;
    // Blade glow
    g.moveTo(rotorX - bx, rotorY - by);
    g.lineTo(rotorX + bx, rotorY + by);
    g.stroke({ width: 3, color, alpha: 0.15 });
    // Blade core
    g.moveTo(rotorX - bx, rotorY - by);
    g.lineTo(rotorX + bx, rotorY + by);
    g.stroke({ width: 1, color, alpha: 0.7 });
  }

  // Rotor hub
  g.circle(rotorX, rotorY, 2);
  g.fill({ color, alpha: 0.9 });

  // Underside glow (searchlight effect)
  g.circle(x, y + 10, 6);
  g.fill({ color, alpha: 0.06 });
  g.circle(x, y + 8, 3);
  g.fill({ color, alpha: 0.1 });
}

/** 3 neon helicopters flying elliptical orbits around the atlas */
export function AmbientNeonHelicoptersFlyingAroundAtlas() {
  const gfxRef = useRef<Graphics | null>(null);
  const phaseRef = useRef(HELIS.map((h) => h.phase));
  const bladeRef = useRef(HELIS.map(() => 0));

  useTick((ticker) => {
    const g = gfxRef.current;
    if (!g) return;
    g.clear();

    for (let i = 0; i < HELIS.length; i++) {
      const h = HELIS[i];
      phaseRef.current[i] += ticker.deltaTime * h.speed;
      bladeRef.current[i] += ticker.deltaTime * h.bladeSpeed;

      const angle = phaseRef.current[i];
      const x = CENTER.x + Math.cos(angle) * h.orbitRx;
      const y = CENTER.y + Math.sin(angle) * h.orbitRy;
      const dir = Math.sin(angle) > 0 ? 1 : -1;

      drawHeli(g, x, y, h.color, bladeRef.current[i], dir);
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  return <pixiGraphics draw={initDraw} ref={gfxRef} />;
}
