import type { Metadata } from "next";
import { Press_Start_2P, VT323, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono-pixel",
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shelby Atlas — Explore the Protocol City",
  description:
    "Explore Shelby Protocol as a living neon city. 7 interactive districts: The Furnace, Fiber Highway, The Mint, Watchtower, The Docks, Workshop, and Hall of Fame. Connect your Aptos wallet and discover the ecosystem.",
  metadataBase: new URL("https://atlas.shelby.xyz"),
  openGraph: {
    title: "Shelby Atlas — Explore the Protocol City",
    description: "A living neon city built on Aptos. Explore 7 districts, connect your wallet, and discover the Shelby ecosystem.",
    images: [{ url: "/og-image.jpg", width: 1568, height: 784 }],
    type: "website",
    siteName: "Shelby Atlas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelby Atlas — Explore the Protocol City",
    description: "A living neon city built on Aptos. 7 districts to explore. Connect wallet. Discover Shelby.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
