"use client";

/** Workshop district panel content — developer tools, SDK, CLI, and RPC API */

const TOOLS = [
  {
    icon: "⬛",
    iconColor: "#00ff88",
    name: "@shelby-protocol/cli",
    desc: "Command-line interface for uploads, queries, and devnet.",
  },
  {
    icon: "📦",
    iconColor: "var(--cyan)",
    name: "@shelby-protocol/sdk",
    desc: "TypeScript SDK with full type safety and async support.",
  },
  {
    icon: "🌐",
    iconColor: "#a855f7",
    name: "Explorer & RPC API",
    desc: "Browser explorer and REST/RPC endpoints for indexers.",
  },
];

const LINKS = [
  {
    label: "Start Building →",
    href: "https://docs.shelby.xyz/quickstart",
    variant: "primary",
  },
  {
    label: "Read Docs →",
    href: "https://docs.shelby.xyz",
    variant: "outline",
  },
  {
    label: "Join Devnet →",
    href: "https://devnet.shelby.xyz",
    variant: "outline",
  },
];

export function InfoPanelContentWorkshopDistrict() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="mr-10">
        <h2
          className="font-pixel text-[18px] tracking-[2px] mb-1"
          style={{ color: "#00ff88" }}
        >
          THE WORKSHOP
        </h2>
        <p className="font-body text-[15px] font-semibold text-[var(--text-muted)]">
          Developer Tools
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
        Everything you need to build on Shelby: SDK, CLI, devnet faucet, and
        full documentation.
      </p>

      {/* Available tools */}
      <div className="flex flex-col gap-3">
        <span className="font-pixel text-[10px] text-[var(--text-muted)] tracking-[2px]">
          AVAILABLE TOOLS
        </span>
        <div className="flex flex-col gap-2">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center gap-3 rounded-[2px] px-3 py-2.5"
              style={{ background: "var(--bg-card)" }}
            >
              <span
                className="text-[20px] leading-none flex-shrink-0"
                style={{ color: tool.iconColor }}
              >
                {tool.icon}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-mono text-[12px] font-semibold text-[var(--text-primary)] truncate">
                  {tool.name}
                </span>
                <span className="font-body text-[12px] text-[var(--text-muted)]">
                  {tool.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center rounded-[2px] px-6 py-3 font-pixel text-[12px] no-underline transition-opacity hover:opacity-85"
            style={
              link.variant === "primary"
                ? {
                    background: "var(--cyan)",
                    color: "var(--bg-deep)",
                  }
                : {
                    border: "1px solid var(--cyan)",
                    color: "var(--cyan)",
                    background: "transparent",
                  }
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
