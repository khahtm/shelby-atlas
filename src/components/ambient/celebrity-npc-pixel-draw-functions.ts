import { Graphics } from "pixi.js";
import type { CelebrityDef } from "@/src/data/celebrity-npc-data";

/** Draw Vitalik — tall & skinny */
function drawVitalik(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.rect(x - 3, y - 13, 6, 3);
  g.fill({ color: c.hairColor, alpha: 0.9 });
  g.rect(x - 4, y - 12, 2, 2);
  g.fill({ color: c.hairColor, alpha: 0.7 });
  g.circle(x, y - 9, 3);
  g.fill({ color: c.headColor, alpha: 0.9 });
  g.rect(x - 2, y - 6, 4, 8);
  g.fill({ color: c.bodyColor, alpha: 0.85 });
  g.moveTo(x - 1, y + 2); g.lineTo(x - 2 + leg, y + 6);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 2); g.lineTo(x + 2 - leg, y + 6);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x - 2, y - 4); g.lineTo(x - 4 + leg * 0.5, y - 1);
  g.stroke({ width: 1, color: c.bodyColor, alpha: 0.7 });
  g.moveTo(x + 2, y - 4); g.lineTo(x + 4 - leg * 0.5, y - 1);
  g.stroke({ width: 1, color: c.bodyColor, alpha: 0.7 });
}

/** Draw Elon — stocky, dark outfit */
function drawElon(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.rect(x - 3, y - 11, 6, 2);
  g.fill({ color: c.hairColor, alpha: 0.8 });
  g.circle(x, y - 8, 3);
  g.fill({ color: c.headColor, alpha: 0.9 });
  g.rect(x - 3, y - 5, 6, 7);
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.moveTo(x - 1, y + 2); g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 2); g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x - 3, y - 3); g.lineTo(x - 5 + leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
  g.moveTo(x + 3, y - 3); g.lineTo(x + 5 - leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
}

/** Draw Pikachu — yellow blob with ears, tail, red cheeks */
function drawPikachu(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  // Pointy ears with black tips
  g.moveTo(x - 4, y - 10); g.lineTo(x - 2, y - 16); g.lineTo(x, y - 10); g.closePath();
  g.fill({ color: c.headColor, alpha: 0.9 });
  g.moveTo(x - 2, y - 16); g.lineTo(x - 1, y - 14); g.lineTo(x - 3, y - 14); g.closePath();
  g.fill({ color: 0x222222, alpha: 0.8 });
  g.moveTo(x + 4, y - 10); g.lineTo(x + 2, y - 16); g.lineTo(x, y - 10); g.closePath();
  g.fill({ color: c.headColor, alpha: 0.9 });
  g.moveTo(x + 2, y - 16); g.lineTo(x + 1, y - 14); g.lineTo(x + 3, y - 14); g.closePath();
  g.fill({ color: 0x222222, alpha: 0.8 });
  g.circle(x, y - 8, 4);
  g.fill({ color: c.headColor, alpha: 0.95 });
  g.circle(x - 2, y - 9, 1); g.fill({ color: 0x222222, alpha: 0.9 });
  g.circle(x + 2, y - 9, 1); g.fill({ color: 0x222222, alpha: 0.9 });
  g.circle(x - 3, y - 7, 1.5); g.fill({ color: 0xff3333, alpha: 0.6 });
  g.circle(x + 3, y - 7, 1.5); g.fill({ color: 0xff3333, alpha: 0.6 });
  g.ellipse(x, y - 2, 3.5, 5);
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.circle(x - 2 + leg * 0.5, y + 3, 1.5); g.fill({ color: c.pantsColor, alpha: 0.8 });
  g.circle(x + 2 - leg * 0.5, y + 3, 1.5); g.fill({ color: c.pantsColor, alpha: 0.8 });
  // Lightning bolt tail
  g.moveTo(x + 4, y - 4); g.lineTo(x + 8, y - 8);
  g.lineTo(x + 6, y - 5); g.lineTo(x + 10, y - 10);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
}

/** Draw Luffy — straw hat, red vest, blue shorts */
function drawLuffy(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.ellipse(x, y - 13, 6, 2); g.fill({ color: 0xddbb44, alpha: 0.9 });
  g.rect(x - 4, y - 15, 8, 3); g.fill({ color: 0xddbb44, alpha: 0.9 });
  g.stroke({ width: 1, color: 0xcc9933, alpha: 0.6 });
  g.rect(x - 4, y - 13, 8, 1.5); g.fill({ color: 0xff2222, alpha: 0.8 });
  g.circle(x, y - 9, 3); g.fill({ color: c.headColor, alpha: 0.9 });
  g.rect(x - 3, y - 12, 6, 2); g.fill({ color: c.hairColor, alpha: 0.8 });
  g.moveTo(x - 1, y - 8); g.lineTo(x + 1, y - 7);
  g.stroke({ width: 0.5, color: 0x884444, alpha: 0.7 });
  g.rect(x - 3, y - 6, 6, 6); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.rect(x - 2, y, 4, 3); g.fill({ color: c.pantsColor, alpha: 0.85 });
  g.moveTo(x - 1, y + 3); g.lineTo(x - 2 + leg, y + 6);
  g.stroke({ width: 1.5, color: c.headColor, alpha: 0.7 });
  g.moveTo(x + 1, y + 3); g.lineTo(x + 2 - leg, y + 6);
  g.stroke({ width: 1.5, color: c.headColor, alpha: 0.7 });
  g.rect(x - 3 + leg, y + 5, 3, 1.5); g.fill({ color: 0x886633, alpha: 0.7 });
  g.rect(x + 1 - leg, y + 5, 3, 1.5); g.fill({ color: 0x886633, alpha: 0.7 });
}

/** Draw Naruto — spiky yellow hair, orange jumpsuit, headband */
function drawNaruto(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  for (let i = 0; i < 5; i++) {
    const sx = x - 4 + i * 2;
    g.moveTo(sx, y - 11); g.lineTo(sx + 1, y - 16 - (i === 2 ? 2 : 0));
    g.lineTo(sx + 2, y - 11); g.closePath();
    g.fill({ color: c.hairColor, alpha: 0.9 });
  }
  g.circle(x, y - 9, 3); g.fill({ color: c.headColor, alpha: 0.9 });
  g.rect(x - 4, y - 11, 8, 2); g.fill({ color: 0x3344aa, alpha: 0.85 });
  g.rect(x - 2, y - 11, 4, 2); g.fill({ color: 0x888888, alpha: 0.8 });
  g.moveTo(x - 3, y - 8); g.lineTo(x - 1, y - 8);
  g.stroke({ width: 0.5, color: 0x886644, alpha: 0.5 });
  g.moveTo(x + 1, y - 8); g.lineTo(x + 3, y - 8);
  g.stroke({ width: 0.5, color: 0x886644, alpha: 0.5 });
  g.rect(x - 3, y - 6, 6, 7); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.moveTo(x - 1, y + 1); g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 1); g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
}

/** Draw Doraemon — blue round robot cat, white belly, bell */
function drawDoraemon(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.circle(x, y - 8, 5); g.fill({ color: c.hairColor, alpha: 0.95 });
  g.circle(x, y - 7, 3.5); g.fill({ color: 0xffffff, alpha: 0.95 });
  g.circle(x - 1.5, y - 9, 1.5); g.fill({ color: 0xffffff, alpha: 1 });
  g.circle(x + 1.5, y - 9, 1.5); g.fill({ color: 0xffffff, alpha: 1 });
  g.circle(x - 1, y - 9, 0.8); g.fill({ color: 0x111111, alpha: 1 });
  g.circle(x + 2, y - 9, 0.8); g.fill({ color: 0x111111, alpha: 1 });
  g.circle(x, y - 7, 1.2); g.fill({ color: 0xff2222, alpha: 0.9 });
  g.moveTo(x - 3, y - 7); g.lineTo(x - 6, y - 8);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  g.moveTo(x - 3, y - 6); g.lineTo(x - 6, y - 6);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  g.moveTo(x + 3, y - 7); g.lineTo(x + 6, y - 8);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  g.moveTo(x + 3, y - 6); g.lineTo(x + 6, y - 6);
  g.stroke({ width: 0.5, color: 0x333333, alpha: 0.5 });
  g.ellipse(x, y, 4, 5); g.fill({ color: c.bodyColor, alpha: 0.95 });
  g.stroke({ width: 1, color: c.hairColor, alpha: 0.8 });
  g.rect(x - 4, y - 3, 8, 2); g.fill({ color: 0xff2222, alpha: 0.85 });
  g.circle(x, y - 1, 1.5); g.fill({ color: 0xffd700, alpha: 0.9 });
  g.ellipse(x, y + 1, 2.5, 2); g.fill({ color: 0xffffff, alpha: 0.6 });
  g.stroke({ width: 0.5, color: c.hairColor, alpha: 0.5 });
  g.circle(x - 2.5 + leg * 0.5, y + 5, 2); g.fill({ color: 0xffffff, alpha: 0.9 });
  g.circle(x + 2.5 - leg * 0.5, y + 5, 2); g.fill({ color: 0xffffff, alpha: 0.9 });
}

/** Draw Baobao — bald man with sunglasses */
function drawBaobao(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.circle(x, y - 9, 3.5); g.fill({ color: c.headColor, alpha: 0.95 });
  g.circle(x - 1, y - 11, 1); g.fill({ color: 0xffffff, alpha: 0.3 });
  g.rect(x - 3, y - 10, 2.5, 2); g.fill({ color: 0x111111, alpha: 0.9 });
  g.rect(x + 0.5, y - 10, 2.5, 2); g.fill({ color: 0x111111, alpha: 0.9 });
  g.moveTo(x - 0.5, y - 9); g.lineTo(x + 0.5, y - 9);
  g.stroke({ width: 0.5, color: 0x111111, alpha: 0.8 });
  g.rect(x - 3, y - 5, 6, 7); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.moveTo(x - 1, y + 2); g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 2); g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x - 3, y - 3); g.lineTo(x - 5 + leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
  g.moveTo(x + 3, y - 3); g.lineTo(x + 5 - leg * 0.5, y);
  g.stroke({ width: 1.5, color: c.bodyColor, alpha: 0.7 });
}

/** Draw Goku — spiky black hair, orange gi, blue belt */
function drawGoku(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  for (let i = 0; i < 7; i++) {
    const sx = x - 5 + i * 1.8;
    const h = i === 3 ? 8 : i === 2 || i === 4 ? 6 : 4;
    g.moveTo(sx, y - 11); g.lineTo(sx + 0.9, y - 11 - h);
    g.lineTo(sx + 1.8, y - 11); g.closePath();
    g.fill({ color: c.hairColor, alpha: 0.9 });
  }
  g.circle(x, y - 9, 3); g.fill({ color: c.headColor, alpha: 0.9 });
  g.rect(x - 3, y - 6, 6, 7); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.rect(x - 3, y - 1, 6, 1.5); g.fill({ color: 0x2244cc, alpha: 0.85 });
  g.moveTo(x - 1, y + 1); g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 1); g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 1.5, color: c.pantsColor, alpha: 0.8 });
  g.rect(x - 3 + leg, y + 4, 3, 2); g.fill({ color: 0x2244cc, alpha: 0.7 });
  g.rect(x + 1 - leg, y + 4, 3, 2); g.fill({ color: 0x2244cc, alpha: 0.7 });
}

/** Draw Mario — red cap, mustache, blue overalls */
function drawMario(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.rect(x - 4, y - 13, 8, 3); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.rect(x - 5, y - 11, 10, 1.5); g.fill({ color: c.bodyColor, alpha: 0.85 });
  g.circle(x, y - 12, 1.5); g.fill({ color: 0xffffff, alpha: 0.8 });
  g.circle(x, y - 8, 3); g.fill({ color: c.headColor, alpha: 0.9 });
  g.ellipse(x, y - 7, 3, 1); g.fill({ color: c.hairColor, alpha: 0.9 });
  g.rect(x - 3, y - 5, 6, 7); g.fill({ color: c.pantsColor, alpha: 0.9 });
  g.rect(x - 4, y - 5, 1.5, 4); g.fill({ color: c.bodyColor, alpha: 0.8 });
  g.rect(x + 2.5, y - 5, 1.5, 4); g.fill({ color: c.bodyColor, alpha: 0.8 });
  g.circle(x - 1, y - 2, 0.8); g.fill({ color: 0xffd700, alpha: 0.9 });
  g.circle(x + 1, y - 2, 0.8); g.fill({ color: 0xffd700, alpha: 0.9 });
  g.moveTo(x - 1, y + 2); g.lineTo(x - 2 + leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 2); g.lineTo(x + 2 - leg, y + 5);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.circle(x - 2 + leg, y + 5, 1.5); g.fill({ color: 0x663311, alpha: 0.8 });
  g.circle(x + 2 - leg, y + 5, 1.5); g.fill({ color: 0x663311, alpha: 0.8 });
}

/** Draw Satoshi — mysterious hooded figure with glowing eyes */
function drawSatoshi(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.moveTo(x, y - 15); g.lineTo(x - 5, y - 7); g.lineTo(x + 5, y - 7); g.closePath();
  g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.circle(x, y - 8, 4); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.circle(x - 1.5, y - 9, 0.8); g.fill({ color: 0xf7931a, alpha: 0.9 });
  g.circle(x + 1.5, y - 9, 0.8); g.fill({ color: 0xf7931a, alpha: 0.9 });
  g.rect(x - 4, y - 5, 8, 8); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.circle(x, y - 1, 2); g.fill({ color: 0xf7931a, alpha: 0.6 });
  g.moveTo(x - 1, y + 3); g.lineTo(x - 2 + leg, y + 6);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x + 1, y + 3); g.lineTo(x + 2 - leg, y + 6);
  g.stroke({ width: 2, color: c.pantsColor, alpha: 0.8 });
}

/** Draw Pepe — green frog with smug expression */
function drawPepe(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.ellipse(x, y - 8, 5, 4); g.fill({ color: c.headColor, alpha: 0.95 });
  g.circle(x - 2, y - 10, 2.5); g.fill({ color: 0xffffff, alpha: 0.95 });
  g.circle(x + 2, y - 10, 2.5); g.fill({ color: 0xffffff, alpha: 0.95 });
  g.circle(x - 2, y - 9.5, 1); g.fill({ color: 0x111111, alpha: 0.9 });
  g.circle(x + 2, y - 9.5, 1); g.fill({ color: 0x111111, alpha: 0.9 });
  g.moveTo(x - 3, y - 6); g.quadraticCurveTo(x, y - 4, x + 3, y - 6);
  g.stroke({ width: 1, color: 0x2d8a35, alpha: 0.7 });
  g.ellipse(x, y, 3.5, 5); g.fill({ color: c.bodyColor, alpha: 0.9 });
  g.ellipse(x - 2.5 + leg * 0.5, y + 5, 2.5, 1); g.fill({ color: c.pantsColor, alpha: 0.8 });
  g.ellipse(x + 2.5 - leg * 0.5, y + 5, 2.5, 1); g.fill({ color: c.pantsColor, alpha: 0.8 });
}

/** Draw Conan — small kid with big glasses, bowtie, blue suit */
function drawConan(g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) {
  g.rect(x - 4, y - 13, 8, 3); g.fill({ color: c.hairColor, alpha: 0.9 });
  g.moveTo(x - 2, y - 13); g.lineTo(x - 1, y - 16); g.lineTo(x + 1, y - 13); g.closePath();
  g.fill({ color: c.hairColor, alpha: 0.9 });
  g.circle(x, y - 9, 3); g.fill({ color: c.headColor, alpha: 0.9 });
  g.circle(x - 2, y - 9, 2); g.stroke({ width: 0.8, color: 0x444444, alpha: 0.9 });
  g.circle(x + 2, y - 9, 2); g.stroke({ width: 0.8, color: 0x444444, alpha: 0.9 });
  g.circle(x - 2.5, y - 9.5, 0.5); g.fill({ color: 0xffffff, alpha: 0.4 });
  g.circle(x + 1.5, y - 9.5, 0.5); g.fill({ color: 0xffffff, alpha: 0.4 });
  g.rect(x - 3, y - 6, 6, 6); g.fill({ color: c.bodyColor, alpha: 0.9 });
  // Red bowtie
  g.moveTo(x, y - 5.5); g.lineTo(x - 2, y - 6.5); g.lineTo(x - 2, y - 4.5); g.closePath();
  g.fill({ color: 0xff2222, alpha: 0.85 });
  g.moveTo(x, y - 5.5); g.lineTo(x + 2, y - 6.5); g.lineTo(x + 2, y - 4.5); g.closePath();
  g.fill({ color: 0xff2222, alpha: 0.85 });
  g.rect(x - 2, y, 4, 2); g.fill({ color: c.pantsColor, alpha: 0.8 });
  g.moveTo(x - 1, y + 2); g.lineTo(x - 1.5 + leg, y + 5);
  g.stroke({ width: 1.5, color: c.headColor, alpha: 0.7 });
  g.moveTo(x + 1, y + 2); g.lineTo(x + 1.5 - leg, y + 5);
  g.stroke({ width: 1.5, color: c.headColor, alpha: 0.7 });
  g.rect(x - 2.5 + leg, y + 4, 2.5, 1.5); g.fill({ color: 0x222222, alpha: 0.8 });
  g.rect(x + 0.5 - leg, y + 4, 2.5, 1.5); g.fill({ color: 0x222222, alpha: 0.8 });
}

/** Map of special type → draw function for all celebrity NPCs */
export const CELEBRITY_DRAW_FNS: Record<string, (g: Graphics, x: number, y: number, c: CelebrityDef, leg: number) => void> = {
  tall: drawVitalik, normal: drawElon, pikachu: drawPikachu,
  luffy: drawLuffy, naruto: drawNaruto, doraemon: drawDoraemon, bald: drawBaobao,
  goku: drawGoku, mario: drawMario, satoshi: drawSatoshi, pepe: drawPepe, conan: drawConan,
};
