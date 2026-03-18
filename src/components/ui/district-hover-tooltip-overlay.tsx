"use client";

import { useEffect, useRef, useState } from "react";
import { useAtlasState } from "@/src/stores/atlas-store";
import { DISTRICT_MAP } from "@/src/data/district-metadata";

/** Floating tooltip that appears when hovering a district on the canvas */
export function DistrictHoverTooltipOverlay() {
  const { hoveredDistrict, cameraState } = useAtlasState();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Track mouse position
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (!hoveredDistrict || cameraState === "focused") return null;

  const meta = DISTRICT_MAP.get(hoveredDistrict);
  if (!meta) return null;

  // Position tooltip offset from cursor, clamped to viewport
  const tooltipW = 260;
  const tooltipH = 100;
  let tx = mousePos.x + 16;
  let ty = mousePos.y - tooltipH - 8;
  if (tx + tooltipW > window.innerWidth - 12) tx = mousePos.x - tooltipW - 16;
  if (ty < 12) ty = mousePos.y + 20;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-40 pointer-events-none"
      style={{
        left: tx,
        top: ty,
        width: tooltipW,
        transition: "opacity 0.15s ease",
      }}
    >
      <div
        className="rounded-md px-4 py-3 font-mono text-[11px]"
        style={{
          background: "rgba(8, 12, 24, 0.92)",
          border: `1px solid ${meta.color}55`,
          boxShadow: `0 0 20px ${meta.color}22, inset 0 0 12px ${meta.color}08`,
          backdropFilter: "blur(8px)",
        }}
      >
        {/* District name */}
        <div
          className="font-pixel text-[14px] tracking-[2px] mb-1"
          style={{ color: meta.color }}
        >
          {meta.name}
        </div>

        {/* Pillar tag */}
        <div
          className="inline-block rounded-sm px-2 py-[1px] mb-2 text-[9px] tracking-[1px] font-medium uppercase"
          style={{
            background: `${meta.color}18`,
            color: meta.accentColor,
            border: `1px solid ${meta.color}33`,
          }}
        >
          {meta.pillar}
        </div>

        {/* Description */}
        <div className="text-[var(--text-muted)] leading-[1.4]">
          {meta.description}
        </div>

        {/* Click hint */}
        <div
          className="mt-2 text-[9px] tracking-[1px] uppercase"
          style={{ color: `${meta.color}88` }}
        >
          Click to explore
        </div>
      </div>
    </div>
  );
}
