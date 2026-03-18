"use client";

import { useEffect, useCallback } from "react";
import { useAtlasState, useAtlasDispatch } from "@/src/stores/atlas-store";
import { InfoPanelContentFurnace } from "./info-panel-content-furnace";
import { InfoPanelContentFiberHighway } from "./info-panel-content-fiber-highway";
import { InfoPanelContentMintDistrict } from "./info-panel-content-mint-district";
import { InfoPanelContentWatchtowerDistrict } from "./info-panel-content-watchtower-district";
import { InfoPanelContentDocksDistrict } from "./info-panel-content-docks-district";
import { InfoPanelContentWorkshopDistrict } from "./info-panel-content-workshop-district";
import { InfoPanelContentHallOfFameDistrict } from "./info-panel-content-hall-of-fame-district";

/** Resolve which district content component to render based on active district id */
function DistrictContent({ districtId }: { districtId: string }) {
  if (districtId === "furnace") return <InfoPanelContentFurnace />;
  if (districtId === "fiber-highway") return <InfoPanelContentFiberHighway />;
  if (districtId === "mint" || districtId.startsWith("mint-")) return <InfoPanelContentMintDistrict />;
  if (districtId === "watchtower") return <InfoPanelContentWatchtowerDistrict />;
  if (districtId === "docks" || districtId.startsWith("docks-")) return <InfoPanelContentDocksDistrict />;
  if (districtId === "workshop") return <InfoPanelContentWorkshopDistrict />;
  if (districtId === "hall-of-fame") return <InfoPanelContentHallOfFameDistrict />;
  return null;
}

/**
 * Glassmorphism slide-in panel — fixed right, routes to district-specific content.
 * Keeps ESC key listener and translateX slide transition from original implementation.
 */
export function InfoPanelDistrictOverlay() {
  const { activeDistrict } = useAtlasState();
  const dispatch = useAtlasDispatch();

  const close = useCallback(() => {
    dispatch({ type: "SET_ACTIVE_DISTRICT", id: null });
  }, [dispatch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const isOpen = !!activeDistrict;
  const isWorkshop = activeDistrict === "workshop";

  return (
    <div
      className="fixed top-0 right-0 h-full z-40 overflow-y-auto"
      style={{
        width: isWorkshop ? "380px" : "360px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid var(--glass-border)",
        borderRadius: "12px 0 0 12px",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s ease",
      }}
    >
      {/* Close button — 28×28, bg-card, rounded-[2px] */}
      <button
        onClick={close}
        className="absolute top-8 right-8 flex items-center justify-center bg-[var(--bg-card)] rounded-[2px] font-body text-[14px] text-[var(--text-muted)] cursor-pointer border-0 transition-colors duration-200 hover:text-[var(--cyan)]"
        style={{ width: 28, height: 28 }}
        aria-label="Close panel"
      >
        ✕
      </button>

      {/* District-specific content with shared padding */}
      {activeDistrict && (
        <div className="p-8">
          <DistrictContent districtId={activeDistrict} />
        </div>
      )}
    </div>
  );
}
