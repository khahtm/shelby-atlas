"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAtlasState, useAtlasDispatch } from "@/src/stores/atlas-store";

/** Map each district id to its scene image path */
const DISTRICT_SCENES: Record<string, string> = {
  furnace: "/scenes/furnace-scene.webp",
  "fiber-highway": "/scenes/fiber-highway-scene.webp",
  mint: "/scenes/mint-scene.webp",
  watchtower: "/scenes/watchtower-scene.webp",
  docks: "/scenes/docks-scene.webp",
  workshop: "/scenes/workshop-scene.webp",
};

/** District display names */
const DISTRICT_LABELS: Record<string, string> = {
  furnace: "Furnace",
  "fiber-highway": "Fiber Highway",
  mint: "Mint",
  watchtower: "Watchtower",
  docks: "Docks",
  workshop: "Workshop",
};

interface Hotspot {
  id: string;
  top: string;
  left: string;
}

/** Approximate % positions over world-overview.webp */
const HOTSPOTS: Hotspot[] = [
  { id: "workshop",      top: "17%", left: "42%" },
  { id: "furnace",       top: "28%", left: "42%" },
  { id: "fiber-highway", top: "35%", left: "62%" },
  { id: "mint",          top: "42%", left: "22%" },
  { id: "watchtower",    top: "55%", left: "58%" },
  { id: "docks",         top: "68%", left: "38%" },
];

/** Images to preload for smooth transitions */
const PRELOAD_IMAGES = [
  "/scenes/world-overview.webp",
  ...Object.values(DISTRICT_SCENES),
];

function useImagePreload(srcs: string[]) {
  useEffect(() => {
    srcs.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [srcs]);
}

/** Single clickable hotspot over the overview map */
function DistrictHotspot({
  hotspot,
  onClick,
}: {
  hotspot: Hotspot;
  onClick: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const label = DISTRICT_LABELS[hotspot.id];

  return (
    <button
      className="absolute cursor-pointer bg-transparent border-0 p-0 group"
      style={{
        top: hotspot.top,
        left: hotspot.left,
        width: 120,
        height: 100,
        transform: "translate(-50%, -50%)",
        outline: "none",
        borderRadius: 6,
        border: hovered ? "1.5px solid var(--cyan)" : "1.5px solid transparent",
        boxShadow: hovered ? "0 0 16px #00f0ff44, inset 0 0 8px #00f0ff11" : "none",
        transition: "border 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(hotspot.id)}
      aria-label={`Enter ${label} district`}
    >
      {hovered && (
        <span
          className="absolute left-1/2 -translate-x-1/2 -bottom-7 font-mono text-[11px] font-medium text-[var(--cyan)] tracking-[1px] whitespace-nowrap pointer-events-none"
          style={{
            background: "var(--bg-card)",
            border: "1px solid #00f0ff33",
            borderRadius: 4,
            padding: "2px 8px",
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}

/** Overview: full-screen world map with district hotspots */
function OverviewView({ onDistrictClick }: { onDistrictClick: (id: string) => void }) {
  return (
    <div className="relative w-full h-full">
      {/* World overview background */}
      <Image
        src="/scenes/world-overview.webp"
        alt="Shelby Atlas world overview"
        fill
        priority
        className="object-cover object-center"
        draggable={false}
      />

      {/* Hotspot overlay container — matches image dimensions/position */}
      <div className="absolute inset-0">
        {HOTSPOTS.map((h) => (
          <DistrictHotspot key={h.id} hotspot={h} onClick={onDistrictClick} />
        ))}
      </div>

      {/* Bottom hint tooltip */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p
          className="font-mono text-[11px] font-medium text-[var(--text-muted)] tracking-[3px]"
          style={{
            background: "var(--bg-card)",
            border: "1px solid #00f0ff33",
            borderRadius: 6,
            padding: "6px 14px",
          }}
        >
          → Hover a district to explore
        </p>
      </div>

      {/* Top-left text overlay */}
      <div className="absolute top-[80px] left-8 pointer-events-none">
        <h1
          className="font-pixel text-[20px] text-[var(--cyan)]"
          style={{ textShadow: "0 0 20px #00f0ff44" }}
        >
          SHELBY ATLAS
        </h1>
        <p className="font-mono text-[10px] font-medium text-[var(--text-muted)] tracking-[3px] mt-1">
          INTERACTIVE PROTOCOL MAP
        </p>
      </div>
    </div>
  );
}

/** Focused: district scene image left, InfoPanel slides in from right */
function FocusedView({ districtId }: { districtId: string }) {
  const scene = DISTRICT_SCENES[districtId] ?? DISTRICT_SCENES["furnace"];

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 relative overflow-hidden">
        <Image
          src={scene}
          alt={`${DISTRICT_LABELS[districtId] ?? districtId} scene`}
          fill
          priority
          className="object-cover object-center"
          draggable={false}
        />
      </div>
      {/* Right space reserved: InfoPanelDistrictOverlay is fixed-right via portal */}
    </div>
  );
}

/** Root interactive world view — swaps between overview and focused layouts */
export function AtlasWorldViewInteractive() {
  const { activeDistrict } = useAtlasState();
  const dispatch = useAtlasDispatch();

  useImagePreload(PRELOAD_IMAGES);

  const handleDistrictClick = useCallback(
    (id: string) => {
      dispatch({ type: "SET_ACTIVE_DISTRICT", id });
      dispatch({ type: "MARK_EXPLORED", id });
    },
    [dispatch],
  );

  const isFocused = !!activeDistrict;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        style={{
          opacity: isFocused ? 0 : 1,
          pointerEvents: isFocused ? "none" : "auto",
          transition: "opacity 0.4s ease",
          position: "absolute",
          inset: 0,
        }}
      >
        <OverviewView onDistrictClick={handleDistrictClick} />
      </div>

      <div
        style={{
          opacity: isFocused ? 1 : 0,
          pointerEvents: isFocused ? "auto" : "none",
          transition: "opacity 0.4s ease",
          position: "absolute",
          inset: 0,
        }}
      >
        {activeDistrict && <FocusedView districtId={activeDistrict} />}
      </div>
    </div>
  );
}
