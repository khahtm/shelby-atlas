import type { NetworkStats, ShelbyDataProvider } from "../types";
import { MOCK_NETWORK_STATS } from "../mock-stats";

export class MockDataProvider implements ShelbyDataProvider {
  async getBlobCount(): Promise<number> {
    return MOCK_NETWORK_STATS.blobsForged;
  }

  async getReadLatency(): Promise<number> {
    return MOCK_NETWORK_STATS.readLatencyMs;
  }

  async getProviderCount(): Promise<number> {
    return MOCK_NETWORK_STATS.storageProviders;
  }

  async getStorageCapacity(): Promise<number> {
    return MOCK_NETWORK_STATS.storageTiB;
  }

  async getNetworkStats(): Promise<NetworkStats> {
    return { ...MOCK_NETWORK_STATS };
  }
}
