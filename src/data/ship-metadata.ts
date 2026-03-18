/** Chain ship definitions for The Docks district */
export interface ShipMeta {
  id: string;
  name: string;
  color: string;
  state: "docked" | "approaching" | "further" | "horizon";
  description: string;
  stats: Record<string, string>;
  /** Offset from dock origin in local pixels */
  localOffset: { x: number; y: number };
}

export const SHIPS: ShipMeta[] = [
  {
    id: "aptos",
    name: "Aptos",
    color: "#4FC1E9",
    state: "docked",
    description: "Native coordination layer",
    stats: { finality: "600ms", tps: "30K", gas: "$0.000005" },
    localOffset: { x: 0, y: 20 },
  },
  {
    id: "ethereum",
    name: "Ethereum",
    color: "#a855f7",
    state: "approaching",
    description: "Planned: read Shelby data from Solidity contracts",
    stats: { finality: "12min", tps: "30", gas: "$2-50" },
    localOffset: { x: 160, y: 80 },
  },
  {
    id: "solana",
    name: "Solana",
    color: "#14f195",
    state: "further",
    description: "Planned: high-speed DePIN and streaming integration",
    stats: { finality: "400ms", tps: "65K", gas: "$0.00025" },
    localOffset: { x: 300, y: 150 },
  },
  {
    id: "cosmos",
    name: "Cosmos",
    color: "#ffffff",
    state: "horizon",
    description: "Exploring: IBC-compatible data access",
    stats: { finality: "6s", tps: "10K", gas: "varies" },
    localOffset: { x: 460, y: 230 },
  },
];
