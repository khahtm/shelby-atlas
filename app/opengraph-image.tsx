import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Shelby Atlas — Explore the Protocol City";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0e1a 0%, #0d1628 50%, #0a1520 100%)",
          fontFamily: "monospace",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #00f0ff, transparent)",
          }}
        />

        {/* Main title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Hexagon icon */}
          <div
            style={{
              width: 60,
              height: 60,
              background: "#00f0ff",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "#00f0ff",
              letterSpacing: 8,
            }}
          >
            SHELBY ATLAS
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            letterSpacing: 4,
            marginBottom: 40,
          }}
        >
          EXPLORE THE PROTOCOL CITY
        </div>

        {/* District pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
          }}
        >
          {[
            { name: "The Furnace", color: "#ff6b35" },
            { name: "Fiber Highway", color: "#00e5ff" },
            { name: "The Mint", color: "#76ff03" },
            { name: "Watchtower", color: "#e040fb" },
            { name: "The Docks", color: "#ffab00" },
            { name: "Workshop", color: "#69f0ae" },
            { name: "Hall of Fame", color: "#ffd700" },
          ].map((d) => (
            <div
              key={d.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 6,
                border: `1px solid ${d.color}44`,
                background: `${d.color}15`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: d.color,
                }}
              />
              <span style={{ fontSize: 16, color: d.color, letterSpacing: 2 }}>
                {d.name.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 16,
            color: "#475569",
            letterSpacing: 3,
          }}
        >
          <span>BUILT ON</span>
          <span style={{ color: "#4fc1e9" }}>APTOS</span>
          <span>•</span>
          <span>CONNECT WALLET</span>
          <span>•</span>
          <span>DISCOVER THE ECOSYSTEM</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
