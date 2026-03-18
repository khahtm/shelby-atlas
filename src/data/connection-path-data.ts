import { toScreen } from "@/src/utils/isometric-helpers";
import { DISTRICTS } from "@/src/data/district-metadata";

/** District connection definition */
export interface ConnectionDef {
  from: string;
  to: string;
  color: number;
}

/** All district-to-district connections */
export const CONNECTIONS: ConnectionDef[] = [
  { from: "furnace", to: "fiber-highway", color: 0xff6b35 },
  { from: "furnace", to: "mint", color: 0xff9f1c },
  { from: "fiber-highway", to: "watchtower", color: 0x00e5ff },
  { from: "fiber-highway", to: "hall-of-fame", color: 0xffd700 },
  { from: "mint", to: "watchtower", color: 0x76ff03 },
  { from: "mint", to: "docks", color: 0xb2ff59 },
  { from: "watchtower", to: "workshop", color: 0xe040fb },
  { from: "watchtower", to: "hall-of-fame", color: 0xffe566 },
  { from: "docks", to: "workshop", color: 0xffab00 },
];

/** Grid position lookup */
const gridMap = new Map(
  DISTRICTS.map((d) => [d.id, d.gridPosition]),
);

/** Build grid-aligned waypoints: walk cols first, then rows */
export function buildGridPath(fromId: string, toId: string): Array<{ x: number; y: number }> {
  const a = gridMap.get(fromId);
  const b = gridMap.get(toId);
  if (!a || !b) return [];

  const points: Array<{ x: number; y: number }> = [];
  let col = a.col;
  let row = a.row;

  points.push(toScreen(col, row));

  const colDir = b.col > col ? 1 : -1;
  while (col !== b.col) {
    col += colDir;
    points.push(toScreen(col, row));
  }

  const rowDir = b.row > row ? 1 : -1;
  while (row !== b.row) {
    row += rowDir;
    points.push(toScreen(col, row));
  }

  return points;
}

/** Pre-computed path data with screen-space waypoints */
export const CONNECTION_PATHS = CONNECTIONS.map((c) => ({
  ...c,
  points: buildGridPath(c.from, c.to),
}));

/** Set of occupied grid cells (district centers ± 2 tiles) */
export function isNearDistrict(col: number, row: number, radius = 3): boolean {
  for (const d of DISTRICTS) {
    const dc = Math.abs(col - d.gridPosition.col);
    const dr = Math.abs(row - d.gridPosition.row);
    if (dc <= radius && dr <= radius) return true;
  }
  return false;
}

/** Check if a grid cell is on a connection path */
export function isOnPath(col: number, row: number): boolean {
  for (const conn of CONNECTIONS) {
    const a = gridMap.get(conn.from);
    const b = gridMap.get(conn.to);
    if (!a || !b) continue;

    // Col segment: row = a.row, col between a.col and b.col
    const minCol = Math.min(a.col, b.col);
    const maxCol = Math.max(a.col, b.col);
    if (row === a.row && col >= minCol && col <= maxCol) return true;

    // Row segment: col = b.col, row between a.row and b.row
    const minRow = Math.min(a.row, b.row);
    const maxRow = Math.max(a.row, b.row);
    if (col === b.col && row >= minRow && row <= maxRow) return true;
  }
  return false;
}
