"use client";

import { useCallback } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import { toScreen, DISTRICT_SIZE } from "@/src/utils/isometric-helpers";
import { useAtlasState, useAtlasDispatch } from "@/src/stores/atlas-store";
import { DISTRICT_MAP } from "@/src/data/district-metadata";
import { DataPacketFiberEntity } from "@/src/components/entities/data-packet-fiber-entity";
import { SnailLegacyLaneEntity } from "@/src/components/entities/snail-legacy-lane-entity";
import { DistrictTerritoryBorder } from "@/src/components/effects/district-territory-border";

extend({ Graphics, Container, Text });

const hw = DISTRICT_SIZE.w / 2; // 192
const hh = DISTRICT_SIZE.h / 2; // 96

// Highway fits within bw=232 → lane half-width 90px is safe
const LANE_HW = 90; // half-width of highway in iso-space
const LANE_ISO_H = 30; // iso depth of highway surface

// Packet animation config
const PACKET_SPEEDS = [80, 90, 70, 85, 75];
const PACKET_COLORS = [0x00e5ff, 0x18ffff, 0x00bcd4, 0x80deea, 0x00acc1];
const PACKET_LABELS = ["2ms", "3ms", "2ms", "1ms", "3ms"];

/** Fiber Highway — multi-lane isometric road with toll gate, speed signs, fast & slow lanes */
export function FiberHighwayDistrict() {
  const dispatch = useAtlasDispatch();
  const { hoveredDistrict } = useAtlasState();
  const district = DISTRICT_MAP.get("fiber-highway")!;
  const pos = toScreen(district.gridPosition.col, district.gridPosition.row);

  const drawHighway = useCallback(
    (g: Graphics) => {
      g.clear();

      // Ground shadow
      g.ellipse(0, 12, 90, 36);
      g.fill({ color: 0x000000, alpha: 0.3 });

      // ============================================================
      // Highway surface — isometric parallelogram running left→right
      // Top-left corner at iso coords (-LANE_HW, -LANE_ISO_H/2)
      // ============================================================

      // Fast lane (cyan) — upper strip
      const flY = -28;
      g.moveTo(-LANE_HW, flY - LANE_ISO_H / 2);
      g.lineTo(LANE_HW, flY - LANE_ISO_H / 2 - 8);
      g.lineTo(LANE_HW, flY + LANE_ISO_H / 2 - 8);
      g.lineTo(-LANE_HW, flY + LANE_ISO_H / 2);
      g.closePath();
      g.fill({ color: 0x003040, alpha: 0.95 });
      g.stroke({ width: 2, color: 0x00e5ff, alpha: 0.9 });

      // Fast lane center glow stripe
      const glY = flY;
      g.moveTo(-LANE_HW + 10, glY - 2);
      g.lineTo(LANE_HW - 10, glY - 10);
      g.lineTo(LANE_HW - 10, glY - 8);
      g.lineTo(-LANE_HW + 10, glY);
      g.closePath();
      g.fill({ color: 0x00e5ff, alpha: 0.25 });

      // Mid divider stripe
      const divY = flY + LANE_ISO_H / 2 + 2;
      g.moveTo(-LANE_HW, divY);
      g.lineTo(LANE_HW, divY - 8);
      g.stroke({ width: 2, color: 0xffff00, alpha: 0.6 });

      // Slow lane (gray) — lower strip
      const slY = flY + LANE_ISO_H + 10;
      g.moveTo(-LANE_HW, slY - LANE_ISO_H / 2);
      g.lineTo(LANE_HW, slY - LANE_ISO_H / 2 - 8);
      g.lineTo(LANE_HW, slY + LANE_ISO_H / 2 - 8);
      g.lineTo(-LANE_HW, slY + LANE_ISO_H / 2);
      g.closePath();
      g.fill({ color: 0x1a1a1a, alpha: 0.95 });
      g.stroke({ width: 2, color: 0x555555, alpha: 0.7 });

      // Dashed center line in slow lane
      for (let d = 0; d < 5; d++) {
        const dx = -60 + d * 28;
        const ddY = slY - 2 - d * 1.5;
        g.moveTo(dx, ddY);
        g.lineTo(dx + 16, ddY - 2.5);
        g.stroke({ width: 1.5, color: 0x888888, alpha: 0.5 });
      }

      // ============================================================
      // Toll gate at right end
      // ============================================================
      const gateX = LANE_HW - 4;
      const gateTopY = flY - LANE_ISO_H / 2 - 8;

      // Left post
      g.moveTo(gateX - 6, gateTopY);
      g.lineTo(gateX - 6, gateTopY - 32);
      g.lineTo(gateX - 2, gateTopY - 32);
      g.lineTo(gateX - 2, gateTopY);
      g.closePath();
      g.fill({ color: 0x1a2a3a, alpha: 1 });
      g.stroke({ width: 1, color: 0x00e5ff, alpha: 0.8 });

      // Right post
      g.moveTo(gateX + 2, gateTopY - 12);
      g.lineTo(gateX + 2, gateTopY - 44);
      g.lineTo(gateX + 6, gateTopY - 44);
      g.lineTo(gateX + 6, gateTopY - 12);
      g.closePath();
      g.fill({ color: 0x1a2a3a, alpha: 1 });
      g.stroke({ width: 1, color: 0x00e5ff, alpha: 0.8 });

      // Gate beam (horizontal bar across both lanes)
      g.moveTo(gateX - 6, gateTopY - 32);
      g.lineTo(gateX + 6, gateTopY - 44);
      g.stroke({ width: 4, color: 0xff5722, alpha: 0.9 });

      // Gate warning light
      g.circle(gateX, gateTopY - 38, 4);
      g.fill({ color: 0xff5722, alpha: 1 });

      // ============================================================
      // Speed signs on the left side
      // ============================================================
      const signX = -LANE_HW - 18;

      // Fast lane sign
      g.rect(signX, flY - 18, 20, 14);
      g.fill({ color: 0x001a22, alpha: 1 });
      g.stroke({ width: 1.5, color: 0x00e5ff, alpha: 0.9 });

      // Slow lane sign
      g.rect(signX, slY - 14, 20, 14);
      g.fill({ color: 0x111111, alpha: 1 });
      g.stroke({ width: 1.5, color: 0x555555, alpha: 0.7 });

      // Sign poles
      g.moveTo(signX + 10, flY - 4);
      g.lineTo(signX + 10, flY + 10);
      g.stroke({ width: 1.5, color: 0x00e5ff, alpha: 0.5 });

      g.moveTo(signX + 10, slY);
      g.lineTo(signX + 10, slY + 10);
      g.stroke({ width: 1.5, color: 0x555555, alpha: 0.5 });
    },
    [],
  );

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: "fiber-highway" });
      dispatch({ type: "MARK_EXPLORED", id: "fiber-highway" });
    },
    [dispatch],
  );

  const handlePointerEnter = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: "fiber-highway" });
  }, [dispatch]);

  const handlePointerLeave = useCallback(() => {
    dispatch({ type: "SET_HOVERED_DISTRICT", id: null });
  }, [dispatch]);

  const shelbyLabelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 16,
    fill: "#00e5ff",
  });
  const legacyLabelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 16,
    fill: "#888888",
  });
  const signLabelFast = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 12,
    fill: "#00e5ff",
  });
  const signLabelSlow = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 12,
    fill: "#888888",
  });
  const titleStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 56,
    fill: "#00e5ff",
    align: "left",
  });

  // Lane world coords for entity positioning
  const LANE_W = LANE_HW * 2; // 180
  const fastLaneY = -28;
  const slowLaneY = fastLaneY + LANE_ISO_H + 10;

  return (
    <pixiContainer x={pos.x} y={pos.y}>
      <DistrictTerritoryBorder hw={hw} hh={hh} color={0x18ffff} hovered={hoveredDistrict === "fiber-highway"} />

      <pixiGraphics
        draw={drawHighway}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Lane labels */}
      <pixiText
        text="SHELBY EXPRESS"
        style={shelbyLabelStyle}
        anchor={{ x: 0.5, y: 1 }}
        x={0}
        y={fastLaneY - 18}
      />
      <pixiText
        text="LEGACY LANE"
        style={legacyLabelStyle}
        anchor={{ x: 0.5, y: 1 }}
        x={0}
        y={slowLaneY - 14}
      />

      {/* Speed sign labels */}
      <pixiText
        text="10G"
        style={signLabelFast}
        anchor={{ x: 0.5, y: 0.5 }}
        x={-LANE_HW - 8}
        y={fastLaneY - 11}
      />
      <pixiText
        text="1M"
        style={signLabelSlow}
        anchor={{ x: 0.5, y: 0.5 }}
        x={-LANE_HW - 8}
        y={slowLaneY - 7}
      />

      {/* Fast lane data packets */}
      {PACKET_SPEEDS.map((speed, i) => (
        <DataPacketFiberEntity
          key={i}
          startX={-LANE_HW + 10}
          endX={LANE_HW - 20}
          y={fastLaneY - 4 + (i % 2) * 6}
          speed={speed}
          color={PACKET_COLORS[i]}
          label={PACKET_LABELS[i]}
        />
      ))}

      {/* Slow lane legacy entity */}
      <SnailLegacyLaneEntity
        startX={-LANE_HW + 10}
        endX={LANE_HW - 20}
        y={slowLaneY + 4}
      />

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
