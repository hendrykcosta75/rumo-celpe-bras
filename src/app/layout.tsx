import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const display = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = { metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3920") };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f4ee" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = (await headers()).get("x-lang") === "es" ? "es" : "en";
  return (
    <html lang={lang} className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
