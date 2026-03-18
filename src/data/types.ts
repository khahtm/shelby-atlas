export interface ShelbyDataProvider {
  getBlobCount(): Promise<number>;
  getReadLatency(): Promise<number>;
  getProviderCount(): Promise<number>;
  getStorageCapacity(): Promise<number>;
  getNetworkStats(): Promise<NetworkStats>;
}

export interface NetworkStats {
  blobsForged: number;
  storageProviders: number;
  storageTiB: number;
  readLatencyMs: number;
  aptosFinality: number;
  aptosTPSMax: number;
  gasFeesUSD: number;
}

export interface DistrictMeta {
  id: string;
  name: string;
  gridPosition: { col: number; row: number };
  color: string;
  accentColor: string;
  description: string;
  pillar: string;
}
