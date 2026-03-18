"use client";

import { useRef, useCallback } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics, Text, TextStyle } from "pixi.js";
import { CONNECTION_PATHS } from "@/src/data/connection-path-data";

extend({ Graphics, Text });

/** Celebrity NPC definitions */
const CELEBRITIES = [
  {
    name: "Vitalik",
    headColor: 0xffcc88,
    bodyColor: 0x888888,
    hairColor: 0x222222,
    pantsColor: 0x333355,
    labelColor: "#a855f7",
    special: "tall",
    emoji: "\u{1F9E0}",
    quotes: ["gm frens", "proof of stake >>", "ETH to 100k", "quadratic voting!", "decentralize everything"],
  },
  {
    name: "Elon",
    headColor: 0xffcc88,
    bodyColor: 0x111111,
    hairColor: 0x554433,
    pantsColor: 0x111111,
    labelColor: "#00e5ff",
    special: "normal",
    emoji: "\u{1F680}",
    quotes: ["to the moon!", "X > Twitter", "DOGE!", "first principles", "funding secured"],
  },
  {
    name: "Pikachu",
    headColor: 0xffd700,
    bodyColor: 0xffd700,
    hairColor: 0xffd700,
    pantsColor: 0xcc8800,
    labelColor: "#ffd700",
    special: "pikachu",
    emoji: "\u{26A1}",
    quotes: ["Pika pika!", "Pikaaa~!", "Chu!", "Pika pi!", "*thunderbolt*"],
  },
  {
    name: "Luffy",
    headColor: 0xffcc88,
    bodyColor: 0xff2222,
    hairColor: 0x111111,
    pantsColor: 0x3344aa,
    labelColor: "#ff2222",
    special: "luffy",
    emoji: "\u{1F451}",
    quotes: ["I'll be Pirate King!", "GOMU GOMU NO~!", "MEAT!!!", "Shishishi~", "nakama forever"],
  },
  {
    name: "Naruto",
    headColor: 0xffcc88,
    bodyColor: 0xff8800,
    hairColor: 0xffdd00,
    pantsColor: 0xff6600,
    labelColor: "#ff8800",
    special: "naruto",
    emoji: "\u{1F341}",
    quotes: ["Dattebayo!", "RASENGAN!", "believe it!", "Hokage desu!", "never give up!"],
  },
  {
    name: "Doraemon",
    headColor: 0x2299ff,
    bodyColor: 0xffffff,
    hairColor: 0x2299ff,
    pantsColor: 0x2299ff,
    labelColor: "#2299ff",
    special: "doraemon",
    emoji: "\u{1F514}",
    quotes: ["\u{1F33F} lá đu đủ nè Nobita!", "*pulls out gadget*", "Nobita-kun!", "dorayaki pls"],
  },
  {
    name: "Baobao",
    headColor: 0xffcc88,
    bodyColor: 0x444444,
    hairColor: 0xffcc88,
    pantsColor: 0x333333,
    labelColor: "#69f0ae",
    special: "bald",
    emoji: "\u{1F468}\u{200D}\u{1F9B2}",
    quotes: ["gm builders!", "LFG!!!", "wagmi", "wen mainnet?", "buidl > hodl"],
  },
];

interface CelebrityNPC {
  celeb: (typeof CELEBRITIES)[number];
  pathIdx: number;
  t: number;
  dir: 1 | -1;
  speed: number;
  walkPhase: number;
}

/** Init 3 NPCs on random paths */
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

const labelStyle = new TextStyle({
  fontFamily: "VT323, monospace",
  fontSize: 12,
  align: "center",
});

/** Get position on path */
function getPos(pathIdx: number, t: number): { x: number; y: number } {
  const pts = CONNECTION_PATHS[pathIdx].points;
  const seg = Math.floor(t);
  const frac = t - seg;
  const a = pts[Math.min(seg, pts.length - 1)];
  const b = pts[Math.min(seg + 1, pts.length - 1)];
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
}

/** Draw Vitalik — tall & skinny */
function drawVitalik(g: Graphics, x: number, y: number, c: (typeof CELEBRITIES)[0], leg: number) {
  // Hair (messy)
  g.rect(x - 3, y - 13, 6, 3);
  g.fill({ color: c.hairColor, alpha: 0.9 });
  g.rect(x - 4, y - 12, 2, 2);
  g.fill({ color: c.hairColor, alpha: 0.7 });
  // Head
  g.circle(x, y - 9, 3);
  g.fill({ color: c.headColor, alpha: 0.9 });
  // Body (tall)
  g.rect(x - 2, y - 6, 4, 8);
  g.fill({ color: c.bodyColor, alpha: 0.85 });
  // Legs
  g.moveTo(x - 1, y + 2);
  g.lineTo(x - 2 + leg, y + 6);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 2);
  g.lineTo(x + 2 - leg, y + 6);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  // Arms
  g.moveTo(x - 2, y - 4);
  g.lineTo(x - 4 + leg * 0.5, y - 1);
  g.stroke({ width: 1, color: c.bodyColor, alpha: 0.7 });
  g.moveTo(x + 2, y - 4);
  g.lineTo(x + 4 - leg * 0.5, y - 1);
  g.stroke({ width: 1, color: c.bodyColor, alpha: 0.7 });
}

/** Draw Elon — stocky, dark outfit */
function drawElon(g: Graphics, x: number, y: number, c: (typeof CELEBRITIES)[0], leg: number) {
  // Hair (short)
  g.rect(x - 3, y - 11, 6, 2);
  g.fill({ color: c.hairColor, alpha: 0.8 });
  // Head
  g.circle(x, y - 8, 3);
  g.fill({ color: c.headColor, alpha: 0.9 });
  // Body (broader)
  g.rect(x - 3, y - 5, 6, 7);
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  // Legs
  g.moveTo(x - 1, y + 2);
  g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 2);
  g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  // Arms
  g.moveTo(x - 3, y - 3);
  g.lineTo(x - 5 + leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
  g.moveTo(x + 3, y - 3);
  g.lineTo(x + 5 - leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
}

/** Draw Pikachu — yellow blob with ears, tail, red cheeks */
function drawPikachu(g: Graphics, x: number, y: number, c: (typeof CELEBRITIES)[0], leg: number) {
  // Pointy ears
  g.moveTo(x - 4, y - 10);
  g.lineTo(x - 2, y - 16);
  g.lineTo(x, y - 10);
  g.closePath();
  g.fill({ color: c.headColor, alpha: 0.9 });
  // Ear tip black
  g.moveTo(x - 2, y - 16);
  g.lineTo(x - 1, y - 14);
  g.lineTo(x - 3, y - 14);
  g.closePath();
  g.fill({ color: 0x222222, alpha: 0.8 });

  g.moveTo(x + 4, y - 10);
  g.lineTo(x + 2, y - 16);
  g.lineTo(x, y - 10);
  g.closePath();
  g.fill({ color: c.headColor, alpha: 0.9 });
  g.moveTo(x + 2, y - 16);
  g.lineTo(x + 1, y - 14);
  g.lineTo(x + 3, y - 14);
  g.closePath();
  g.fill({ color: 0x222222, alpha: 0.8 });

  // Head
  g.circle(x, y - 8, 4);
  g.fill({ color: c.headColor, alpha: 0.95 });
  // Eyes
  g.circle(x - 2, y - 9, 1);
  g.fill({ color: 0x222222, alpha: 0.9 });
  g.circle(x + 2, y - 9, 1);
  g.fill({ color: 0x222222, alpha: 0.9 });
  // Red cheeks
  g.circle(x - 3, y - 7, 1.5);
  g.fill({ color: 0xff3333, alpha: 0.6 });
  g.circle(x + 3, y - 7, 1.5);
  g.fill({ color: 0xff3333, alpha: 0.6 });
  // Body
  g.ellipse(x, y - 2, 3.5, 5);
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  // Feet
  g.circle(x - 2 + leg * 0.5, y + 3, 1.5);
  g.fill({ color: c.pantsColor, alpha: 0.8 });
  g.circle(x + 2 - leg * 0.5, y + 3, 1.5);
  g.fill({ color: c.pantsColor, alpha: 0.8 });
  // Tail (lightning bolt shape)
  g.moveTo(x + 4, y - 4);
  g.lineTo(x + 8, y - 8);
  g.lineTo(x + 6, y - 5);
  g.lineTo(x + 10, y - 10);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
}

/** Draw Luffy — straw hat, red vest, blue shorts */
function drawLuffy(g: Graphics, x: number, y: number, c: (typeof CELEBRITIES)[0], leg: number) {
  // Straw hat
  g.ellipse(x, y - 13, 6, 2);
  g.fill({ color: 0xddbb44, alpha: 0.9 });
  g.rect(x - 4, y - 15, 8, 3);
  g.fill({ color: 0xddbb44, alpha: 0.9 });
  g.stroke({ width: 1, color: 0xcc9933, alpha: 0.6 });
  // Red hat band
  g.rect(x - 4, y - 13, 8, 1.5);
  g.fill({ color: 0xff2222, alpha: 0.8 });
  // Head
  g.circle(x, y - 9, 3);
  g.fill({ color: c.headColor, alpha: 0.9 });
  // Messy black hair
  g.rect(x - 3, y - 12, 6, 2);
  g.fill({ color: c.hairColor, alpha: 0.8 });
  // Scar under eye
  g.moveTo(x - 1, y - 8);
  g.lineTo(x + 1, y - 7);
  g.stroke({ width: 0.5, color: 0x884444, alpha: 0.7 });
  // Red vest (open)
  g.rect(x - 3, y - 6, 6, 6);
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  // Blue shorts
  g.rect(x - 2, y, 4, 3);
  g.fill({ color: c.pantsColor, alpha: 0.85 });
  // Legs
  g.moveTo(x - 1, y + 3);
  g.lineTo(x - 2 + leg, y + 6);
  g.stroke({ width: 1.5, color: c.headColor, alpha: 0.7 });
  g.moveTo(x + 1, y + 3);
  g.lineTo(x + 2 - leg, y + 6);
  g.stroke({ width: 1.5, color: c.headColor, alpha: 0.7 });
  // Sandals
  g.rect(x - 3 + leg, y + 5, 3, 1.5);
  g.fill({ color: 0x886633, alpha: 0.7 });
  g.rect(x + 1 - leg, y + 5, 3, 1.5);
  g.fill({ color: 0x886633, alpha: 0.7 });
}

/** Draw Naruto — spiky yellow hair, orange jumpsuit, headband */
function drawNaruto(g: Graphics, x: number, y: number, c: (typeof CELEBRITIES)[0], leg: number) {
  // Spiky hair
  for (let i = 0; i < 5; i++) {
    const sx = x - 4 + i * 2;
    g.moveTo(sx, y - 11);
    g.lineTo(sx + 1, y - 16 - (i === 2 ? 2 : 0));
    g.lineTo(sx + 2, y - 11);
    g.closePath();
    g.fill({ color: c.hairColor, alpha: 0.9 });
  }
  // Head
  g.circle(x, y - 9, 3);
  g.fill({ color: c.headColor, alpha: 0.9 });
  // Headband
  g.rect(x - 4, y - 11, 8, 2);
  g.fill({ color: 0x3344aa, alpha: 0.85 });
  // Metal plate on headband
  g.rect(x - 2, y - 11, 4, 2);
  g.fill({ color: 0x888888, alpha: 0.8 });
  // Whisker marks
  g.moveTo(x - 3, y - 8); g.lineTo(x - 1, y - 8);
  g.stroke({ width: 0.5, color: 0x886644, alpha: 0.5 });
  g.moveTo(x + 1, y - 8); g.lineTo(x + 3, y - 8);
  g.stroke({ width: 0.5, color: 0x886644, alpha: 0.5 });
  // Orange jumpsuit body
  g.rect(x - 3, y - 6, 6, 7);
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  // Legs
  g.moveTo(x - 1, y + 1);
  g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 1);
  g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
}

/** Draw Doraemon — blue round robot cat, white belly, bell, no ears */
function drawDoraemon(g: Graphics, x: number, y: number, c: (typeof CELEBRITIES)[0], leg: number) {
  // Big round blue head
  g.circle(x, y - 8, 5);
  g.fill({ color: c.hairColor, alpha: 0.95 });
  // White face area
  g.circle(x, y - 7, 3.5);
  g.fill({ color: 0xffffff, alpha: 0.95 });
  // Eyes (big, white with black dots)
  g.circle(x - 1.5, y - 9, 1.5);
  g.fill({ color: 0xffffff, alpha: 1 });
  g.circle(x + 1.5, y - 9, 1.5);
  g.fill({ color: 0xffffff, alpha: 1 });
  g.circle(x - 1, y - 9, 0.8);
  g.fill({ color: 0x111111, alpha: 1 });
  g.circle(x + 2, y - 9, 0.8);
  g.fill({ color: 0x111111, alpha: 1 });
  // Red nose
  g.circle(x, y - 7, 1.2);
  g.fill({ color: 0xff2222, alpha: 0.9 });
  // Whiskers
  g.moveTo(x - 3, y - 7); g.lineTo(x - 6, y - 8);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  g.moveTo(x - 3, y - 6); g.lineTo(x - 6, y - 6);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  g.moveTo(x + 3, y - 7); g.lineTo(x + 6, y - 8);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  g.moveTo(x + 3, y - 6); g.lineTo(x + 6, y - 6);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  // White belly body
  g.ellipse(x, y, 4, 5);
  g.fill({ color: c.bodyColor, alpha: 0.95 });
  g.stroke({ width: 1, color: c.hairColor, alpha: 0.8 });
  // Red collar
  g.rect(x - 4, y - 3, 8, 2);
  g.fill({ color: 0xff2222, alpha: 0.85 });
  // Bell
  g.circle(x, y - 1, 1.5);
  g.fill({ color: 0xffd700, alpha: 0.9 });
  // 4D pocket
  g.ellipse(x, y + 1, 2.5, 2);
  g.fill({ color: 0xffffff, alpha: 0.6 });
  g.stroke({ width: 0.5, color: c.hairColor, alpha: 0.5 });
  // Feet
  g.circle(x - 2.5 + leg * 0.5, y + 5, 2);
  g.fill({ color: 0xffffff, alpha: 0.9 });
  g.circle(x + 2.5 - leg * 0.5, y + 5, 2);
  g.fill({ color: 0xffffff, alpha: 0.9 });
}

/** Draw Baobao — bald man, simple */
function drawBaobao(g: Graphics, x: number, y: number, c: (typeof CELEBRITIES)[0], leg: number) {
  // Bald shiny head (no hair)
  g.circle(x, y - 9, 3.5);
  g.fill({ color: c.headColor, alpha: 0.95 });
  // Head shine
  g.circle(x - 1, y - 11, 1);
  g.fill({ color: 0xffffff, alpha: 0.3 });
  // Sunglasses
  g.rect(x - 3, y - 10, 2.5, 2);
  g.fill({ color: 0x111111, alpha: 0.9 });
  g.rect(x + 0.5, y - 10, 2.5, 2);
  g.fill({ color: 0x111111, alpha: 0.9 });
  g.moveTo(x - 0.5, y - 9);
  g.lineTo(x + 0.5, y - 9);
  g.stroke({ width: 0.5, color: 0x111111, alpha: 0.8 });
  // Body
  g.rect(x - 3, y - 5, 6, 7);
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  // Legs
  g.moveTo(x - 1, y + 2);
  g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 2);
  g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  // Arms
  g.moveTo(x - 3, y - 3);
  g.lineTo(x - 5 + leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
  g.moveTo(x + 3, y - 3);
  g.lineTo(x + 5 - leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
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

      const drawFns: Record<string, typeof drawVitalik> = {
        tall: drawVitalik, normal: drawElon, pikachu: drawPikachu,
        luffy: drawLuffy, naruto: drawNaruto, doraemon: drawDoraemon, bald: drawBaobao,
      };
      const drawFn = drawFns[npc.celeb.special] ?? drawElon;
      drawFn(g, pos.x, pos.y, npc.celeb, leg);

      // Draw speech bubble background
      const bubbleX = pos.x + 12;
      const bubbleY = pos.y - 28;
      // Bubble body
      g.roundRect(bubbleX - 2, bubbleY - 10, 90, 16, 4);
      g.fill({ color: 0x0a0e1a, alpha: 0.85 });
      g.stroke({ width: 1, color: Number(npc.celeb.labelColor.replace("#", "0x")), alpha: 0.5 });
      // Bubble tail (triangle pointing to character)
      g.moveTo(bubbleX + 2, bubbleY + 6);
      g.lineTo(bubbleX - 4, bubbleY + 12);
      g.lineTo(bubbleX + 8, bubbleY + 6);
      g.closePath();
      g.fill({ color: 0x0a0e1a, alpha: 0.85 });

      // Move name label
      const label = labelRefs.current[i];
      if (label) {
        label.x = pos.x;
        label.y = pos.y - 22;
      }

      // Move quote label
      const qLabel = quoteRefs.current[i];
      if (qLabel) {
        qLabel.x = bubbleX + 44;
        qLabel.y = bubbleY - 2;
      }
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
