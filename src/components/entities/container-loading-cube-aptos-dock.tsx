"use client";

import { useCallback, useRef } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";

extend({ Graphics });

const CUBE_SIZE = 16;
const COLORS = [0x4fc1e9, 0x2a9fd6, 0x7ed3f7];

// Cube moves from ship (x=0) to dock (x=48) in a loop
const SHIP_X = 0;
const DOCK_X = 48;
const CYCLE = 180; // frames per full trip

/** Animated loading cubes shuttling between Aptos ship and dock */
export function ContainerLoadingCubeAptosDock() {
  const tickRef = useRef(0);
  const gRefs = [
    useRef<Graphics | null>(null),
    useRef<Graphics | null>(null),
    useRef<Graphics | null>(null),
  ];

  const drawEmpty = useCallback((g: Graphics) => { g.clear(); }, []);

  const drawCube = useCallback((g: Graphics, color: number) => {
    g.clear();
    // Top face
    g.rect(0, 0, CUBE_SIZE, CUBE_SIZE * 0.5);
    g.fill({ color, alpha: 0.9 });
    // Side face (darker)
    g.rect(0, CUBE_SIZE * 0.5, CUBE_SIZE, CUBE_SIZE * 0.5);
    g.fill({ color, alpha: 0.6 });
    g.stroke({ width: 1, color: 0xffffff, alpha: 0.15 });
  }, []);

  useTick((delta) => {
    tickRef.current = (tickRef.current + delta.deltaTime) % CYCLE;
    const t = tickRef.current / CYCLE;

    gRefs.forEach((ref, i) => {
      const g = ref.current;
      if (!g) return;
      // Stagger cubes by 1/3 cycle each
      const offset = (t + i / 3) % 1;
      // Ping-pong: 0→1 first half, 1→0 second half
      const pos = offset < 0.5 ? offset * 2 : (1 - offset) * 2;
      g.x = SHIP_X + pos * (DOCK_X - SHIP_X);
      g.y = -i * 4;
      drawCube(g, COLORS[i]);
    });
  });

  return (
    <pixiContainer x={-8} y={12}>
      <pixiGraphics ref={gRefs[0]} draw={drawEmpty} />
      <pixiGraphics ref={gRefs[1]} draw={drawEmpty} />
      <pixiGraphics ref={gRefs[2]} draw={drawEmpty} />
    </pixiContainer>
  );
}
