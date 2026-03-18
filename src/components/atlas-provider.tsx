"use client";

import { useReducer, type ReactNode } from "react";
import {
  AtlasStateContext,
  AtlasDispatchContext,
  atlasReducer,
  initialAtlasState,
} from "@/src/stores/atlas-store";
import { DataProviderProvider } from "@/src/hooks/use-atlas-data";
import { MockDataProvider } from "@/src/data/providers/mock-data-provider";
import { useExplorationSync } from "@/src/hooks/use-exploration";

const mockProvider = new MockDataProvider();

function ExplorationSyncer({ children }: { children: ReactNode }) {
  useExplorationSync();
  return <>{children}</>;
}

/** Top-level provider combining atlas state + data provider */
export function AtlasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(atlasReducer, initialAtlasState);

  return (
    <AtlasStateContext.Provider value={state}>
      <AtlasDispatchContext.Provider value={dispatch}>
        <DataProviderProvider value={mockProvider}>
          <ExplorationSyncer>{children}</ExplorationSyncer>
        </DataProviderProvider>
      </AtlasDispatchContext.Provider>
    </AtlasStateContext.Provider>
  );
}
