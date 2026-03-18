"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Application, extend, useApplication } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";
import gsap from "gsap";
import { WORLD_W, WORLD_H, toScreen } from "@/src/utils/isometric-helpers";
import { DISTRICT_MAP, DISTRICTS } from "@/src/data/district-metadata";
import { useAtlasState } from "@/src/stores/atlas-store";
import { GroundPlane } from "./ground-plane";
import { CSS3DWrapper } from "./css-3d-wrapper";
import { FurnaceDistrict } from "@/src/components/districts/furnace-district";
import { FiberHighwayDistrict } from "@/src/components/districts/fiber-highway-district";
import { MintMarketplaceDistrict } from "@/src/components/districts/mint-marketplace-district";
import { WatchtowerSecurityDistrict } from "@/src/components/districts/watchtower-security-district";
import { DocksHarborCrosschainDistrict } from "@/src/components/districts/docks-harbor-crosschain-district";
import { WorkshopDeveloperToolsDistrict } from "@/src/components/districts/workshop-developer-tools-district";
import { HallOfFameTrophyMuseumDistrict } from "@/src/components/districts/hall-of-fame-trophy-museum-district";
import { DistrictConnectionPaths } from "@/src/components/effects/district-connection-paths";
import { AmbientIsometricBuildingsAndTrees } from "@/src/components/ambient/ambient-isometric-buildings-and-trees";
import { AmbientNeonVehiclesMovingOnPaths } from "@/src/components/ambient/ambient-neon-vehicles-moving-on-paths";
import { AmbientNeonHelicoptersFlyingAroundAtlas } from "@/src/components/ambient/ambient-neon-helicopters-flying-around-atlas";
import { AmbientBlimpWithBannerCrossingAtlas } from "@/src/components/ambient/ambient-blimp-with-banner-crossing-atlas";
import { AmbientCelebrityNpcsWalkingRandomly } from "@/src/components/ambient/ambient-celebrity-npcs-walking-randomly";
import { AmbientAptosLogoStatueLandmark } from "@/src/components/ambient/ambient-aptos-logo-statue-landmark";
import { AmbientCityStreetLampsAndFurniture } from "@/src/components/ambient/ambient-city-street-lamps-and-furniture";
import { AmbientPixelPedestriansWalkingOnPaths } from "@/src/components/ambient/ambient-pixel-pedestrians-walking-on-paths";

extend({ Container, Graphics });

const BG_COLOR = 0x0a0e1a;

/** Centroid of all districts — used as the overview camera center */
const OVERVIEW_CENTER = (() => {
  const positions = DISTRICTS.map((d) => toScreen(d.gridPosition.col, d.gridPosition.row));
  const cx = positions.reduce((s, p) => s + p.x, 0) / positions.length;
  const cy = positions.reduce((s, p) => s + p.y, 0) / positions.length;
  return { x: cx, y: cy };
})();

/** Shared viewport ref for camera fly-in/out from parent */
let sharedViewport: Viewport | null = null;
export function getSharedViewport() {
  return sharedViewport;
}

/** Inner component with access to useApplication() */
function SceneContent({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const { app } = useApplication();
  const viewportRef = useRef<Viewport | null>(null);
  const containerRef = useRef<Container | null>(null);
  const { activeDistrict, cameraState } = useAtlasState();
  const flyTweenRef = useRef<gsap.core.Timeline | null>(null);

  // Setup viewport
  useEffect(() => {
    if (!app || !app.stage || viewportRef.current) return;

    const viewport = new Viewport({
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      worldWidth: WORLD_W,
      worldHeight: WORLD_H,
      events: app.renderer.events,
    });

    viewport.drag().pinch().wheel().clampZoom({ minScale: 0.4, maxScale: 4 });
    viewport.moveCenter(OVERVIEW_CENTER.x, OVERVIEW_CENTER.y);
    viewport.setZoom(0.7);

    app.stage.addChild(viewport);
    viewportRef.current = viewport;
    sharedViewport = viewport;

    if (containerRef.current) {
      viewport.addChild(containerRef.current);
    }

    const handleResize = () => {
      viewport.screenWidth = window.innerWidth;
      viewport.screenHeight = window.innerHeight;
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      sharedViewport = null;
      if (viewportRef.current) {
        app.stage.removeChild(viewportRef.current);
        viewportRef.current.destroy();
        viewportRef.current = null;
      }
    };
  }, [app]);

  // Camera fly-in/out on activeDistrict change
  useEffect(() => {
    const viewport = viewportRef.current;
    const wrapper = wrapperRef.current;
    if (!viewport || !wrapper) return;

    // Kill any in-progress animation
    if (flyTweenRef.current) {
      flyTweenRef.current.kill();
      flyTweenRef.current = null;
    }

    if (activeDistrict && cameraState === "focused") {
      // Resolve target — handle sub-districts like "mint-pay-per-view" or "docks-aptos"
      const baseId = activeDistrict.split("-")[0] === "mint" && activeDistrict !== "mint"
        ? "mint"
        : activeDistrict.split("-")[0] === "docks" && activeDistrict !== "docks"
        ? "docks"
        : activeDistrict;
      const meta = DISTRICT_MAP.get(baseId) ?? DISTRICT_MAP.get(activeDistrict);
      if (!meta) return;

      const target = toScreen(meta.gridPosition.col, meta.gridPosition.row);
      const tl = gsap.timeline();
      tl.to(viewport, {
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => {
          /* viewport animates via moveCenter in onStart */
        },
        onStart: () => {
          viewport.animate({ position: { x: target.x, y: target.y }, scale: 2.5, time: 800 });
        },
      }, 0);
      tl.to(wrapper, { rotateX: -12, duration: 0.8, ease: "power2.inOut" }, 0);
      flyTweenRef.current = tl;
    } else {
      // Fly out to overview
      const tl = gsap.timeline();
      tl.to(wrapper, { rotateX: 0, duration: 0.6, ease: "power2.inOut" }, 0);
      // Reset viewport zoom
      viewport.animate({
        position: { x: OVERVIEW_CENTER.x, y: OVERVIEW_CENTER.y },
        scale: 0.7,
        time: 600,
      });
      flyTweenRef.current = tl;
    }
  }, [activeDistrict, cameraState, wrapperRef]);

  const handleContainerRef = useCallback(
    (container: Container | null) => {
      containerRef.current = container;
      if (container && viewportRef.current) {
        viewportRef.current.addChild(container);
      }
    },
    [],
  );

  return (
    <pixiContainer ref={handleContainerRef}>
      <GroundPlane />
      <AmbientIsometricBuildingsAndTrees />
      <DistrictConnectionPaths />
      <AmbientNeonVehiclesMovingOnPaths />
      <AmbientCityStreetLampsAndFurniture />
      <AmbientPixelPedestriansWalkingOnPaths />
      <AmbientCelebrityNpcsWalkingRandomly />
      <AmbientAptosLogoStatueLandmark />
      <FurnaceDistrict />
      <FiberHighwayDistrict />
      <MintMarketplaceDistrict />
      <WatchtowerSecurityDistrict />
      <DocksHarborCrosschainDistrict />
      <WorkshopDeveloperToolsDistrict />
      <HallOfFameTrophyMuseumDistrict />
      <AmbientNeonHelicoptersFlyingAroundAtlas />
      <AmbientBlimpWithBannerCrossingAtlas />
    </pixiContainer>
  );
}

interface AtlasSceneProps {
  onReady?: () => void;
}

/** Main PixiJS canvas scene — renders isometric world with pixi-viewport */
export default function AtlasScene({ onReady }: AtlasSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleInit = useCallback(() => { onReady?.(); }, [onReady]);

  if (!mounted) return null;

  return (
    <CSS3DWrapper ref={wrapperRef}>
      <Application
        background={BG_COLOR}
        resizeTo={typeof window !== "undefined" ? window : undefined}
        antialias={false}
        roundPixels={true}
        onInit={handleInit}
      >
        <SceneContent wrapperRef={wrapperRef} />
      </Application>
    </CSS3DWrapper>
  );
}
