"use client";

import { useEffect } from "react";
import { useAtlasDispatch, useAtlasState } from "@/src/stores/atlas-store";

const STORAGE_KEY = "shelby-atlas-explored";

/** Syncs explored districts with localStorage for persistence across sessions */
export function useExplorationSync() {
  const { exploredDistricts } = useAtlasState();
  const dispatch = useAtlasDispatch();

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        ids.forEach((id) => dispatch({ type: "MARK_EXPLORED", id }));
      }
    } catch {
      // ignore corrupted data
    }
  }, [dispatch]);

  // Save to localStorage on change
  useEffect(() => {
    if (exploredDistricts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exploredDistricts));
    }
  }, [exploredDistricts]);
}
