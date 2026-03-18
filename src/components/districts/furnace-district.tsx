"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import { toScreen, DISTRICT_SIZE } from "@/src/utils/isometric-helpers";
import { useAtlasState, useAtlasDispatch } from "@/src/stores/atlas-store";
import { DISTRICT_MAP } from "@/src/data/district-metadata";
import { PixelFireProcedural } from "@/src/components/effects/pixel-fire-procedural";
import { DataCubeTravelingEntity } from "@/src/components/entities/data-cube-traveling-entity";
import { DistrictTerritoryBorder } from "@/src/components/effects/district-territory-border";

extend({ Graphics, Container, Text });

const MAX_CUBES = 5;
const SPAWN_INTERVAL_MS = 2000;

interface ActiveCube {
  id: number;
  startX: number;
  startY: number;
}

/** The Furnace district — industrial forge with chimney, glowing core, conveyor */
export function FurnaceDistrict() {
  const dispatch = useAtlasDispatch();
  const { hoveredDistrict } = useAtlasState();
  const district = DISTRICT_MAP.get("furnace")!;
  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);
  const hw = DISTRICT_SIZE.w / 2;
  const hh = DISTRICT_SIZE.h / 2;

  const [cubes, setCubes] = useState<ActiveCube[]>([]);
  const cubeIdRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCubes((prev) => {
        if (prev.length >= MAX_CUBES) return prev;
        const id = ++cubeIdRef.current;
        // Cubes approach from the conveyor belt direction (right side)
        const sx = 100 + Math.random() * 40;
        const sy = 20 + Math.random() * 20;
        return [...prev, { id, startX: sx, startY: sy }];
      });
    }, SPAWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleCubeArrive = useCallback((id: number) => {
    setCubes((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const drawReactor = useCallback(
    (g: Graphics) => {
      g.clear();

      // === Ground shadow (elliptical, underneath the reactor) ===
      g.ellipse(0, 6, 90, 36);
      g.fill({ color: 0x000000, alpha: 0.35 });
      g.ellipse(0, 6, 70, 28);
      g.fill({ color: 0x000000, alpha: 0.15 });

      // === Containment base — isometric octagon-ish ===
      const r = 100; // radius of reactor body
      const cy = -28; // center Y offset (raised above platform)

      // Containment shell — left face
      g.moveTo(-r, cy);
      g.lineTo(-r, cy - r * 0.8);
      g.lineTo(0, cy - r * 1.2);
      g.lineTo(0, cy - r * 0.4);
      g.closePath();
      g.fill({ color: 0x1a1a3a, alpha: 0.95 });

      // Containment shell — right face
      g.moveTo(0, cy - r * 0.4);
      g.lineTo(0, cy - r * 1.2);
      g.lineTo(r, cy - r * 0.8);
      g.lineTo(r, cy);
      g.closePath();
      g.fill({ color: 0x222250, alpha: 0.95 });

      // Containment shell — top face
      g.moveTo(0, cy - r * 1.2);
      g.lineTo(r, cy - r * 0.8);
      g.lineTo(0, cy - r * 0.4);
      g.lineTo(-r, cy - r * 0.8);
      g.closePath();
      g.fill({ color: 0x2a2a60, alpha: 0.95 });

      // === Horizontal containment rings ===
      for (let i = 0; i < 3; i++) {
        const ry = cy - r * 0.3 - i * (r * 0.3);
        const rw = r * (0.9 - i * 0.08);
        // Ring as isometric ellipse approximation
        g.moveTo(0, ry - rw * 0.35);
        g.lineTo(rw, ry);
        g.lineTo(0, ry + rw * 0.35);
        g.lineTo(-rw, ry);
        g.closePath();
        g.stroke({ width: 2, color: 0xff6b35, alpha: 0.5 - i * 0.1 });
      }

      // === Plasma core (center, glowing) ===
      const coreY = cy - r * 0.6;
      // Outermost glow
      g.circle(0, coreY, 22);
      g.fill({ color: 0xff4400, alpha: 0.12 });
      // Mid glow
      g.circle(0, coreY, 15);
      g.fill({ color: 0xff6b00, alpha: 0.25 });
      // Inner plasma
      g.circle(0, coreY, 9);
      g.fill({ color: 0xff9900, alpha: 0.6 });
      // Hot white center
      g.circle(0, coreY, 4);
      g.fill({ color: 0xffdd44, alpha: 0.95 });

      // === Energy field lines (vertical arcs from core) ===
      const fieldColors = [0xff6b35, 0xff9f1c, 0xffcc00];
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const fx = Math.cos(angle) * r * 0.55;
        const fy = Math.sin(angle) * r * 0.25 + coreY;
        g.moveTo(0, coreY);
        g.lineTo(fx * 0.5, (coreY + fy) / 2 - 8);
        g.lineTo(fx, fy);
        g.stroke({ width: 1, color: fieldColors[i], alpha: 0.4 });
        // Field node dot
        g.circle(fx, fy, 3);
        g.fill({ color: fieldColors[i], alpha: 0.6 });
      }

      // === Exhaust pipes (left and right of base) ===
      // Left pipe
      g.moveTo(-r - 8, cy + 4);
      g.lineTo(-r - 20, cy + 12);
      g.lineTo(-r - 20, cy + 8);
      g.lineTo(-r - 8, cy);
      g.closePath();
      g.fill({ color: 0x1a1a30, alpha: 0.8 });
      g.stroke({ width: 1, color: 0xff6b35, alpha: 0.3 });
      // Right pipe
      g.moveTo(r + 8, cy + 4);
      g.lineTo(r + 20, cy + 12);
      g.lineTo(r + 20, cy + 8);
      g.lineTo(r + 8, cy);
      g.closePath();
      g.fill({ color: 0x1a1a30, alpha: 0.8 });
      g.stroke({ width: 1, color: 0xff6b35, alpha: 0.3 });

      // === Panel details on containment faces ===
      // Left face panel
      g.rect(-r * 0.7, cy - r * 0.5, 10, 16);
      g.fill({ color: 0x000000, alpha: 0.3 });
      g.stroke({ width: 1, color: 0xff6b35, alpha: 0.25 });
      // Right face panel
      g.rect(r * 0.3, cy - r * 0.55, 10, 16);
      g.fill({ color: 0x000000, alpha: 0.3 });
      g.stroke({ width: 1, color: 0xff9f1c, alpha: 0.25 });
    },
    [hw, hh],
  );

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: "furnace" });
      dispatch({ type: "MARK_EXPLORED", id: "furnace" });
    },
    [dispatch],
  );

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: "furnace" });
  }, [dispatch]);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: null });
  }, [dispatch]);

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 56,
    fill: "#ff6b35",
    align: "left",
  });

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <DistrictTerritoryBorder hw={hw} hh={hh} color={0xff9f1c} hovered={hoveredDistrict === "furnace"} />
      <pixiGraphics
        draw={drawReactor}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      {/* Plasma energy escaping from the top of the reactor */}
      <PixelFireProcedural x={0} y={-hh + 10} />
      {/* Title running outside the bottom-right edge of border diamond */}
      <pixiText
        text={district.name}
        style={labelStyle}
        anchor={{ x: 0, y: 0 }}
        x={14}
        y={hh + 20 + 8}
        rotation={Math.atan2(-(hh + 20), hw + 40)}
      />
      {/* Data cubes traveling along conveyor into the forge */}
      {cubes.map((cube) => (
        <DataCubeTravelingEntity
          key={cube.id}
          startX={cube.startX}
          startY={cube.startY}
          targetX={0}
          targetY={-20}
          onArrive={() => handleCubeArrive(cube.id)}
        />
      ))}
    </pixiContainer>
  );
}
