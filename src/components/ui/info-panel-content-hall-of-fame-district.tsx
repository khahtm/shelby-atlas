"use client";

const PROJECTS = [
  { name: "Project Alpha", desc: "Decentralized storage aggregator built on Shelby blob layer" },
  { name: "Project Beta", desc: "High-frequency DePIN data pipeline with sub-second reads" },
  { name: "Project Gamma", desc: "Cross-chain NFT metadata storage using Shelby's DA" },
  { name: "Project Delta", desc: "On-chain ML model registry with verifiable blob proofs" },
  { name: "Project Omega", desc: "Community governance platform with Shelby-backed voting records" },
];

/** Hall of Fame district panel — showcasing top projects */
export function InfoPanelContentHallOfFameDistrict() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="mr-10">
        <h2
          className="font-pixel text-[22px] tracking-[2px] mb-1"
          style={{ color: "#ffd700" }}
        >
          HALL OF FAME
        </h2>
        <p
          className="font-mono text-[13px] font-medium tracking-[1.5px]"
          style={{ color: "#ffe566" }}
        >
          Community Showcase
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #ffd700 40%, transparent 100%)",
        }}
      />

      {/* Description */}
      <p className="font-mono text-[12px] text-[var(--text-muted)] leading-relaxed">
        The best projects built on Shelby, recognized for innovation,
        impact, and contribution to the ecosystem.
      </p>

      {/* Project list */}
      <div className="flex flex-col gap-3">
        {PROJECTS.map((proj, i) => (
          <div
            key={proj.name}
            className="flex flex-col gap-1 rounded-md px-3 py-2"
            style={{
              background: "rgba(255, 215, 0, 0.06)",
              border: "1px solid rgba(255, 215, 0, 0.15)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="font-pixel text-[11px] tracking-[1px]"
                style={{ color: "#ffd700" }}
              >
                #{i + 1}
              </span>
              <span
                className="font-mono text-[12px] font-semibold"
                style={{ color: "#ffe566" }}
              >
                {proj.name}
              </span>
            </div>
            <p className="font-mono text-[11px] text-[var(--text-muted)] leading-snug">
              {proj.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href="https://docs.shelby.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 font-mono text-[11px] font-medium tracking-[1px] no-underline transition-colors duration-200 hover:text-[#ffd700]"
        style={{ color: "#ffe566" }}
      >
        Build on Shelby →
      </a>
    </div>
  );
}
