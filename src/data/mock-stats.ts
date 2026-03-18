import type { NetworkStats } from "./types";

export const MOCK_NETWORK_STATS: NetworkStats = {
  blobsForged: 42_069,
  storageProviders: 16,
  storageTiB: 10,
  readLatencyMs: 12,
  aptosFinality: 0.9,
  aptosTPSMax: 160_000,
  gasFeesUSD: 0.001,
};
