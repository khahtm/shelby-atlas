"use client";

interface CtaButton {
  label: string;
  href: string;
  accent: string;
}

const BUTTONS: CtaButton[] = [
  { label: "Start Building", href: "https://developers.shelby.xyz", accent: "#69f0ae" },
  { label: "Read Docs", href: "https://docs.shelby.xyz", accent: "#00e5ff" },
  { label: "Join Devnet", href: "https://faucet.shelbynet.shelby.xyz", accent: "#ff9f1c" },
];

/** Developer CTA action buttons displayed near the Workshop district */
export function CtaActionButtonsWorkshop() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      {BUTTONS.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-pixel"
          style={{
            color: btn.accent,
            border: `1px solid ${btn.accent}`,
            padding: "8px 14px",
            borderRadius: 4,
            textDecoration: "none",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            background: `${btn.accent}11`,
            transition: "filter 0.2s ease",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.filter =
              "brightness(1.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1)";
          }}
        >
          {btn.label}
        </a>
      ))}
    </div>
  );
}
