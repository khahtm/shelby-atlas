"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import { toScreen, DISTRICT_SIZE } from "@/src/utils/isometric-helpers";
import { useAtlasState, useAtlasDispatch } from "@/src/stores/atlas-store";
import { DISTRICT_MAP } from "@/src/data/district-metadata";
import { DistrictTerritoryBorder } from "@/src/components/effects/district-territory-border";

extend({ Graphics, Container, Text });

const hw = DISTRICT_SIZE.w / 2; // 192
const hh = DISTRICT_SIZE.h / 2; // 96

/** Workshop — dev workstation with 3 monitors, desk, keyboard, coffee mug, server rack, blinking lights */
export function WorkshopDeveloperToolsDistrict() {
  const dispatch = useAtlasDispatch();
  const { hoveredDistrict } = useAtlasState();
  const district = DISTRICT_MAP.get("workshop")!;
  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);

  const blinkRef = useRef(0);
  const lightsGfxRef = useRef<Graphics | null>(null);

  /* ---- static scene: desk, monitors, keyboard, mug, rack ---- */
  const drawScene = useCallback((g: Graphics) => {
    g.clear();

    // Ground shadow
    g.ellipse(0, 12, 85, 32);
    g.fill({ color: 0x000000, alpha: 0.3 });

    // ============================================================
    // Desk — isometric box, wooden brown
    // Top face center: (0, -10), half extents 70w × 24h, depth 16
    // ============================================================
    const dx = 0;
    const dy = -10;
    const dw = 70;
    const dh = 24;
    const ddepth = 16;

    // desk top face
    g.moveTo(dx, dy - dh);
    g.lineTo(dx + dw, dy);
    g.lineTo(dx, dy + dh);
    g.lineTo(dx - dw, dy);
    g.closePath();
    g.fill({ color: 0x3e2000, alpha: 1 });
    g.stroke({ width: 1.5, color: 0x69f0ae, alpha: 0.5 });

    // desk right face
    g.moveTo(dx + dw, dy);
    g.lineTo(dx + dw, dy + ddepth);
    g.lineTo(dx, dy + dh + ddepth);
    g.lineTo(dx, dy + dh);
    g.closePath();
    g.fill({ color: 0x2a1500, alpha: 1 });

    // desk left face
    g.moveTo(dx - dw, dy);
    g.lineTo(dx - dw, dy + ddepth);
    g.lineTo(dx, dy + dh + ddepth);
    g.lineTo(dx, dy + dh);
    g.closePath();
    g.fill({ color: 0x1e1000, alpha: 1 });

    // ============================================================
    // 3 Monitor screens on the desk
    // Monitors arranged in a slight arc across the desk top face
    // ============================================================
    const monitors = [
      { ox: -42, oy: -32, col: 0x00e5ff },
      { ox: 0,   oy: -42, col: 0x69f0ae },
      { ox: 42,  oy: -32, col: 0x00e5ff },
    ];

    for (const mon of monitors) {
      const mx = mon.ox;
      const my = mon.oy;
      const mw = 22;
      const mh = 16;
      const mdepth = 18;

      // monitor back panel (iso box)
      // top
      g.moveTo(mx, my - mh / 2);
      g.lineTo(mx + mw, my);
      g.lineTo(mx, my + mh / 2);
      g.lineTo(mx - mw, my);
      g.closePath();
      g.fill({ color: 0x0a1a0a, alpha: 1 });
      g.stroke({ width: 1, color: mon.col, alpha: 0.7 });

      // screen face (right iso face, vertical)
      g.moveTo(mx + mw, my);
      g.lineTo(mx + mw, my - mdepth);
      g.lineTo(mx, my + mh / 2 - mdepth);
      g.lineTo(mx, my + mh / 2);
      g.closePath();
      g.fill({ color: 0x030f08, alpha: 1 });
      g.stroke({ width: 1, color: mon.col, alpha: 0.8 });

      // screen glow (inner fill)
      g.moveTo(mx + mw - 2, my - 2);
      g.lineTo(mx + mw - 2, my - mdepth + 3);
      g.lineTo(mx + 2, my + mh / 2 - mdepth + 3);
      g.lineTo(mx + 2, my + mh / 2 - 2);
      g.closePath();
      g.fill({ color: mon.col, alpha: 0.12 });

      // code lines on screen
      for (let row = 0; row < 4; row++) {
        const lineLen = 8 - row * 1.5;
        const lineX = mx + 3;
        const lineY = my + mh / 2 - mdepth + 5 + row * 3.5;
        g.moveTo(lineX, lineY);
        g.lineTo(lineX + lineLen, lineY - lineLen * 0.25);
        g.stroke({ width: 1, color: mon.col, alpha: 0.55 });
      }

      // monitor stand (small pillar below)
      g.moveTo(mx - 3, my + mh / 2 + 1);
      g.lineTo(mx + 3, my + mh / 2 + 1);
      g.lineTo(mx + 3, my + mh / 2 + 7);
      g.lineTo(mx - 3, my + mh / 2 + 7);
      g.closePath();
      g.fill({ color: 0x1a2a1a, alpha: 1 });
    }

    // ============================================================
    // Keyboard — small flat rectangle in front of desk
    // ============================================================
    const kx = -10;
    const ky = 10;
    g.moveTo(kx - 28, ky);
    g.lineTo(kx + 28, ky - 5);
    g.lineTo(kx + 28, ky + 3);
    g.lineTo(kx - 28, ky + 8);
    g.closePath();
    g.fill({ color: 0x1a2a1a, alpha: 1 });
    g.stroke({ width: 1, color: 0x69f0ae, alpha: 0.4 });

    // keyboard key rows
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 6; col++) {
        const kky = ky + 1 + row * 3 - col * 0.4;
        const kkx = kx - 22 + col * 8;
        g.rect(kkx, kky, 5, 2);
        g.fill({ color: 0x2a3a2a, alpha: 0.8 });
      }
    }

    // ============================================================
    // Coffee mug — tiny cylinder on desk right side
    // ============================================================
    const mugX = 58;
    const mugY = -14;
    // mug body (iso ellipse top + sides)
    g.ellipse(mugX, mugY, 7, 4);
    g.fill({ color: 0x4a3000, alpha: 1 });
    g.stroke({ width: 1, color: 0xffab00, alpha: 0.7 });
    // mug side rect
    g.rect(mugX - 7, mugY, 14, 10);
    g.fill({ color: 0x3a2000, alpha: 1 });
    g.stroke({ width: 1, color: 0xffab00, alpha: 0.5 });
    // mug bottom ellipse
    g.ellipse(mugX, mugY + 10, 7, 4);
    g.fill({ color: 0x2a1500, alpha: 1 });
    // steam wisps
    g.moveTo(mugX - 3, mugY - 2);
    g.lineTo(mugX - 2, mugY - 8);
    g.stroke({ width: 1, color: 0xffffff, alpha: 0.2 });
    g.moveTo(mugX + 2, mugY - 2);
    g.lineTo(mugX + 3, mugY - 9);
    g.stroke({ width: 1, color: 0xffffff, alpha: 0.15 });

    // ============================================================
    // Server rack — tall thin box behind desk (left side)
    // ============================================================
    const rx = -62;
    const ry = -52;
    const rw = 22;
    const rh = 10;
    const rdepth = 50;

    // rack top
    g.moveTo(rx, ry - rh);
    g.lineTo(rx + rw, ry);
    g.lineTo(rx, ry + rh);
    g.lineTo(rx - rw, ry);
    g.closePath();
    g.fill({ color: 0x111811, alpha: 1 });
    g.stroke({ width: 1.5, color: 0x69f0ae, alpha: 0.6 });

    // rack right face
    g.moveTo(rx + rw, ry);
    g.lineTo(rx + rw, ry + rdepth);
    g.lineTo(rx, ry + rh + rdepth);
    g.lineTo(rx, ry + rh);
    g.closePath();
    g.fill({ color: 0x0a100a, alpha: 1 });
    g.stroke({ width: 1, color: 0x69f0ae, alpha: 0.35 });

    // rack left face
    g.moveTo(rx - rw, ry);
    g.lineTo(rx - rw, ry + rdepth);
    g.lineTo(rx, ry + rh + rdepth);
    g.lineTo(rx, ry + rh);
    g.closePath();
    g.fill({ color: 0x060d06, alpha: 1 });

    // rack unit dividers on right face
    for (let u = 0; u < 5; u++) {
      const uy = ry + 6 + u * 9;
      g.moveTo(rx + rw, uy);
      g.lineTo(rx, uy + rh);
      g.stroke({ width: 1, color: 0x69f0ae, alpha: 0.2 });
    }
  }, []);

  /* ---- animated blinking lights on server rack ---- */
  useTick((ticker) => {
    blinkRef.current += ticker.deltaTime * 0.05;

    const lg = lightsGfxRef.current;
    if (!lg) return;
    lg.clear();

    const rx = -62;
    const ry = -52;
    const rh = 10;

    const lightColors = [0x69f0ae, 0x00e5ff, 0xff5722, 0x69f0ae, 0xffeb3b];
    for (let u = 0; u < 5; u++) {
      // stagger blink per unit
      const phase = blinkRef.current + u * 1.2;
      const on = Math.sin(phase) > 0;
      const lx = rx + 14;
      const ly = ry + rh + 2 + u * 9;
      lg.circle(lx, ly, 2.5);
      lg.fill({ color: lightColors[u], alpha: on ? 0.95 : 0.15 });
    }
  });

  const handlePointerDown = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: "workshop" });
      dispatch({ type: "MARK_EXPLORED", id: "workshop" });
    },
    [dispatch],
  );

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: "workshop" });
  }, [dispatch]);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: null });
  }, [dispatch]);

  const titleStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 56,
    fill: "#69f0ae",
    align: "left",
  });

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <DistrictTerritoryBorder hw={hw} hh={hh} color={0xb9f6ca} hovered={hoveredDistrict === "workshop"} />

      {/* Static scene: desk, monitors, keyboard, mug, server rack */}
      <pixiGraphics
        draw={drawScene}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Animated blinking server rack lights */}
      <pixiGraphics ref={lightsGfxRef as React.RefObject<never>} draw={() => {}} />

      <pixiText
        text="Workshop"
        style={titleStyle}
        anchor={{ x: 0, y: 0 }}
        x={14}
        y={hh + 20 + 8}
        rotation={Math.atan2(-(hh + 20), hw + 40)}
      />
    </pixiContainer>
  );
}
