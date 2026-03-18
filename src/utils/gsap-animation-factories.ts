/** GSAP timeline factory functions for district transitions and animations */
import gsap from "gsap";

interface ViewportLike {
  x: number;
  y: number;
  scale: { x: number; y: number };
  moveCenter: (x: number, y: number) => void;
  setZoom: (zoom: number, center?: boolean) => void;
}

/** Fly camera into a district: zoom in, tilt wrapper for dramatic effect */
export function createFlyInTimeline(
  viewport: ViewportLike,
  wrapperEl: HTMLElement,
  targetX: number,
  targetY: number,
): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.to(
    viewport,
    {
      duration: 0.8,
      ease: "power2.inOut",
      onStart: () => {
        viewport.moveCenter(targetX, targetY);
        viewport.setZoom(2.5, true);
      },
    },
    0,
  );
  tl.to(
    wrapperEl,
    {
      rotateX: -12,
      duration: 0.8,
      ease: "power2.inOut",
    },
    0,
  );
  return tl;
}

/** Fly camera out to overview: reset zoom and tilt */
export function createFlyOutTimeline(
  viewport: ViewportLike,
  wrapperEl: HTMLElement,
): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.to(
    viewport,
    {
      duration: 0.8,
      ease: "power2.inOut",
      onStart: () => {
        viewport.setZoom(0.8, true);
      },
    },
    0,
  );
  tl.to(
    wrapperEl,
    {
      rotateX: 0,
      duration: 0.8,
      ease: "power2.inOut",
    },
    0,
  );
  return tl;
}

/** Animate a numeric property counting from `from` to `to` */
export function createCounterAnimation(
  obj: Record<string, number>,
  prop: string,
  from: number,
  to: number,
  duration: number,
): gsap.core.Tween {
  obj[prop] = from;
  return gsap.to(obj, { [prop]: to, duration, ease: "power1.out" });
}
