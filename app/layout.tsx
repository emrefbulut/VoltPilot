import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { flexgridCopy } from "@/src/content/flexgrid-copy";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: flexgridCopy.brand.name,
    template: `%s | ${flexgridCopy.brand.name}`
  },
  description: "Hybrid-ready energy flexibility cockpit for EV charging, transformer loading, and telemetry validation.",
  applicationName: flexgridCopy.brand.name,
  keywords: [
    "energy flexibility",
    "demand response",
    "smart charging",
    "EV charging",
    "building energy",
    "telemetry validation",
    "transformer loading",
    "power systems",
    "Turkey"
  ],
  category: "technology",
  openGraph: {
    title: flexgridCopy.brand.name,
    description: "Hybrid-ready energy flexibility cockpit for EV charging, transformer loading, and telemetry validation.",
    siteName: flexgridCopy.brand.name,
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: flexgridCopy.brand.name,
    description: "Hybrid-ready energy flexibility cockpit for EV charging, transformer loading, and telemetry validation."
  }
};

export const viewport: Viewport = {
  themeColor: "#064e3b",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
