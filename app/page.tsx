"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { AtlasProvider } from "@/src/components/atlas-provider";
import { AptosWalletProviderWrapper } from "@/src/components/aptos-wallet-provider-wrapper";
import { LoadingScreen } from "@/src/components/ui/loading-screen";
import { NavBarTopHeader } from "@/src/components/ui/nav-bar-top-header";
import { ExplorationHudProgressTracker } from "@/src/components/ui/exploration-hud-progress-tracker";
import { InfoPanelDistrictOverlay } from "@/src/components/ui/info-panel-district-overlay";
import { DistrictHoverTooltipOverlay } from "@/src/components/ui/district-hover-tooltip-overlay";
import { OnboardingStepByStepTourOverlay } from "@/src/components/ui/onboarding-step-by-step-tour-overlay";
import { MapControlsHintBottomLeft } from "@/src/components/ui/map-controls-hint-bottom-left";

const AtlasScene = dynamic(
  () => import("@/src/components/canvas/atlas-scene"),
  { ssr: false },
);

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <AptosWalletProviderWrapper>
    <AtlasProvider>
      <main className="h-screen w-screen overflow-hidden bg-[var(--bg-deep)]">
        <LoadingScreen isReady={isReady} />
        <AtlasScene onReady={handleReady} />
        <NavBarTopHeader />
        <ExplorationHudProgressTracker />
        <InfoPanelDistrictOverlay />
        <DistrictHoverTooltipOverlay />
        <OnboardingStepByStepTourOverlay />
        <MapControlsHintBottomLeft />
      </main>
    </AtlasProvider>
    </AptosWalletProviderWrapper>
  );
}
