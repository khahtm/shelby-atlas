"use client";

import { type ReactNode } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

/** Wraps children with the Aptos wallet adapter provider */
export function AptosWalletProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: Network.MAINNET }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
