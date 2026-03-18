"use client";

/** Persistent map controls hint — always visible in bottom-left corner */
export function MapControlsHintBottomLeft() {
  return (
    <div
      className="fixed bottom-6 left-6 z-20 flex flex-col gap-1.5 font-mono text-[10px] tracking-[1px] select-none pointer-events-none"
      style={{ color: "var(--text-muted)", opacity: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>DRAG</kbd>
        <span>Pan</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>SCROLL</kbd>
        <span>Zoom</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>CLICK</kbd>
        <span>Explore district</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>ESC</kbd>
        <span>Back to overview</span>
      </div>
    </div>
  );
}
