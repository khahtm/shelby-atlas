"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import { DISTRICT_MAP } from "@/src/data/district-metadata";

export interface AtlasState {
  activeDistrict: string | null;
  hoveredDistrict: string | null;
  cameraState: "overview" | "focused";
  exploredDistricts: string[];
}

export type AtlasAction =
  | { type: "SET_ACTIVE_DISTRICT"; id: string | null }
  | { type: "SET_HOVERED_DISTRICT"; id: string | null }
  | { type: "MARK_EXPLORED"; id: string }
  | { type: "SET_CAMERA_STATE"; state: "overview" | "focused" };

export const initialAtlasState: AtlasState = {
  activeDistrict: null,
  hoveredDistrict: null,
  cameraState: "overview",
  exploredDistricts: [],
};

export function atlasReducer(state: AtlasState, action: AtlasAction): AtlasState {
  switch (action.type) {
    case "SET_ACTIVE_DISTRICT":
      return {
        ...state,
        activeDistrict: action.id,
        cameraState: action.id ? "focused" : "overview",
      };
    case "SET_HOVERED_DISTRICT":
      return { ...state, hoveredDistrict: action.id };
    case "MARK_EXPLORED":
      // Only track valid district IDs
      if (!DISTRICT_MAP.has(action.id)) return state;
      if (state.exploredDistricts.includes(action.id)) return state;
      return {
        ...state,
        exploredDistricts: [...state.exploredDistricts, action.id],
      };
    case "SET_CAMERA_STATE":
      return { ...state, cameraState: action.state };
    default:
      return state;
  }
}

export const AtlasStateContext = createContext<AtlasState>(initialAtlasState);
export const AtlasDispatchContext = createContext<Dispatch<AtlasAction>>(() => {});

export function useAtlasState() {
  return useContext(AtlasStateContext);
}

export function useAtlasDispatch() {
  return useContext(AtlasDispatchContext);
}

export { useReducer };
