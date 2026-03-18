"use client";

/** Docks district panel content — cross-chain harbor and chain status */

const CHAINS = [
  {
    id: "aptos",
    name: "Aptos",
    color: "#4FC1E9",
    bg: "rgba(79,193,233,0.06)",
    border: "rgba(79,193,233,0.18)",
    status: "DOCKED",
    statusBg: "rgba(79,193,233,0.12)",
    detailed: true,
    stats: [
      { label: "finality", value: "< 1s" },
      { label: "TPS", value: "160K" },
      { label: "gas", value: "$0.001" },
    ],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.06)",
    border: "rgba(168,85,247,0.12)",
    status: "APPROACHING",
    statusBg: "rgba(168,85,247,0.12)",
    detailed: false,
  },
  {
    id: "solana",
    name: "Solana",
    color: "#14f195",
    bg: "rgba(20,241,149,0.06)",
    border: "rgba(20,241,149,0.12)",
    status: "PLANNED",
    statusBg: "rgba(20,241,149,0.10)",
    detailed: false,
  },
  {
    id: "cosmos",
    name: "Cosmos",
    color: "rgba(255,255,255,0.38)",
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.08)",
    status: "EXPLORING",
    statusBg: "rgba(255,255,255,0.06)",
    dotColor: "rgba(255,255,255,0.38)",
    nameColor: "rgba(255,255,255,0.56)",
    detailed: false,
  },
];

export function InfoPanelContentDocksDistrict() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="mr-10">
        <h2
          className="font-pixel text-[22px] tracking-[2px] mb-1"
          style={{ color: "#4FC1E9" }}
        >
          THE DOCKS
        </h2>
        <p
          className="font-body text-[15px] font-medium"
          style={{ color: "rgba(79,193,233,0.67)" }}
        >
          Cross-Chain Harbor
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

      {/* Chain status */}
      <div className="flex flex-col gap-3">
        <span
          className="font-pixel text-[9px] font-bold tracking-[2px]"
          style={{ color: "#4FC1E9" }}
        >
          CHAIN STATUS
        </span>

        <div className="flex flex-col gap-3">
          {CHAINS.map((chain) => (
            <div
              key={chain.id}
              className="rounded-[8px] px-4 py-3.5"
              style={{
                background: chain.bg,
                border: `1px solid ${chain.border}`,
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: chain.dotColor ?? chain.color }}
                  />
                  <span
                    className="font-body text-[14px] font-semibold"
                    style={{ color: chain.nameColor ?? chain.color }}
                  >
                    {chain.name}
                  </span>
                </div>
                <span
                  className="font-pixel text-[7px] rounded-full px-2.5 py-1"
                  style={{
                    color: chain.nameColor ?? chain.color,
                    background: chain.statusBg,
                  }}
                >
                  {chain.status}
                </span>
              </div>

              {/* Aptos detailed stats */}
              {chain.detailed && chain.stats && (
                <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: `1px solid ${chain.border}` }}>
                  {chain.stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-0.5">
                      <span
                        className="font-mono text-[12px] font-bold"
                        style={{ color: chain.color }}
                      >
                        {s.value}
                      </span>
                      <span className="font-body text-[10px] text-[var(--text-muted)]">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
