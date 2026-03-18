"use client";

import { useCallback } from "react";
import { useAtlasDispatch, useAtlasState } from "@/src/stores/atlas-store";
import { DISTRICT_MAP } from "@/src/data/district-metadata";
import { toScreen } from "@/src/utils/isometric-helpers";

/** Camera control hook — reads state and provides flyTo/reset actions */
export function useCamera() {
  const { cameraState, activeDistrict } = useAtlasState();
  const dispatch = useAtlasDispatch();

  const flyTo = useCallback(
    (districtId: string) => {
      dispatch({ type: "SET_ACTIVE_DISTRICT", id: districtId });
      dispatch({ type: "MARK_EXPLORED", id: districtId });
    },
    [dispatch],
  );

  const resetCamera = useCallback(() => {
    dispatch({ type: "SET_ACTIVE_DISTRICT", id: null });
  }, [dispatch]);

  // Compute target position for the active district
  const target = activeDistrict
    ? (() => {
        const meta = DISTRICT_MAP.get(activeDistrict);
        if (!meta) return null;
        return toScreen(meta.gridPosition.col, meta.gridPosition.row);
      })()
    : null;

  return { cameraState, activeDistrict, target, flyTo, resetCamera };
}
