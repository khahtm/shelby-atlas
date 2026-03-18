/** Tile dimensions in pixels for isometric projection */
export const TILE_W = 128;
export const TILE_H = 64;

/** World grid size (cols x rows) */
export const GRID_COLS = 30;
export const GRID_ROWS = 30;

/** World pixel dimensions derived from grid */
export const WORLD_W = (GRID_COLS + GRID_ROWS) * (TILE_W / 2);
export const WORLD_H = (GRID_COLS + GRID_ROWS) * (TILE_H / 2);

/** Convert grid (col, row) to screen (x, y) in isometric space */
export function toScreen(col: number, row: number) {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  };
}

/** Convert screen (x, y) back to grid (col, row) */
export function toGrid(x: number, y: number) {
  return {
    col: (x / (TILE_W / 2) + y / (TILE_H / 2)) / 2,
    row: (y / (TILE_H / 2) - x / (TILE_W / 2)) / 2,
  };
}

/** District placeholder size in pixels */
export const DISTRICT_SIZE = { w: TILE_W * 3, h: TILE_H * 3 };
