"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { NetworkStats, ShelbyDataProvider } from "@/src/data/types";
import { MockDataProvider } from "@/src/data/providers/mock-data-provider";

const DataProviderContext = createContext<ShelbyDataProvider>(new MockDataProvider());

export const DataProviderProvider = DataProviderContext.Provider;

/** Hook to access the current data provider */
export function useDataProvider() {
  return useContext(DataProviderContext);
}

/** Hook to fetch and cache network stats from the active provider */
export function useNetworkStats() {
  const provider = useDataProvider();
  const [stats, setStats] = useState<NetworkStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    provider.getNetworkStats().then((data) => {
      if (!cancelled) setStats(data);
    });
    return () => { cancelled = true; };
  }, [provider]);

  return stats;
}
