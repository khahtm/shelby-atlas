"use client";

import { useEffect, useState, useRef } from "react";

/** Blob event types matching Shelby Explorer testnet */
const EVENT_TYPES = [
  { type: "Complete", color: "#76ff03", icon: "✅" },
  { type: "Registered", color: "#00e5ff", icon: "📋" },
  { type: "Deleted", color: "#ff5252", icon: "🗑️" },
];

/** Sample blob names */
const BLOB_NAMES = [
  "data.bin", "model_v3.onnx", "screenshot.jpg", "fa.png", "backup.tar.gz",
  "index.json", "config.yaml", "ledger.csv", "nft_meta.json", "weights.h5",
  "proof.zk", "state.cbor", "batch_001.bin", "avatar.webp", "schema.proto",
];

/** Generate random hex string */
function randHex(len: number) {
  const h = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < len; i++) s += h[Math.floor(Math.random() * 16)];
  return s;
}

/** Generate a mock Shelby blob event */
function generateEvent(id: number) {
  const event = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const blobName = BLOB_NAMES[Math.floor(Math.random() * BLOB_NAMES.length)];
  return {
    id,
    event,
    hash: `0x${randHex(4)}...${randHex(5)}`,
    owner: `0x${randHex(4)}...${randHex(5)}`,
    blobName,
    time: "just now",
  };
}

interface BlobEvent {
  id: number;
  event: (typeof EVENT_TYPES)[number];
  hash: string;
  owner: string;
  blobName: string;
  time: string;
}

/** Mock Shelby testnet blob events feed — matches explorer.shelby.xyz format */
export function MockTestnetTransactionsFeed() {
  const [events, setEvents] = useState<BlobEvent[]>([]);
  const idRef = useRef(0);

  // Initial batch
  useEffect(() => {
    const initial = Array.from({ length: 5 }, () => generateEvent(++idRef.current));
    setEvents(initial);
  }, []);

  // Add new events periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateEvent(++idRef.current);
      setEvents((prev) => {
        const updated = prev.map((e, i) => ({
          ...e,
          time: `${(i + 1) * 3}s ago`,
        }));
        return [newEvent, ...updated].slice(0, 6);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-8 z-10 w-[300px] font-mono select-none pointer-events-none"
      style={{ opacity: 0.6 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 rounded-t-md text-[9px] tracking-[2px] uppercase"
        style={{
          background: "rgba(10, 14, 26, 0.9)",
          borderBottom: "1px solid rgba(0, 240, 255, 0.15)",
          color: "rgba(0, 240, 255, 0.5)",
        }}
      >
        <span>SHELBY TESTNET</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          BLOB EVENTS
        </span>
      </div>

      {/* Event list */}
      <div
        className="flex flex-col rounded-b-md overflow-hidden"
        style={{
          background: "rgba(10, 14, 26, 0.8)",
          backdropFilter: "blur(4px)",
        }}
      >
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-start gap-2 px-3 py-1.5 text-[10px]"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              animation: ev.time === "just now" ? "fadeInTx 0.3s ease" : undefined,
            }}
          >
            <span style={{ fontSize: 11, marginTop: 1 }}>{ev.event.icon}</span>
            <div className="flex-1 min-w-0">
              {/* Row 1: Type + time */}
              <div className="flex items-center justify-between">
                <span style={{ color: ev.event.color, fontWeight: 600 }}>{ev.event.type}</span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9 }}>{ev.time}</span>
              </div>
              {/* Row 2: Blob name + hash */}
              <div className="flex items-center justify-between" style={{ color: "rgba(255,255,255,0.35)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{ev.blobName}</span>
                <span>{ev.hash}</span>
              </div>
              {/* Row 3: Owner */}
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 9 }}>
                owner: {ev.owner}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInTx {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
