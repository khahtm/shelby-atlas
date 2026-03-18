"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { extend, useTick } from "@pixi/react";
import { Graphics, Sprite, Text, TextStyle, Texture, Assets } from "pixi.js";
import { toScreen } from "@/src/utils/isometric-helpers";

extend({ Graphics, Sprite, Text });

/** Place the statue between Docks and Workshop — open area at (12,20) */
const STATUE_POS = toScreen(12, 20);

/** Large Aptos logo statue using the real logo image */
export function AmbientAptosLogoStatueLandmark() {
  const gfxRef = useRef<Graphics | null>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const glowRef = useRef(0);
  const [logoTexture, setLogoTexture] = useState<Texture | null>(null);

  // Load the logo texture properly via Assets
  useEffect(() => {
    Assets.load("/aptos-logo.png").then((tex: Texture) => {
      setLogoTexture(tex);
    });
  }, []);

  useTick((ticker) => {
    glowRef.current += ticker.deltaTime * 0.02;
    const glow = Math.sin(glowRef.current) * 0.5 + 0.5;

    // Pulse the glow ring
    const g = gfxRef.current;
    if (g) {
      g.clear();
      const x = STATUE_POS.x;
      const y = STATUE_POS.y;
      const logoY = y - 100;

      // Outer glow behind the logo
      g.circle(x, logoY, 72);
      g.fill({ color: 0x4fc1e9, alpha: 0.03 + glow * 0.04 });

      // Pedestal
      const pw = 50;
      const pd = 24;
      const ph = 16;
      // Top
      g.moveTo(x, y - pd);
      g.lineTo(x + pw, y);
      g.lineTo(x, y + pd);
      g.lineTo(x - pw, y);
      g.closePath();
      g.fill({ color: 0x1a1a2a, alpha: 0.95 });
      g.stroke({ width: 2, color: 0x4fc1e9, alpha: 0.4 + glow * 0.2 });
      // Right face
      g.moveTo(x + pw, y);
      g.lineTo(x + pw, y + ph);
      g.lineTo(x, y + pd + ph);
      g.lineTo(x, y + pd);
      g.closePath();
      g.fill({ color: 0x0f0f1a, alpha: 0.95 });
      // Left face
      g.moveTo(x - pw, y);
      g.lineTo(x - pw, y + ph);
      g.lineTo(x, y + pd + ph);
      g.lineTo(x, y + pd);
      g.closePath();
      g.fill({ color: 0x0a0a14, alpha: 0.95 });

      // Support pole
      g.rect(x - 3, y - pd, 6, -55);
      g.fill({ color: 0x1a1a30, alpha: 0.9 });
      g.stroke({ width: 1, color: 0x4fc1e9, alpha: 0.3 });

      // Ground glow
      g.ellipse(x, y + pd + ph + 4, 55, 18);
      g.fill({ color: 0x4fc1e9, alpha: 0.04 + glow * 0.03 });
    }

    // Pulse the sprite brightness
    const sp = spriteRef.current;
    if (sp) {
      sp.alpha = 0.85 + glow * 0.15;
    }
  });

  const initDraw = useCallback((g: Graphics) => {
    gfxRef.current = g;
    g.clear();
  }, []);

  const labelStyle = new TextStyle({
    fontFamily: "VT323, monospace",
    fontSize: 20,
    fill: "#4fc1e9",
    align: "center",
  });

  return (
    <>
      <pixiGraphics draw={initDraw} ref={gfxRef} />
      {logoTexture && (
        <pixiSprite
          ref={(node: Sprite | null) => { spriteRef.current = node; }}
          texture={logoTexture}
          anchor={0.5}
          x={STATUE_POS.x}
          y={STATUE_POS.y - 100}
          width={112}
          height={112}
        />
      )}
      <pixiText
        text="APTOS"
        style={labelStyle}
        anchor={0.5}
        x={STATUE_POS.x}
        y={STATUE_POS.y + 48}
      />
    </>
  );
}
