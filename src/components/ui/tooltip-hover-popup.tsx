"use client";

interface TooltipHoverPopupProps {
  text: string;
  visible: boolean;
  x: number;
  y: number;
}

/** Lightweight hover tooltip for canvas entities — pointer-events none */
export function TooltipHoverPopup({ text, visible, x, y }: TooltipHoverPopupProps) {
  return (
    <div
      className="font-mono-pixel"
      style={{
        position: "absolute",
        left: x + 12,
        top: y - 8,
        pointerEvents: "none",
        userSelect: "none",
        background: "rgba(10,14,26,0.88)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 4,
        padding: "4px 10px",
        color: "var(--text-primary)",
        fontSize: 14,
        whiteSpace: "nowrap",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        zIndex: 50,
      }}
    >
      {text}
    </div>
  );
}
