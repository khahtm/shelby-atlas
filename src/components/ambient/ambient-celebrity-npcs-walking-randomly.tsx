"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics, Text, TextStyle } from "pixi.js";
import { CONNECTION_PATHS } from "@/src/data/connection-path-data";
import { CELEBRITIES } from "@/src/data/celebrity-npc-data";
import { CELEBRITY_DRAW_FNS } from "./celebrity-npc-pixel-draw-functions";

extend({ Graphics, Text });

interface CelebrityNPC {
  celeb: (typeof CELEBRITIES)[number];
  pathIdx: number;
  t: number;
  dir: 1 | -1;
  speed: number;
  walkPhase: number;
}

/** Init NPCs on distributed paths */
function initNPCs(): CelebrityNPC[] {
  return CELEBRITIES.map((celeb, i) => {
    const pathIdx = (i * 3 + 1) % CONNECTION_PATHS.length;
    const pts = CONNECTION_PATHS[pathIdx].points;
    const segCount = pts.length - 1;
    return {
      celeb,
      pathIdx,
      t: (segCount * (i + 1)) / 4,
      dir: i % 2 === 0 ? 1 : -1 as 1 | -1,
      speed: 8 + i * 2,
      walkPhase: i * 1.5,
    };
  });
}

const npcs = initNPCs();

/** Get interpolated position on path */
function getPos(pathIdx: number, t: number): { x: number; y: number } {
  const pts = CONNECTION_PATHS[pathIdx].points;
  const seg = Math.floor(t);
  const frac = t - seg;
  const a = pts[Math.min(seg, pts.length - 1)];
  const b = pts[Math.min(seg + 1, pts.length - 1)];
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
}

/** Celebrity NPCs walking randomly on city paths */
export function AmbientCelebrityNpcsWalkingRandomly() {
  const gfxRef = useRef<Graphics | null>(null);
  const labelRefs = useRef<Text[]>([]);
  const quoteRefs = useRef<Text[]>([]);
  const quoteTimerRef = useRef(0);
  const quoteIdxRef = useRef(npcs.map(() => 0));

  useTick((ticker) => {
    const g = gfxRef.current;
    if (!g) return;
    g.clear();

    const dt = ticker.deltaTime / 60;

    // Cycle quotes every ~4 seconds
    quoteTimerRef.current += ticker.deltaTime;
    if (quoteTimerRef.current > 240) {
      quoteTimerRef.current = 0;
      for (let i = 0; i < npcs.length; i++) {
        quoteIdxRef.current[i] = (quoteIdxRef.current[i] + 1) % npcs[i].celeb.quotes.length;
        const qLabel = quoteRefs.current[i];
        if (qLabel) {
          qLabel.text = `${npcs[i].celeb.emoji} ${npcs[i].celeb.quotes[quoteIdxRef.current[i]]}`;
        }
      }
    }

    for (let i = 0; i < npcs.length; i++) {
      const npc = npcs[i];
      const segCount = CONNECTION_PATHS[npc.pathIdx].points.length - 1;

      npc.t += npc.dir * npc.speed * dt / 64;
      npc.walkPhase += ticker.deltaTime * 0.12;

      if (npc.t >= segCount) { npc.t = segCount; npc.dir = -1; }
      else if (npc.t <= 0) { npc.t = 0; npc.dir = 1; }

      const pos = getPos(npc.pathIdx, npc.t);
      const leg = Math.sin(npc.walkPhase) * 1.5;

      const drawFn = CELEBRITY_DRAW_FNS[npc.celeb.special] ?? CELEBRITY_DRAW_FNS.normal;
      drawFn(g, pos.x, pos.y, npc.celeb, leg);

      // Draw speech bubble background
      const bubbleX = pos.x + 12;
      const bubbleY = pos.y - 28;
      g.roundRect(bubbleX - 2, bubbleY - 10, 90, 16, 4);
      g.fill({ color: 0x0a0e1a, alpha: 0.85 });
      g.stroke({ width: 1, color: Number(npc.celeb.labelColor.replace("#", "0x")), alpha: 0.5 });
      // Bubble tail
      g.moveTo(bubbleX + 2, bubbleY + 6);
      g.lineTo(bubbleX - 4, bubbleY + 12);
      g.lineTo(bubbleX + 8, bubbleY + 6);
      g.closePath();
      g.fill({ color: 0x0a0e1a, alpha: 0.85 });

      // Move name label
      const label = labelRefs.current[i];
      if (label) { label.x = pos.x; label.y = pos.y - 22; }

      // Move quote label
      const qLabel = quoteRefs.current[i];
      if (qLabel) { qLabel.x = bubbleX + 44; qLabel.y = bubbleY - 2; }
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  return (
    <>
      <pixiGraphics draw={initDraw} ref={gfxRef} />
      {npcs.map((npc, i) => (
        <pixiText
          key={npc.celeb.name}
          text={`${npc.celeb.emoji} ${npc.celeb.name}`}
          style={new TextStyle({
            fontFamily: "VT323, monospace",
            fontSize: 12,
            fill: npc.celeb.labelColor,
            align: "center",
          })}
          anchor={0.5}
          ref={(node: Text | null) => { if (node) labelRefs.current[i] = node; }}
          x={0}
          y={0}
        />
      ))}
      {npcs.map((npc, i) => (
        <pixiText
          key={`q-${npc.celeb.name}`}
          text={`${npc.celeb.emoji} ${npc.celeb.quotes?.[0] ?? npc.celeb.name}`}
          style={new TextStyle({
            fontFamily: "VT323, monospace",
            fontSize: 10,
            fill: npc.celeb.labelColor,
            align: "center",
          })}
          anchor={0.5}
          ref={(node: Text | null) => { if (node) quoteRefs.current[i] = node; }}
          x={0}
          y={0}
        />
      ))}
    </>
  );
}
