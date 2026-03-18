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

/** Placeholder hall-of-fame projects */
const PROJECTS = [
  { name: "Project Alpha", color: 0xffd700 },
  { name: "Project Beta", color: 0x00e5ff },
  { name: "Project Gamma", color: 0xff6b35 },
  { name: "Project Delta", color: 0x76ff03 },
  { name: "Project Omega", color: 0xe040fb },
];

/** Trophy pedestal positions — arranged in an arc */
const PEDESTALS = PROJECTS.map((_, i) => {
  const spread = 120;
  const x = -spread / 2 + (i / (PROJECTS.length - 1)) * spread;
  const y = -8 + Math.abs(x) * 0.08;
  return { x, y };
});

/** Hall of Fame — trophy museum with golden pedestals and spotlight beams */
export function HallOfFameTrophyMuseumDistrict() {
  const dispatch = useAtlasDispatch();
  const { hoveredDistrict } = useAtlasState();
  const district = DISTRICT_MAP.get("hall-of-fame")!;
  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);

  const spotlightRef = useRef(0);
  const spotGfxRef = useRef<Graphics | null>(null);

  const drawMuseum = useCallback((g: Graphics) => {
    g.clear();

    // Ground shadow
    g.ellipse(0, 10, 95, 38);
    g.fill({ color: 0x000000, alpha: 0.35 });
    g.ellipse(0, 10, 75, 30);
    g.fill({ color: 0x000000, alpha: 0.15 });

    // === Museum building (back wall) ===
    const mw = 80;
    const md = 20;
    const mh = 50;
    const my = -16;

    // Left wall
    g.moveTo(-mw, my);
    g.lineTo(-mw, my - mh);
    g.lineTo(0, my - md - mh);
    g.lineTo(0, my - md);
    g.closePath();
    g.fill({ color: 0x1a1a10, alpha: 0.95 });

    // Right wall
    g.moveTo(0, my - md);
    g.lineTo(0, my - md - mh);
    g.lineTo(mw, my - mh);
    g.lineTo(mw, my);
    g.closePath();
    g.fill({ color: 0x22220f, alpha: 0.95 });

    // Roof
    g.moveTo(0, my - md - mh);
    g.lineTo(mw, my - mh);
    g.lineTo(0, my - mh + md);
    g.lineTo(-mw, my - mh);
    g.closePath();
    g.fill({ color: 0x2a2a18, alpha: 0.95 });
    g.stroke({ width: 2, color: 0xffd700, alpha: 0.6 });

    // Columns on front
    for (let i = 0; i < 4; i++) {
      const cx = -mw + 20 + i * (mw * 2 - 40) / 3;
      const cy = my;
      g.moveTo(cx - 3, cy);
      g.lineTo(cx - 3, cy - mh + 4);
      g.lineTo(cx + 3, cy - mh + 4);
      g.lineTo(cx + 3, cy);
      g.closePath();
      g.fill({ color: 0x33331a, alpha: 1 });
      g.stroke({ width: 1, color: 0xffd700, alpha: 0.35 });
    }

    // "HALL OF FAME" text panel on front
    g.rect(-35, my - mh + 8, 70, 10);
    g.fill({ color: 0x0a0a05, alpha: 0.9 });
    g.stroke({ width: 1, color: 0xffd700, alpha: 0.5 });

    // Golden entrance glow
    g.rect(-12, my - 20, 24, 20);
    g.fill({ color: 0xffd700, alpha: 0.08 });
    g.stroke({ width: 1, color: 0xffd700, alpha: 0.4 });

    // === Trophy pedestals ===
    for (let i = 0; i < PROJECTS.length; i++) {
      const px = PEDESTALS[i].x;
      const py = PEDESTALS[i].y;
      const proj = PROJECTS[i];

      // Pedestal base (small isometric box)
      const pw = 10;
      const pd = 6;
      const ph = 14;

      // Top
      g.moveTo(px, py - pd);
      g.lineTo(px + pw, py);
      g.lineTo(px, py + pd);
      g.lineTo(px - pw, py);
      g.closePath();
      g.fill({ color: 0x2a2a18, alpha: 1 });
      g.stroke({ width: 1, color: 0xffd700, alpha: 0.5 });

      // Right face
      g.moveTo(px + pw, py);
      g.lineTo(px + pw, py + ph);
      g.lineTo(px, py + pd + ph);
      g.lineTo(px, py + pd);
      g.closePath();
      g.fill({ color: 0x1a1a0a, alpha: 1 });

      // Left face
      g.moveTo(px - pw, py);
      g.lineTo(px - pw, py + ph);
      g.lineTo(px, py + pd + ph);
      g.lineTo(px, py + pd);
      g.closePath();
      g.fill({ color: 0x141408, alpha: 1 });

      // Trophy cup on top
      // Cup base
      g.rect(px - 4, py - pd - 3, 8, 3);
      g.fill({ color: proj.color, alpha: 0.7 });
      // Cup body
      g.moveTo(px - 5, py - pd - 3);
      g.lineTo(px - 4, py - pd - 12);
      g.lineTo(px + 4, py - pd - 12);
      g.lineTo(px + 5, py - pd - 3);
      g.closePath();
      g.fill({ color: proj.color, alpha: 0.5 });
      g.stroke({ width: 1, color: proj.color, alpha: 0.8 });
      // Cup handles
      g.moveTo(px - 5, py - pd - 5);
      g.lineTo(px - 8, py - pd - 7);
      g.lineTo(px - 5, py - pd - 9);
      g.stroke({ width: 1, color: proj.color, alpha: 0.5 });
      g.moveTo(px + 5, py - pd - 5);
      g.lineTo(px + 8, py - pd - 7);
      g.lineTo(px + 5, py - pd - 9);
      g.stroke({ width: 1, color: proj.color, alpha: 0.5 });
      // Star on trophy
      g.circle(px, py - pd - 8, 2);
      g.fill({ color: 0xffffff, alpha: 0.6 });
    }
  }, []);

  // Animated spotlight beams cycling through trophies
  useTick((ticker) => {
    spotlightRef.current += ticker.deltaTime * 0.015;
    const sg = spotGfxRef.current;
    if (!sg) return;
    sg.clear();

    const t = spotlightRef.current;
    // Each trophy gets a pulsing spotlight
    for (let i = 0; i < PROJECTS.length; i++) {
      const px = PEDESTALS[i].x;
      const py = PEDESTALS[i].y;
      const phase = t + i * 1.3;
      const intensity = 0.15 + Math.sin(phase) * 0.12;

      // Spotlight beam from above
      sg.moveTo(px - 3, py - 30);
      sg.lineTo(px - 10, py - 70);
      sg.lineTo(px + 10, py - 70);
      sg.lineTo(px + 3, py - 30);
      sg.closePath();
      sg.fill({ color: PROJECTS[i].color, alpha: intensity });

      // Ground glow under pedestal
      sg.ellipse(px, py + 18, 12, 5);
      sg.fill({ color: PROJECTS[i].color, alpha: intensity * 0.5 });
    }
  });

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: "hall-of-fame" });
      dispatch({ type: "MARK_EXPLORED", id: "hall-of-fame" });
    },
    [dispatch],
  );

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: "hall-of-fame" });
  }, [dispatch]);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: null });
  }, [dispatch]);

  const titleStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 56,
    fill: "#ffd700",
    align: "left",
  });

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 11,
    fill: "#ffd700",
    align: "center",
  });

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <DistrictTerritoryBorder hw={hw} hh={hh} color={0xffd700} hovered={hoveredDistrict === "hall-of-fame"} />

      <pixiGraphics
        draw={drawMuseum}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Animated spotlight beams */}
      <pixiGraphics ref={spotGfxRef as React.RefObject<never>} draw={() => {}} />

      {/* Project name labels under each pedestal */}
      {PROJECTS.map((proj, i) => (
        <pixiText
          key={proj.name}
          text={proj.name}
          style={new TextStyle({
            ...labelStyle,
            fill: `#${proj.color.toString(16).padStart(6, "0")}`,
          })}
          anchor={0.5}
          x={PEDESTALS[i].x}
          y={PEDESTALS[i].y + 26}
        />
      ))}

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
