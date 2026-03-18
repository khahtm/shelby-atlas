import type { DistrictMeta } from "./types";

/**
 * 7 districts arranged in a hex-like isometric layout.
 * Grid positions define where each district sits on the isometric map.
 */
export const DISTRICTS: DistrictMeta[] = [
  {
    id: "furnace",
    name: "The Furnace",
    gridPosition: { col: 10, row: 3 },
    color: "#ff6b35",
    accentColor: "#ff9f1c",
    description: "Where blobs are forged and validated",
    pillar: "Blob Creation",
  },
  {
    id: "fiber-highway",
    name: "Fiber Highway",
    gridPosition: { col: 22, row: 8 },
    color: "#00e5ff",
    accentColor: "#18ffff",
    description: "High-speed data transmission network",
    pillar: "Data Transport",
  },
  {
    id: "mint",
    name: "The Mint",
    gridPosition: { col: 3, row: 11 },
    color: "#76ff03",
    accentColor: "#b2ff59",
    description: "Token economics and staking operations",
    pillar: "Economics",
  },
  {
    id: "watchtower",
    name: "Watchtower",
    gridPosition: { col: 16, row: 17 },
    color: "#e040fb",
    accentColor: "#ea80fc",
    description: "Security monitoring and verification",
    pillar: "Security",
  },
  {
    id: "docks",
    name: "The Docks",
    gridPosition: { col: 5, row: 23 },
    color: "#ffab00",
    accentColor: "#ffd740",
    description: "Storage provider fleet management",
    pillar: "Storage",
  },
  {
    id: "hall-of-fame",
    name: "Hall of Fame",
    gridPosition: { col: 26, row: 18 },
    color: "#ffd700",
    accentColor: "#ffe566",
    description: "Celebrating the best projects built on Shelby",
    pillar: "Community",
  },
  {
    id: "workshop",
    name: "Workshop",
    gridPosition: { col: 20, row: 26 },
    color: "#69f0ae",
    accentColor: "#b9f6ca",
    description: "Developer tools and SDK integration",
    pillar: "Developer",
  },
];

export const DISTRICT_MAP = new Map(DISTRICTS.map((d) => [d.id, d]));
