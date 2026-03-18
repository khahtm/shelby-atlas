/** Monetization stall definitions for The Mint district */
export interface StallMeta {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  example: string;
}

export const STALLS: StallMeta[] = [
  {
    id: "pay-per-view",
    name: "Pay-Per-View",
    icon: "eye",
    color: "#ffd700",
    description: "Micro-payments per content access",
    example: "Stream 4K video at $0.001/min, settled on-chain",
  },
  {
    id: "tipping",
    name: "Tipping",
    icon: "gem",
    color: "#a855f7",
    description: "Direct creator-to-consumer tips",
    example: "Viewers tip creators directly, zero platform fees",
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    icon: "ticket",
    color: "#00f0ff",
    description: "Recurring access via smart contract",
    example: "Monthly AI model access, auto-renewed on-chain",
  },
  {
    id: "token-gate",
    name: "Token Gate",
    icon: "lock",
    color: "#00ff88",
    description: "NFT/token-based content access",
    example: "Hold a Metaplex NFT to unlock exclusive content",
  },
  {
    id: "drm",
    name: "DRM",
    icon: "shield",
    color: "#ff6b2b",
    description: "Protocol-level rights enforcement",
    example: "Content rights enforced at protocol level, not app level",
  },
];
