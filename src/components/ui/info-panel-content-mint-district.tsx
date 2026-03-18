"use client";

/** Mint district panel content — on-chain monetization models */

const MODELS = [
  {
    icon: "💳",
    title: "Pay-Per-View",
    desc: "Charge per content access with micro-payments.",
    accent: "#4FC1E9",
    bg: "rgba(79,193,233,0.08)",
    border: "rgba(79,193,233,0.12)",
  },
  {
    icon: "💰",
    title: "Tipping",
    desc: "Accept on-chain tips from your audience.",
    accent: "#ffd700",
    bg: "rgba(255,215,0,0.06)",
    border: "rgba(255,215,0,0.12)",
  },
  {
    icon: "🔄",
    title: "Subscriptions",
    desc: "Recurring payments for gated content access.",
    accent: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.12)",
  },
  {
    icon: "🔑",
    title: "Token Gate",
    desc: "Restrict access to NFT or token holders only.",
    accent: "#22D3EE",
    bg: "rgba(34,211,238,0.06)",
    border: "rgba(34,211,238,0.12)",
  },
  {
    icon: "🔒",
    title: "DRM Protection",
    desc: "Protocol-level rights management for content.",
    accent: "#ff3355",
    bg: "rgba(255,51,85,0.06)",
    border: "rgba(255,51,85,0.12)",
  },
];

const USE_CASES = [
  "Creator launches a token-gated music album with pay-per-track",
  "Live streamer receives tips in real-time via on-chain micro-payments",
  "Newsletter publisher offers tiered subscriptions with DRM-protected PDFs",
];

export function InfoPanelContentMintDistrict() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="mr-10">
        <h2
          className="font-pixel text-[20px] tracking-[2px] mb-1"
          style={{ color: "#ffd700" }}
        >
          THE MINT
        </h2>
        <p
          className="font-body text-[14px] font-medium"
          style={{ color: "rgba(255,215,0,0.7)" }}
        >
          On-Chain Monetization
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

      {/* Monetization Models */}
      <div className="flex flex-col gap-3">
        <span
          className="font-pixel text-[9px] font-bold tracking-[2px]"
          style={{ color: "#ffd700" }}
        >
          MONETIZATION MODELS
        </span>
        <div className="flex flex-col gap-3">
          {MODELS.map((m) => (
            <div
              key={m.title}
              className="flex items-center gap-3 rounded-[8px] px-3.5 py-3"
              style={{
                background: m.bg,
                border: `1px solid ${m.border}`,
              }}
            >
              <span className="text-[20px] leading-none flex-shrink-0">
                {m.icon}
              </span>
              <div className="flex flex-col gap-0.5">
                <span
                  className="font-body text-[13px] font-semibold"
                  style={{ color: m.accent }}
                >
                  {m.title}
                </span>
                <span className="font-body text-[11px] text-[var(--text-muted)]">
                  {m.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="flex flex-col gap-3">
        <span
          className="font-pixel text-[9px] font-bold tracking-[2px]"
          style={{ color: "#ffd700" }}
        >
          EXAMPLE USE CASES
        </span>
        <div className="flex flex-col gap-2.5">
          {USE_CASES.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <div
                className="w-1 h-1 rounded-[2px] mt-1.5 flex-shrink-0"
                style={{ background: "#ffd700" }}
              />
              <span className="font-body text-[12px] text-[var(--text-primary)] leading-[1.5]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
