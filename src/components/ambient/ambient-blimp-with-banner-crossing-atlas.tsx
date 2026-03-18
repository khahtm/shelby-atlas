"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics, Text, TextStyle } from "pixi.js";
import { DISTRICTS } from "@/src/data/district-metadata";
import { toScreen } from "@/src/utils/isometric-helpers";

extend({ Graphics, Text });

/** Compute atlas bounds for the blimp flight path */
const POSITIONS = DISTRICTS.map((d) => toScreen(d.gridPosition.col, d.gridPosition.row));
const MIN_X = Math.min(...POSITIONS.map((p) => p.x)) - 300;
const MAX_X = Math.max(...POSITIONS.map((p) => p.x)) + 300;
const CENTER_Y = POSITIONS.reduce((s, p) => s + p.y, 0) / POSITIONS.length;

/** Total flight width */
const FLIGHT_W = MAX_X - MIN_X;

/** One full crossing every 10 seconds at 60fps */
const CROSS_SPEED = FLIGHT_W / (10 * 60);

/** Banner text */
const BANNER_TEXT = "Shelby, i need API, pls!!!";

const bannerStyle = new TextStyle({
  fontFamily: "VT323, monospace",
  fontSize: 48,
  fill: "#00f0ff",
  align: "center",
});

/** Draw the blimp / hot air balloon body */
function drawBlimp(g: Graphics, x: number, y: number) {
  // === Balloon envelope (large ellipse) ===
  // Outer glow
  g.ellipse(x, y - 32, 48, 30);
  g.fill({ color: 0xff6b35, alpha: 0.08 });
  // Main envelope
  g.ellipse(x, y - 32, 40, 24);
  g.fill({ color: 0xff6b35, alpha: 0.85 });
  g.stroke({ width: 2, color: 0xffab00, alpha: 0.7 });

  // Envelope stripes
  g.ellipse(x, y - 32, 40, 24);
  g.stroke({ width: 1, color: 0xffd740, alpha: 0.3 });
  // Vertical stripe
  g.moveTo(x, y - 56);
  g.lineTo(x, y - 8);
  g.stroke({ width: 1.5, color: 0xffd740, alpha: 0.25 });
  // Side stripes
  g.moveTo(x - 18, y - 52);
  g.lineTo(x - 18, y - 12);
  g.stroke({ width: 1, color: 0xffd740, alpha: 0.15 });
  g.moveTo(x + 18, y - 52);
  g.lineTo(x + 18, y - 12);
  g.stroke({ width: 1, color: 0xffd740, alpha: 0.15 });

  // === Gondola / basket ===
  // Ropes from envelope to basket
  g.moveTo(x - 16, y - 9);
  g.lineTo(x - 10, y + 4);
  g.stroke({ width: 1.5, color: 0xffab00, alpha: 0.5 });
  g.moveTo(x + 16, y - 9);
  g.lineTo(x + 10, y + 4);
  g.stroke({ width: 1.5, color: 0xffab00, alpha: 0.5 });

  // Basket body
  g.rect(x - 12, y + 4, 24, 12);
  g.fill({ color: 0x3a2010, alpha: 0.9 });
  g.stroke({ width: 1.5, color: 0xffab00, alpha: 0.6 });

  // Basket weave lines
  g.moveTo(x - 12, y + 10);
  g.lineTo(x + 12, y + 10);
  g.stroke({ width: 0.5, color: 0xffab00, alpha: 0.3 });

  // === Banner rope from basket ===
  g.moveTo(x + 12, y + 10);
  g.lineTo(x + 30, y + 18);
  g.stroke({ width: 1.5, color: 0xffab00, alpha: 0.4 });

  // === Banner flag ===
  const bw = 460;
  const bh = 52;
  const bx = x + 52;
  const by = y + 8;

  // Banner background with slight wave
  g.moveTo(bx, by);
  g.lineTo(bx + bw, by + 3);
  g.lineTo(bx + bw, by + bh + 3);
  g.lineTo(bx, by + bh);
  g.closePath();
  g.fill({ color: 0x0a0e1a, alpha: 0.85 });
  g.stroke({ width: 1, color: 0x00e5ff, alpha: 0.6 });

  // Banner end triangle (pennant tail)
  g.moveTo(bx + bw, by + 3);
  g.lineTo(bx + bw + 10, by + bh / 2 + 3);
  g.lineTo(bx + bw, by + bh + 3);
  g.closePath();
  g.fill({ color: 0x0a0e1a, alpha: 0.85 });
  g.stroke({ width: 1, color: 0x00e5ff, alpha: 0.6 });

  // Top rope to banner
  g.moveTo(bx + bw * 0.5, by);
  g.lineTo(bx + bw * 0.5 - 8, by - 6);
  g.stroke({ width: 0.5, color: 0xffab00, alpha: 0.3 });
}

/** Blimp / hot air balloon that crosses the atlas every 10s with a trailing banner */
export function AmbientBlimpWithBannerCrossingAtlas() {
  const gfxRef = useRef<Graphics | null>(null);
  const labelRef = useRef<Text | null>(null);
  const xRef = useRef(MIN_X);
  const bobRef = useRef(0);

  useTick((ticker) => {
    const g = gfxRef.current;
    if (!g) return;

    // Advance position
    xRef.current += CROSS_SPEED * ticker.deltaTime;
    bobRef.current += ticker.deltaTime * 0.04;

    // Reset when past the right edge
    if (xRef.current > MAX_X + 220) {
      xRef.current = MIN_X;
    }

    const bx = xRef.current;
    const by = CENTER_Y - 160 + Math.sin(bobRef.current) * 8; // gentle bob

    g.clear();
    drawBlimp(g, bx, by);

    // Move banner text label
    const label = labelRef.current;
    if (label) {
      label.x = bx + 282;
      label.y = by + 22;
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  return (
    <>
      <pixiGraphics draw={initDraw} ref={gfxRef} />
      <pixiText
        ref={(node: Text | null) => { if (node) labelRef.current = node; }}
        text={BANNER_TEXT}
        style={bannerStyle}
        anchor={0.5}
        x={0}
        y={0}
      />
    </>
  );
}
