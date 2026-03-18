"use client";

/** Furnace district panel content — hot storage core */
export function InfoPanelContentFurnace() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="mr-10">
        <h2
          className="font-pixel text-[22px] tracking-[2px] mb-1"
          style={{ color: "var(--furnace)" }}
        >
          THE FURNACE
        </h2>
        <p
          className="font-mono text-[13px] font-medium tracking-[1.5px]"
          style={{ color: "#ff9a5c" }}
        >
          Hot Storage Core
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
        Where blobs are forged, encoded, and validated before propagating
        across the Shelby network.
      </p>

      {/* Live Metrics */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)] tracking-[2px]">
          LIVE METRICS
        </span>
        {/* 2-column row */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="flex flex-col gap-1 rounded-[8px] px-4 py-3"
            style={{ background: "var(--bg-surface)" }}
          >
            <span className="font-mono text-[20px] font-bold text-[var(--cyan)]">
              42,069
            </span>
            <span className="font-body text-[11px] font-medium text-[var(--text-muted)]">
              Active Blobs
            </span>
          </div>
          <div
            className="flex flex-col gap-1 rounded-[8px] px-4 py-3"
            style={{ background: "var(--bg-surface)" }}
          >
            <span className="font-mono text-[20px] font-bold text-[var(--cyan)]">
              16
            </span>
            <span className="font-body text-[11px] font-medium text-[var(--text-muted)]">
              Providers
            </span>
          </div>
        </div>
        {/* Full-width row */}
        <div
          className="flex flex-col gap-1 rounded-[8px] px-4 py-3"
          style={{ background: "var(--bg-surface)" }}
        >
          <span className="font-mono text-[20px] font-bold text-[var(--cyan)]">
            ~10 TiB
          </span>
          <span className="font-body text-[11px] font-medium text-[var(--text-muted)]">
            Capacity
          </span>
        </div>
      </div>

      {/* Comparison table */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)] tracking-[2px]">
          COMPARISON
        </span>
        <div
          className="rounded-[8px] overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-3 px-3.5 py-2.5"
            style={{ background: "var(--bg-card)" }}
          >
            <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)]">
              Feature
            </span>
            <span
              className="font-mono text-[10px] font-semibold"
              style={{ color: "var(--furnace)" }}
            >
              Hot (Shelby)
            </span>
            <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)]">
              Cold (Filecoin)
            </span>
          </div>
          {/* Rows */}
          {[
            { feature: "Latency", hot: "<200ms", cold: "~minutes" },
            { feature: "Retrieval", hot: "Instant", cold: "Unsealing" },
            { feature: "Use Case", hot: "Real-time", cold: "Archival" },
          ].map((row) => (
            <div
              key={row.feature}
              className="grid grid-cols-3 px-3.5 py-2 border-t"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <span className="font-body text-[11px] text-[var(--text-primary)]">
                {row.feature}
              </span>
              <span className="font-mono text-[11px] font-semibold text-[var(--cyan)]">
                {row.hot}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {row.cold}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {[
          { icon: "📄", label: "Docs", href: "https://docs.shelby.xyz" },
          { icon: "🔍", label: "Explorer", href: "https://explorer.shelby.xyz" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-[6px] px-3.5 py-2.5 no-underline transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-surface)" }}
          >
            <span>{link.icon}</span>
            <span className="font-mono text-[11px] font-medium text-[var(--cyan)]">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
