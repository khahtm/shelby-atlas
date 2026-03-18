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

/** Watchtower — radar station with spinning dish, antenna mast, base building, monitor screens, scan beams */
export function WatchtowerSecurityDistrict() {
  const dispatch = useAtlasDispatch();
  const { hoveredDistrict } = useAtlasState();
  const district = DISTRICT_MAP.get("watchtower")!;
  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);

  const scanAngleRef = useRef(0);
  const radarGfxRef = useRef<Graphics | null>(null);
  const scanGfxRef = useRef<Graphics | null>(null);

  /* ---- static base: building + screens + mast ---- */
  const drawBase = useCallback((g: Graphics) => {
    g.clear();

    // Ground shadow
    g.ellipse(0, 10, 85, 35);
    g.fill({ color: 0x000000, alpha: 0.3 });

    // --- Main base building (isometric box) ---
    // top face: centered at (0, -22), half extents 65w × 26h
    const bx = 0;
    const by = -18;
    const bw2 = 65;
    const bh2 = 26;
    const bdepth = 48;

    // top face
    g.moveTo(bx, by - bh2);
    g.lineTo(bx + bw2, by);
    g.lineTo(bx, by + bh2);
    g.lineTo(bx - bw2, by);
    g.closePath();
    g.fill({ color: 0x1a1a40, alpha: 1 });
    g.stroke({ width: 2, color: 0xe040fb, alpha: 0.7 });

    // right face
    g.moveTo(bx + bw2, by);
    g.lineTo(bx + bw2, by + bdepth);
    g.lineTo(bx, by + bh2 + bdepth);
    g.lineTo(bx, by + bh2);
    g.closePath();
    g.fill({ color: 0x0e0e28, alpha: 1 });
    g.stroke({ width: 1, color: 0xe040fb, alpha: 0.4 });

    // left face
    g.moveTo(bx - bw2, by);
    g.lineTo(bx - bw2, by + bdepth);
    g.lineTo(bx, by + bh2 + bdepth);
    g.lineTo(bx, by + bh2);
    g.closePath();
    g.fill({ color: 0x0a0a20, alpha: 1 });
    g.stroke({ width: 1, color: 0x9c27b0, alpha: 0.3 });

    // --- Security monitor screens on right face ---
    const screenColors = [0x00ff88, 0x00f0ff, 0x00ff88];
    for (let i = 0; i < 3; i++) {
      const sx = bx + 10 + i * 16;
      const sy = by + 4 + i * 3;
      // screen bezel
      g.rect(sx, sy, 10, 8);
      g.fill({ color: 0x050510, alpha: 1 });
      g.stroke({ width: 1, color: screenColors[i], alpha: 0.8 });
      // screen glow data lines
      for (let row = 0; row < 3; row++) {
        g.rect(sx + 1, sy + 1 + row * 2, 8, 1);
        g.fill({ color: screenColors[i], alpha: 0.5 });
      }
    }

    // --- Second tier / antenna block ---
    const tx = 0;
    const ty = -56;
    const tw2 = 30;
    const th2 = 12;
    const tdepth = 22;

    // top
    g.moveTo(tx, ty - th2);
    g.lineTo(tx + tw2, ty);
    g.lineTo(tx, ty + th2);
    g.lineTo(tx - tw2, ty);
    g.closePath();
    g.fill({ color: 0x25256a, alpha: 1 });
    g.stroke({ width: 1.5, color: 0xe040fb, alpha: 0.9 });

    // right face
    g.moveTo(tx + tw2, ty);
    g.lineTo(tx + tw2, ty + tdepth);
    g.lineTo(tx, ty + th2 + tdepth);
    g.lineTo(tx, ty + th2);
    g.closePath();
    g.fill({ color: 0x14145a, alpha: 1 });

    // left face
    g.moveTo(tx - tw2, ty);
    g.lineTo(tx - tw2, ty + tdepth);
    g.lineTo(tx, ty + th2 + tdepth);
    g.lineTo(tx, ty + th2);
    g.closePath();
    g.fill({ color: 0x0f0f40, alpha: 1 });

    // --- Antenna mast (taller) ---
    g.moveTo(-3, -70);
    g.lineTo(3, -70);
    g.lineTo(3, -110);
    g.lineTo(-3, -110);
    g.closePath();
    g.fill({ color: 0x333380, alpha: 1 });
    g.stroke({ width: 1, color: 0xe040fb, alpha: 0.6 });

    // mast cross-bars
    for (let i = 0; i < 4; i++) {
      const my = -76 - i * 9;
      g.moveTo(-12, my);
      g.lineTo(12, my);
      g.stroke({ width: 1, color: 0xe040fb, alpha: 0.4 });
    }

    // mast tip glow
    g.circle(0, -113, 4);
    g.fill({ color: 0x00f0ff, alpha: 0.9 });
    g.circle(0, -113, 7);
    g.fill({ color: 0x00f0ff, alpha: 0.15 });
  }, []);

  /* ---- animated radar dish + scan beams ---- */
  useTick((ticker) => {
    scanAngleRef.current += ticker.deltaTime * 0.025;

    const rg = radarGfxRef.current;
    if (rg) {
      rg.clear();
      const cx = 0;
      const cy = -118;

      // dish support arm (rotates)
      const armAngle = scanAngleRef.current;
      const armX = Math.cos(armAngle) * 18;
      const armY = Math.sin(armAngle) * 9;
      rg.moveTo(cx, cy);
      rg.lineTo(cx + armX, cy + armY);
      rg.stroke({ width: 2, color: 0xe040fb, alpha: 0.85 });

      // dish ellipse at arm tip
      const da = armAngle;
      rg.ellipse(cx + armX * 0.85, cy + armY * 0.85, 12, 6);
      rg.fill({ color: 0x1a1a40, alpha: 1 });
      rg.stroke({ width: 2, color: 0x00f0ff, alpha: 0.9 });

      // dish center dot
      rg.circle(cx + armX * 0.85, cy + armY * 0.85, 2);
      rg.fill({ color: 0x00f0ff, alpha: 1 });

      void da; // suppress lint
    }

    const sg = scanGfxRef.current;
    if (sg) {
      sg.clear();
      const angle = scanAngleRef.current;
      // main scan beam
      const beamLen = 100;
      const bx2 = Math.cos(angle) * beamLen;
      const by2 = Math.sin(angle) * beamLen * 0.5;
      sg.moveTo(0, -70);
      sg.lineTo(bx2, -70 + by2);
      sg.stroke({ width: 1.5, color: 0x00f0ff, alpha: 0.6 });

      // trailing fade beams
      for (let t = 1; t <= 3; t++) {
        const ta = angle - t * 0.25;
        const tx2 = Math.cos(ta) * beamLen * (1 - t * 0.15);
        const ty2 = Math.sin(ta) * beamLen * 0.5 * (1 - t * 0.15);
        sg.moveTo(0, -70);
        sg.lineTo(tx2, -70 + ty2);
        sg.stroke({ width: 1, color: 0x00f0ff, alpha: 0.2 - t * 0.04 });
      }
    }
  });

  const handleDistrictClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: "watchtower" });
      dispatch({ type: "MARK_EXPLORED", id: "watchtower" });
    },
    [dispatch],
  );

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: "watchtower" });
  }, [dispatch]);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: null });
  }, [dispatch]);

  const titleStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 56,
    fill: "#e040fb",
    align: "left",
  });

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <DistrictTerritoryBorder hw={hw} hh={hh} color={0xea80fc} hovered={hoveredDistrict === "watchtower"} />

      {/* Static building, screens, mast */}
      <pixiGraphics
        draw={drawBase}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleDistrictClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Animated scan beams */}
      <pixiGraphics ref={scanGfxRef as React.RefObject<never>} draw={() => {}} />

      {/* Animated radar dish */}
      <pixiGraphics ref={radarGfxRef as React.RefObject<never>} draw={() => {}} />

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
