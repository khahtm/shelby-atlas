"use client";

import { useAtlasDispatch } from "@/src/stores/atlas-store";
import { useCallback } from "react";

/** Watchtower district panel content — data integrity and erasure coding */
export function InfoPanelContentWatchtowerDistrict() {
  const dispatch = useAtlasDispatch();

  const handleBreakNode = useCallback(() => {
    // Dispatch visual feedback — could trigger simulation in future
    dispatch({ type: "MARK_EXPLORED", id: "watchtower-node-break" });
  }, [dispatch]);

  const stats = [
    { value: "6x", label: "redundancy", color: "var(--cyan)" },
    { value: "Clay", label: "erasure coding", color: "var(--cyan)" },
    { value: "99.99%", label: "data integrity", color: "#00ff88" },
    { value: "2/6", label: "fault tolerance", color: "#00ff88" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="mr-10">
        <h2
          className="font-pixel text-[20px] tracking-[2px] mb-1"
          style={{ color: "var(--cyan)" }}
        >
          THE WATCHTOWER
        </h2>
        <p className="font-mono text-[13px] font-medium text-[var(--text-muted)] tracking-[1.5px]">
          Data Integrity
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--cyan) 40%, transparent 100%)",
        }}
      />

      {/* Stats 2×2 grid */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)] tracking-[2px]">
          LIVE METRICS
        </span>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 rounded-[8px] px-4 py-3"
              style={{ background: "var(--bg-surface)" }}
            >
              <span
                className="font-mono text-[20px] font-bold"
                style={{ color: s.color }}
              >
                {s.value}
              </span>
              <span className="font-body text-[11px] font-medium text-[var(--text-muted)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fault tolerance info box */}
      <div
        className="flex flex-col gap-2 rounded-[8px] p-4"
        style={{
          background: "rgba(0,255,136,0.06)",
          border: "1px solid rgba(0,255,136,0.18)",
        }}
      >
        <span
          className="font-mono text-[11px] font-bold tracking-[1px]"
          style={{ color: "#00ff88" }}
        >
          ✓ FAULT TOLERANT
        </span>
        <p className="font-body text-[12px] text-[var(--text-primary)] leading-[1.4] m-0">
          Data survives even when 2 out of 6 guard nodes go offline or are
          compromised. No single point of failure.
        </p>
      </div>

      {/* Break a node button */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleBreakNode}
          className="w-full flex items-center justify-center gap-2 rounded-[6px] px-5 py-3.5 cursor-pointer border-0 transition-opacity hover:opacity-85"
          style={{ background: "#ff3355" }}
        >
          <span className="text-[16px]">💥</span>
          <span
            className="font-pixel text-[11px] font-bold tracking-[1px]"
            style={{ color: "var(--bg-deep)" }}
          >
            BREAK A NODE
          </span>
        </button>
        <p className="font-body text-[11px] text-[var(--text-muted)] text-center m-0">
          Simulate a node attack to see erasure coding in action
        </p>
      </div>
    </div>
  );
}
