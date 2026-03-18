"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

/** Real Aptos wallet connect button with teaser modal after connection */
export function AptosWalletConnectButton() {
  const { connected, account, wallets, connect, disconnect } = useWallet();
  const [showTeaser, setShowTeaser] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const addrStr = account?.address?.toString() ?? "";
  const shortAddr = addrStr
    ? `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`
    : "";

  const handleWalletClick = useCallback(() => {
    if (connected) {
      setShowTeaser(true);
    } else {
      setShowDropdown((v) => !v);
    }
  }, [connected]);

  const handleSelectWallet = useCallback(
    (walletName: string) => {
      connect(walletName);
      setShowDropdown(false);
    },
    [connect],
  );

  const handleDisconnect = useCallback(() => {
    disconnect();
    setShowTeaser(false);
  }, [disconnect]);

  return (
    <div className="relative">
      {/* Connect / Wallet button */}
      <button
        onClick={handleWalletClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded font-mono text-[11px] tracking-[1px] cursor-pointer border-0 transition-all duration-200"
        style={{
          background: connected ? "rgba(79, 193, 233, 0.1)" : "rgba(79, 193, 233, 0.15)",
          color: "#4fc1e9",
          border: `1px solid ${connected ? "rgba(79, 193, 233, 0.3)" : "rgba(79, 193, 233, 0.4)"}`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79, 193, 233, 0.25)"; }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = connected ? "rgba(79, 193, 233, 0.1)" : "rgba(79, 193, 233, 0.15)";
        }}
      >
        {connected ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            <span>{shortAddr}</span>
          </>
        ) : (
          <span>CONNECT WALLET</span>
        )}
      </button>

      {/* Wallet selection dropdown */}
      {showDropdown && !connected && (
        <div
          className="absolute top-full right-0 mt-2 rounded-lg overflow-hidden font-mono text-[11px] min-w-[220px]"
          style={{
            background: "rgba(10, 14, 26, 0.95)",
            border: "1px solid rgba(79, 193, 233, 0.25)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="px-3 py-2 text-[9px] tracking-[2px] uppercase" style={{ color: "rgba(79, 193, 233, 0.5)" }}>
            SELECT WALLET
          </div>
          {wallets.length === 0 && (
            <div className="px-3 py-3 text-[var(--text-muted)]">
              No wallets detected. Install Petra or another Aptos wallet.
            </div>
          )}
          {wallets.map((w) => (
            <button
              key={w.name}
              onClick={() => handleSelectWallet(w.name)}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-left cursor-pointer border-0 transition-colors duration-150"
              style={{ background: "transparent", color: "#4fc1e9" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79, 193, 233, 0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {w.icon && (
                <img src={w.icon} alt={w.name} width={18} height={18} className="rounded" />
              )}
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Teaser modal */}
      {showTeaser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowTeaser(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 rounded-lg px-8 py-6 max-w-[380px] font-mono"
            style={{
              background: "rgba(10, 14, 26, 0.95)",
              border: "1px solid rgba(79, 193, 233, 0.3)",
              boxShadow: "0 0 40px rgba(79, 193, 233, 0.15)",
              backdropFilter: "blur(12px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center text-[40px] mb-3">
              &#x1F680;&#x2728;&#x1F525;
            </div>
            <h3 className="font-pixel text-[18px] tracking-[2px] text-center mb-3" style={{ color: "#4fc1e9" }}>
              SOMETHING EPIC IS COMING
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] leading-[1.6] text-center mb-4">
              Your wallet is connected! We&apos;re building something incredible
              for Shelby Atlas holders. Stay tuned for exclusive features,
              on-chain achievements, and more.
            </p>
            <div
              className="rounded px-3 py-2 mb-4 text-[11px] text-center"
              style={{ background: "rgba(79, 193, 233, 0.08)", border: "1px solid rgba(79, 193, 233, 0.2)", color: "#4fc1e9" }}
            >
              {shortAddr}
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {[
                { icon: "\u{1F3C6}", text: "On-chain exploration badges" },
                { icon: "\u{1F4E6}", text: "Claim exclusive Shelby NFTs" },
                { icon: "\u{26A1}", text: "Unlock secret districts" },
                { icon: "\u{1F4B0}", text: "Earn rewards for building" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-[11px]">
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ color: "var(--text-muted)" }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDisconnect}
                className="flex-1 py-2 rounded font-mono text-[11px] tracking-[1px] cursor-pointer border-0 transition-all duration-200"
                style={{ background: "rgba(255,80,80,0.1)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.25)" }}
              >
                DISCONNECT
              </button>
              <button
                onClick={() => setShowTeaser(false)}
                className="flex-1 py-2 rounded font-mono text-[11px] tracking-[1px] cursor-pointer border-0 transition-all duration-200"
                style={{ background: "rgba(79, 193, 233, 0.15)", color: "#4fc1e9", border: "1px solid rgba(79, 193, 233, 0.3)" }}
              >
                CAN&apos;T WAIT!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
