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

const hw = DISTRICT_SIZE.w / 2;
const hh = DISTRICT_SIZE.h / 2;

/** 4 chain ships orbiting around the island */
const SHIPS = [
  { id: "aptos", label: "Aptos", color: 0x4fc1e9, phaseOffset: 0, speed: 0.012 },
  { id: "ethereum", label: "Ethereum", color: 0xa855f7, phaseOffset: Math.PI * 0.5, speed: 0.01 },
  { id: "solana", label: "Solana", color: 0x14f195, phaseOffset: Math.PI, speed: 0.014 },
  { id: "cosmos", label: "Cosmos", color: 0xffffff, phaseOffset: Math.PI * 1.5, speed: 0.009 },
];

/** Orbit radius for ships */
const ORBIT_RX = 78;
const ORBIT_RY = 34;

/** Draw a galleon ship */
function drawShip(g: Graphics, sx: number, sy: number, color: number, dir: number) {
  const hLen = 26;
  const hW = 7;

  // Hull
  g.moveTo(sx + dir * hLen, sy);
  g.lineTo(sx + dir * 5, sy - hW);
  g.lineTo(sx - dir * hLen * 0.5, sy - hW * 0.7);
  g.lineTo(sx - dir * hLen * 0.6, sy - hW * 1.1);
  g.lineTo(sx - dir * hLen * 0.6, sy + hW * 0.4);
  g.lineTo(sx + dir * 5, sy + hW);
  g.closePath();
  g.fill({ color: 0x3a2010, alpha: 1 });
  g.stroke({ width: 1.5, color, alpha: 0.6 });

  // Mast
  const mastX = sx + dir * 2;
  const mastBase = sy - hW;
  const mastH = 26;
  g.moveTo(mastX, mastBase);
  g.lineTo(mastX, mastBase - mastH);
  g.stroke({ width: 2, color: 0x5a3a20, alpha: 1 });

  // Main sail
  g.moveTo(mastX, mastBase - mastH);
  g.lineTo(mastX + dir * 14, mastBase - mastH * 0.4);
  g.lineTo(mastX, mastBase - 4);
  g.closePath();
  g.fill({ color, alpha: 0.25 });
  g.stroke({ width: 1, color, alpha: 0.7 });

  // Flag
  g.moveTo(mastX, mastBase - mastH);
  g.lineTo(mastX + dir * 6, mastBase - mastH - 3);
  g.lineTo(mastX, mastBase - mastH - 1);
  g.closePath();
  g.fill({ color, alpha: 0.85 });
}

/** Docks — Island port with lighthouse and 4 chain galleons anchored around */
export function DocksHarborCrosschainDistrict() {
  const dispatch = useAtlasDispatch();
  const { hoveredDistrict } = useAtlasState();
  const district = DISTRICT_MAP.get("docks")!;
  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);

  const lighthouseAngleRef = useRef(0);
  const beamGfxRef = useRef<Graphics | null>(null);
  const wavePhaseRef = useRef(0);
  const waveGfxRef = useRef<Graphics | null>(null);
  const shipPhaseRef = useRef(SHIPS.map((s) => s.phaseOffset));
  const shipGfxRef = useRef<Graphics | null>(null);
  const labelRefs = useRef<Text[]>([]);

  const drawScene = useCallback((g: Graphics) => {
    g.clear();

    // === Ground shadow ===
    g.ellipse(0, 10, 90, 36);
    g.fill({ color: 0x000000, alpha: 0.35 });
    g.ellipse(0, 10, 70, 28);
    g.fill({ color: 0x000000, alpha: 0.15 });

    // === Island base (irregular rocky shape) ===
    g.moveTo(0, -32);
    g.lineTo(38, -18);
    g.lineTo(42, -4);
    g.lineTo(34, 14);
    g.lineTo(12, 24);
    g.lineTo(-14, 26);
    g.lineTo(-36, 16);
    g.lineTo(-40, -2);
    g.lineTo(-34, -20);
    g.closePath();
    g.fill({ color: 0x1a3828, alpha: 1 });
    g.stroke({ width: 2, color: 0xffab00, alpha: 0.4 });

    // Island cliff edge (darker bottom)
    g.moveTo(42, -4);
    g.lineTo(42, 6);
    g.lineTo(12, 34);
    g.lineTo(-14, 36);
    g.lineTo(-36, 26);
    g.lineTo(-40, 8);
    g.lineTo(-40, -2);
    g.lineTo(-36, 16);
    g.lineTo(-14, 26);
    g.lineTo(12, 24);
    g.lineTo(34, 14);
    g.lineTo(42, -4);
    g.closePath();
    g.fill({ color: 0x0f2018, alpha: 1 });

    // Small trees on island
    const trees = [{ x: -20, y: -10 }, { x: 18, y: -14 }, { x: -8, y: 10 }];
    for (const t of trees) {
      // Trunk
      g.rect(t.x - 1, t.y - 2, 2, 6);
      g.fill({ color: 0x3d2817, alpha: 0.8 });
      // Canopy
      g.moveTo(t.x, t.y - 10);
      g.lineTo(t.x + 6, t.y - 2);
      g.lineTo(t.x - 6, t.y - 2);
      g.closePath();
      g.fill({ color: 0x1a5028, alpha: 0.85 });
    }

    // === Lighthouse tower ===
    // Base cylinder (tapered)
    g.moveTo(-8, 0);
    g.lineTo(-6, -40);
    g.lineTo(6, -40);
    g.lineTo(8, 0);
    g.closePath();
    g.fill({ color: 0xddccaa, alpha: 1 });
    // Red stripe bands
    for (let i = 0; i < 3; i++) {
      const sy = -8 - i * 12;
      g.rect(-7 + i * 0.5, sy, 14 - i, 5);
      g.fill({ color: 0xcc3333, alpha: 0.8 });
    }
    // Lamp room
    g.rect(-9, -48, 18, 8);
    g.fill({ color: 0x2a2a2a, alpha: 1 });
    g.stroke({ width: 1.5, color: 0xffab00, alpha: 0.8 });
    // Lamp glow
    g.circle(0, -44, 5);
    g.fill({ color: 0xffdd44, alpha: 0.7 });
    g.circle(0, -44, 3);
    g.fill({ color: 0xffffff, alpha: 0.5 });
    // Roof cap
    g.moveTo(-10, -48);
    g.lineTo(0, -56);
    g.lineTo(10, -48);
    g.closePath();
    g.fill({ color: 0x333333, alpha: 1 });

    // === Wooden dock planks (small piers on island edges) ===
    const docks = [
      { x1: -34, y1: -8, x2: -50, y2: -14 },
      { x1: 34, y1: -6, x2: 50, y2: -12 },
      { x1: -30, y1: 14, x2: -46, y2: 20 },
      { x1: 30, y1: 12, x2: 46, y2: 18 },
    ];
    for (const d of docks) {
      g.moveTo(d.x1, d.y1);
      g.lineTo(d.x2, d.y2);
      g.stroke({ width: 3, color: 0x4a3020, alpha: 0.8 });
      // Pier post at end
      g.circle(d.x2, d.y2, 2);
      g.fill({ color: 0x6a4030, alpha: 0.9 });
    }
  }, []);

  // Lighthouse beam, water waves, orbiting ships
  useTick((ticker) => {
    lighthouseAngleRef.current += ticker.deltaTime * 0.02;
    wavePhaseRef.current += ticker.deltaTime * 0.03;

    // Orbiting ships
    const sg = shipGfxRef.current;
    if (sg) {
      sg.clear();
      for (let i = 0; i < SHIPS.length; i++) {
        shipPhaseRef.current[i] += ticker.deltaTime * SHIPS[i].speed;
        const angle = shipPhaseRef.current[i];
        const sx = Math.cos(angle) * ORBIT_RX;
        const sy = Math.sin(angle) * ORBIT_RY + 4;
        // Direction ship faces = tangent of orbit (moving clockwise/counter)
        const dir = Math.cos(angle) > 0 ? 1 : -1;

        // Anchor chain from island edge to ship
        sg.moveTo(sx * 0.4, sy * 0.4);
        sg.lineTo(sx, sy);
        sg.stroke({ width: 1, color: 0xffab00, alpha: 0.15 });

        drawShip(sg, sx, sy, SHIPS[i].color, dir);

        // Move label to follow ship
        const label = labelRefs.current[i];
        if (label) {
          label.x = sx;
          label.y = sy - 24;
        }
      }
    }

    // Lighthouse beam
    const bg = beamGfxRef.current;
    if (bg) {
      bg.clear();
      const a = lighthouseAngleRef.current;
      const beamLen = 90;
      const bx = Math.cos(a) * beamLen;
      const by = Math.sin(a) * beamLen * 0.4;
      // Main beam
      bg.moveTo(0, -44);
      bg.lineTo(bx, -44 + by);
      bg.stroke({ width: 2, color: 0xffdd44, alpha: 0.35 });
      // Wider glow
      bg.moveTo(0, -44);
      bg.lineTo(bx * 0.95, -44 + by + 4);
      bg.stroke({ width: 4, color: 0xffdd44, alpha: 0.1 });
    }

    // Water ripples around island
    const wg = waveGfxRef.current;
    if (wg) {
      wg.clear();
      const p = wavePhaseRef.current;
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const r = 46 + Math.sin(p + i * 0.7) * 3;
        const wx = Math.cos(angle) * r;
        const wy = Math.sin(angle) * r * 0.5 + 8;
        wg.moveTo(wx - 5, wy);
        wg.lineTo(wx + 5, wy);
        wg.stroke({ width: 1, color: 0x00bcd4, alpha: 0.2 + Math.sin(p + i) * 0.08 });
      }
    }
  });

  const handlePointerDown = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: "docks" });
      dispatch({ type: "MARK_EXPLORED", id: "docks" });
    },
    [dispatch],
  );

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: "docks" });
  }, [dispatch]);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: null });
  }, [dispatch]);

  const titleStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 56,
    fill: "#ffab00",
    align: "left",
  });

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <DistrictTerritoryBorder hw={hw} hh={hh} color={0xffd740} hovered={hoveredDistrict === "docks"} />

      <pixiGraphics
        draw={drawScene}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Orbiting ships */}
      <pixiGraphics ref={shipGfxRef as React.RefObject<never>} draw={() => {}} />

      {/* Lighthouse beam */}
      <pixiGraphics ref={beamGfxRef as React.RefObject<never>} draw={() => {}} />

      {/* Water ripples */}
      <pixiGraphics ref={waveGfxRef as React.RefObject<never>} draw={() => {}} />

      {/* Chain labels — positioned by ref, updated each tick */}
      {SHIPS.map((s, i) => (
        <pixiText
          key={s.id}
          text={s.label}
          style={new TextStyle({
            fontFamily: "VT323, monospace",
            fontSize: 18,
            fill: `#${s.color.toString(16).padStart(6, "0")}`,
            align: "center",
          })}
          anchor={0.5}
          ref={(node: Text | null) => { if (node) labelRefs.current[i] = node; }}
          x={Math.cos(s.phaseOffset) * ORBIT_RX}
          y={Math.sin(s.phaseOffset) * ORBIT_RY - 20}
        />
      ))}

      <pixiText
        text="The Docks"
        style={titleStyle}
        anchor={{ x: 0, y: 0 }}
        x={14}
        y={hh + 20 + 8}
        rotation={Math.atan2(-(hh + 20), hw + 40)}
      />
    </pixiContainer>
  );
}
