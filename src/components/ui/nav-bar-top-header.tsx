"use client";

import { useEffect, useState } from "react";
import { ShuffleTextContinuous } from "./shuffle-text-continuous-animation";
import { AptosWalletConnectButton } from "./aptos-wallet-connect-button";

/** Robot faces that cycle every 3 seconds */
const ROBOT_FACES = ["(◕‿◕)", "(⊙_⊙)", "(≧▽≦)", "(╥﹏╥)", "(◉‿◉)", "(¬‿¬)", "(⊙ω⊙)", "(◕ᴗ◕)"];

/** Top navigation bar — 56px fixed header matching Pencil design spec */
export function NavBarTopHeader() {
  const [faceIdx, setFaceIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFaceIdx((i) => (i + 1) % ROBOT_FACES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { label: "DOCS", href: "https://docs.shelby.xyz" },
    { label: "EXPLORER", href: "https://explorer.shelby.xyz" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between h-[56px] px-8 bg-[var(--bg-deep)]">
      {/* Brand: cyan square + title */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-[14px] flex-shrink-0 select-none transition-all duration-300"
          style={{
            color: "var(--cyan)",
            textShadow: "0 0 8px #00f0ff66",
          }}
        >
          {ROBOT_FACES[faceIdx]}
        </span>
        <ShuffleTextContinuous
          text="SHELBY ATLAS"
          speed={30}
          pauseDuration={3000}
          className="font-pixel text-[var(--cyan)] tracking-[3px] text-[12px]"
        />
      </div>

      {/* Nav links + wallet */}
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-medium text-[var(--text-muted)] tracking-[2px] no-underline transition-colors duration-200 hover:text-[var(--cyan)]"
          >
            {link.label}
          </a>
        ))}
        <AptosWalletConnectButton />
      </div>
    </nav>
  );
}
