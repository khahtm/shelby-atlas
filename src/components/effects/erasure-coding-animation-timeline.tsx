"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { extend } from "@pixi/react";
import { Graphics, Container } from "pixi.js";
import gsap from "gsap";

extend({ Graphics, Container });

interface Point {
  x: number;
  y: number;
}

export interface ErasureCodingHandle {
  breakNode: (postIndex: number) => void;
}

interface ErasureCodingAnimationTimelineProps {
  guardPostPositions: Point[];
  centerX: number;
  centerY: number;
}

/** Animated erasure coding loop: data block splits into shards, survives attack, merges back */
export const ErasureCodingAnimationTimeline = forwardRef<
  ErasureCodingHandle,
  ErasureCodingAnimationTimelineProps
>(function ErasureCodingAnimationTimeline(
  { guardPostPositions, centerX, centerY },
  ref,
) {
  const containerRef = useRef<Container | null>(null);
  const shardRefs = useRef<(Graphics | null)[]>(Array(6).fill(null));
  const blockRef = useRef<Graphics | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const attackedRef = useRef<number>(-1);

  useImperativeHandle(ref, () => ({
    breakNode(postIndex: number) {
      attackedRef.current = postIndex;
      const shard = shardRefs.current[postIndex];
      if (shard) gsap.to(shard, { tint: 0xff2244, duration: 0.2 });
    },
  }));

  const drawBlock = useCallback((g: Graphics) => {
    g.clear();
    g.rect(-12, -12, 24, 24);
    g.fill({ color: 0x00f0ff, alpha: 0.9 });
    g.stroke({ width: 2, color: 0xffffff, alpha: 0.8 });
  }, []);

  const drawShard = useCallback((g: Graphics) => {
    g.clear();
    g.rect(-6, -6, 12, 12);
    g.fill({ color: 0x00e5ff, alpha: 0.85 });
    g.stroke({ width: 1, color: 0x80ffff, alpha: 0.6 });
  }, []);

  useEffect(() => {
    const block = blockRef.current;
    if (!block || guardPostPositions.length < 6) return;

    // Set initial state
    block.x = centerX;
    block.y = centerY - 40;
    block.alpha = 1;
    block.scale.set(1);

    shardRefs.current.forEach((s, i) => {
      if (!s) return;
      s.x = centerX;
      s.y = centerY;
      s.alpha = 0;
      s.scale.set(0.5);
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    tlRef.current = tl;

    // Step 1: block descends to center
    tl.to(block, { y: centerY, duration: 0.5, ease: "power2.in" });

    // Step 2: block fades, shards appear and fly to posts
    tl.to(block, { alpha: 0, scale: 0.3, duration: 0.3 }, "+=0.1");
    shardRefs.current.forEach((s, i) => {
      if (!s) return;
      const pos = guardPostPositions[i];
      tl.to(
        s,
        { alpha: 1, x: pos.x, y: pos.y, scale: 1, duration: 0.5, ease: "power2.out" },
        "<",
      );
    });

    // Step 3: random shard turns red (simulated attack)
    tl.call(() => {
      const idx = attackedRef.current >= 0 ? attackedRef.current : Math.floor(Math.random() * 6);
      const s = shardRefs.current[idx];
      if (s) gsap.to(s, { tint: 0xff2244, duration: 0.2 });
    }, [], "+=0.5");

    // Step 4: surviving shards fly back to center
    shardRefs.current.forEach((s, i) => {
      if (!s) return;
      tl.to(
        s,
        { x: centerX, y: centerY, duration: 0.4, ease: "power2.in" },
        "+=0.3",
      );
    });

    // Step 5: merge — block flashes white
    tl.call(() => {
      shardRefs.current.forEach((s) => { if (s) s.alpha = 0; });
      attackedRef.current = -1;
      if (block) {
        block.scale.set(1);
        block.y = centerY;
        block.alpha = 1;
        gsap.to(block, { tint: 0xffffff, duration: 0.1, yoyo: true, repeat: 1 });
      }
    }, [], "+=0.1");

    // Step 6: green success flash
    tl.to(block, { tint: 0x00ff88, duration: 0.15, yoyo: true, repeat: 1 }, "+=0.1");
    tl.to(block, { y: centerY - 40, duration: 0.4, ease: "power2.out" });

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [guardPostPositions, centerX, centerY]);

  return (
    <pixiContainer ref={containerRef}>
      <pixiGraphics ref={blockRef} draw={drawBlock} />
      {Array.from({ length: 6 }, (_, i) => (
        <pixiGraphics
          key={i}
          ref={(el) => { shardRefs.current[i] = el; }}
          draw={drawShard}
        />
      ))}
    </pixiContainer>
  );
});
