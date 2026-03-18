"use client";

/** Fiber Highway district panel content — speed network layer */
export function InfoPanelContentFiberHighway() {
  const bars = [
    { label: "Shelby", value: "<200ms", width: "100%", color: "var(--cyan)" },
    { label: "IPFS", value: "2-5s", width: "55%", color: "#ff9f1c" },
    { label: "Arweave", value: "5-15s", width: "25%", color: "#7a8599" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="mr-10">
        <h2
          className="font-pixel text-[22px] tracking-[2px] mb-1"
          style={{ color: "var(--fiber)" }}
        >
          FIBER HIGHWAY
        </h2>
        <p
          className="font-mono text-[13px] font-medium tracking-[1.5px]"
          style={{ color: "var(--fiber)", opacity: 0.6 }}
        >
          Speed Network
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

      {/* Description */}
      <p className="font-body text-[14px] text-[var(--text-primary)] leading-[1.5]">
        High-speed data transmission layer eliminating legacy retrieval
        bottlenecks across the network.
      </p>

      {/* Stats — 3 cards */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)] tracking-[2px]">
          LIVE METRICS
        </span>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "12ms", label: "Latency" },
            { value: "125×", label: "Improvement" },
            { value: "10 Gbps", label: "Throughput" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 rounded-[8px] px-3 py-3"
              style={{ background: "var(--bg-surface)" }}
            >
              <span className="font-mono text-[18px] font-bold text-[var(--cyan)]">
                {s.value}
              </span>
              <span className="font-body text-[11px] font-medium text-[var(--text-muted)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Speed bar chart */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)] tracking-[2px]">
          SPEED COMPARISON
        </span>
        <div className="flex flex-col gap-3">
          {bars.map((bar) => (
            <div key={bar.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] text-[var(--text-primary)]">
                  {bar.label}
                </span>
                <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)]">
                  {bar.value}
                </span>
              </div>
              <div
                className="h-2 rounded-full"
                style={{ background: "var(--bg-card)", width: "100%" }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{ background: bar.color, width: bar.width }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div
          className="rounded-[8px] px-4 py-3 text-center"
          style={{ background: "rgba(0,240,255,0.1)" }}
        >
          <span className="font-mono text-[12px] font-bold text-[var(--cyan)] tracking-[1px]">
            125× FASTER
          </span>
        </div>
      </div>
    </div>
  );
}
