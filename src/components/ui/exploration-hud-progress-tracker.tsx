"use client";

import { useAtlasState } from "@/src/stores/atlas-store";
import { DISTRICTS } from "@/src/data/district-metadata";

/** Fixed HUD bar — districts explored count + diamond indicators, top-right */
export function ExplorationHudProgressTracker() {
  const { exploredDistricts } = useAtlasState();
  const total = DISTRICTS.length;
  const count = exploredDistricts.length;

  return (
    <div className="fixed top-[72px] right-8 z-20 flex items-center justify-between w-[348px] h-[44px] rounded-[8px] bg-[var(--bg-card)] px-4 gap-3">
      {/* Progress label */}
      <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] tracking-[2px] whitespace-nowrap">
        {count}/{total} DISTRICTS EXPLORED
      </span>

      {/* Diamond indicators */}
      <div className="flex items-center gap-2">
        {DISTRICTS.map((d) => {
          const explored = exploredDistricts.includes(d.id);
          return (
            <div
              key={d.id}
              title={d.name}
              className="w-[10px] h-[10px] rotate-45 flex-shrink-0 transition-all duration-300"
              style={{
                background: explored ? "var(--cyan)" : "#475569",
                boxShadow: explored ? "0 0 6px rgba(0,240,255,0.6)" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
