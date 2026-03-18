/** Quadratic bezier interpolation for data cube travel paths */

export interface Point {
  x: number;
  y: number;
}

/** Evaluate a quadratic bezier curve at parameter t (0-1) */
export function quadraticBezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

/** Generate a random control point for a bezier path between start and end */
export function randomControlPoint(start: Point, end: Point, spread: number): Point {
  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const angle = Math.random() * Math.PI * 2;
  return {
    x: mid.x + Math.cos(angle) * spread,
    y: mid.y + Math.sin(angle) * spread,
  };
}

/** Pick a random spawn point on the world edge */
export function randomEdgePoint(worldW: number, worldH: number): Point {
  const side = Math.floor(Math.random() * 4);
  switch (side) {
    case 0: return { x: Math.random() * worldW, y: -50 };
    case 1: return { x: worldW + 50, y: Math.random() * worldH };
    case 2: return { x: Math.random() * worldW, y: worldH + 50 };
    default: return { x: -50, y: Math.random() * worldH };
  }
}
