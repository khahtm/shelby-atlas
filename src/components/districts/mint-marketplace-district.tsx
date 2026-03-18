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

interface GoldParticle {
  x: number;
  y: number;
  vy: number;
  alpha: number;
}

/** The Mint district — treasury vault with gold bars, vault door, coin particles */
export function MintMarketplaceDistrict() {
  const dispatch = useAtlasDispatch();
  const { hoveredDistrict } = useAtlasState();
  const district = DISTRICT_MAP.get("mint")!;
  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);
  const hw = DISTRICT_SIZE.w / 2;
  const hh = DISTRICT_SIZE.h / 2;

  // Floating gold coin particles
  const particlesRef = useRef<GoldParticle[]>(
    Array.from({ length: 10 }, () => ({
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 60,
      vy: -(0.2 + Math.random() * 0.4),
      alpha: 0.4 + Math.random() * 0.5,
    })),
  );
  const particleGfxRef = useRef<Graphics | null>(null);

  useTick(() => {
    const g = particleGfxRef.current;
    if (!g) return;
    g.clear();
    for (const p of particlesRef.current) {
      p.y += p.vy;
      p.alpha -= 0.003;
      if (p.alpha <= 0 || p.y < -80) {
        p.x = (Math.random() - 0.5) * 120;
        p.y = 30;
        p.alpha = 0.5 + Math.random() * 0.4;
      }
      // Coin shape — small circle with inner highlight
      g.circle(p.x, p.y, 3);
      g.fill({ color: 0xffd700, alpha: Math.max(0, p.alpha) });
      g.circle(p.x - 0.5, p.y - 0.5, 1.5);
      g.fill({ color: 0xffee88, alpha: Math.max(0, p.alpha * 0.6) });
    }
  });

  const drawVault = useCallback(
    (g: Graphics) => {
      g.clear();

      // === Ground shadow ===
      g.ellipse(0, 10, 85, 35);
      g.fill({ color: 0x000000, alpha: 0.3 });

      // === Vault body — isometric box ===
      const vw = 95; // half-width
      const vd = 50; // half-depth (isometric)
      const vh = 80; // vault height
      const baseY = -6;

      // Left face (dark green steel)
      g.moveTo(-vw, baseY);
      g.lineTo(-vw, baseY - vh);
      g.lineTo(0, baseY - vd - vh);
      g.lineTo(0, baseY - vd);
      g.closePath();
      g.fill({ color: 0x0a2a0a, alpha: 0.95 });

      // Right face (lighter green steel)
      g.moveTo(0, baseY - vd);
      g.lineTo(0, baseY - vd - vh);
      g.lineTo(vw, baseY - vh);
      g.lineTo(vw, baseY);
      g.closePath();
      g.fill({ color: 0x0f3a0f, alpha: 0.95 });

      // Top face
      g.moveTo(0, baseY - vd - vh);
      g.lineTo(vw, baseY - vh);
      g.lineTo(0, baseY - vd / 2 - vh);
      g.lineTo(-vw, baseY - vh);
      g.closePath();
      g.fill({ color: 0x1a4a1a, alpha: 0.95 });

      // === Reinforcement lines on left face ===
      for (let i = 1; i < 4; i++) {
        const ly = baseY - i * (vh / 4);
        g.moveTo(-vw + 2, ly);
        g.lineTo(-2, ly - vd);
        g.stroke({ width: 1, color: 0x76ff03, alpha: 0.15 });
      }

      // === Vault door (right face, circular) ===
      const doorX = vw * 0.48;
      const doorY = baseY - vh * 0.5;
      // Door frame
      g.circle(doorX, doorY, 22);
      g.fill({ color: 0x0a1a0a, alpha: 0.9 });
      g.stroke({ width: 3, color: 0x76ff03, alpha: 0.5 });
      // Door handle wheel
      g.circle(doorX, doorY, 14);
      g.stroke({ width: 2, color: 0x76ff03, alpha: 0.7 });
      // Spokes
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        g.moveTo(doorX, doorY);
        g.lineTo(doorX + Math.cos(a) * 12, doorY + Math.sin(a) * 12);
        g.stroke({ width: 1.5, color: 0x76ff03, alpha: 0.6 });
      }
      // Center bolt
      g.circle(doorX, doorY, 4);
      g.fill({ color: 0xb2ff59, alpha: 0.8 });

      // === Door hinges (right face edge) ===
      for (let i = 0; i < 3; i++) {
        const hy = baseY - vh * 0.25 - i * (vh * 0.25);
        g.rect(vw - 6, hy - 3, 6, 6);
        g.fill({ color: 0x2a5a2a, alpha: 0.8 });
        g.stroke({ width: 1, color: 0x76ff03, alpha: 0.3 });
      }

      // === Gold bars stack (visible through left face window) ===
      const barX = -vw * 0.55;
      const barBaseY = baseY - 8;
      const barW = 16;
      const barH = 7;
      const barColors = [0xdaa520, 0xffd700, 0xb8860b];
      // 3 rows of stacked bars
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3 - row; col++) {
          const bx = barX + col * (barW + 2) - ((3 - row - 1) * (barW + 2)) / 2;
          const by = barBaseY - row * (barH + 1) - vd * 0.4;
          // Bar top
          g.rect(bx, by, barW, barH);
          g.fill({ color: barColors[row % 3], alpha: 0.85 });
          g.stroke({ width: 1, color: 0xffee88, alpha: 0.4 });
        }
      }

      // === Green status lights on top ===
      for (let i = 0; i < 3; i++) {
        const lx = -20 + i * 20;
        const ly = baseY - vd * 0.75 - vh - 2;
        g.circle(lx, ly, 3);
        g.fill({ color: 0x76ff03, alpha: 0.6 + i * 0.1 });
      }

      // === "$" emblem on left face ===
      // Simple dollar sign made of lines
      const ex = -vw * 0.5;
      const ey = baseY - vh * 0.5 - vd * 0.5;
      g.moveTo(ex + 6, ey - 8);
      g.lineTo(ex - 4, ey - 4);
      g.lineTo(ex + 6, ey);
      g.lineTo(ex - 4, ey + 4);
      g.stroke({ width: 2, color: 0xffd700, alpha: 0.5 });
      g.moveTo(ex + 1, ey - 10);
      g.lineTo(ex + 1, ey + 6);
      g.stroke({ width: 1.5, color: 0xffd700, alpha: 0.5 });
    },
    [hw, hh],
  );

  const drawParticleInit = useCallback((g: Graphics) => { g.clear(); }, []);

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: "mint" });
      dispatch({ type: "MARK_EXPLORED", id: "mint" });
    },
    [dispatch],
  );

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: "mint" });
  }, [dispatch]);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: null });
  }, [dispatch]);

  const titleStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 56,
    fill: "#76ff03",
    align: "left",
  });

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <DistrictTerritoryBorder hw={hw} hh={hh} color={0xb2ff59} hovered={hoveredDistrict === "mint"} />
      <pixiGraphics
        draw={drawVault}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <pixiGraphics ref={particleGfxRef} draw={drawParticleInit} />
      <pixiText
        text={district.name}
        style={titleStyle}
        anchor={{ x: 0, y: 0 }}
        x={14}
        y={hh + 20 + 8}
        rotation={Math.atan2(-(hh + 20), hw + 40)}
      />
    </pixiContainer>
  );
}
