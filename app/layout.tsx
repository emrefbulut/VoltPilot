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
  description: "Open-source energy flexibility MVP for EV charging, flexible building loads, and demand-response analytics.",
  applicationName: flexgridCopy.brand.name,
  keywords: [
    "energy flexibility",
    "demand response",
    "smart charging",
    "EV charging",
    "building energy",
    "power systems",
    "Turkey"
  ],
  category: "technology",
  openGraph: {
    title: flexgridCopy.brand.name,
    description: "Open-source energy flexibility MVP for EV charging, flexible building loads, and demand-response analytics.",
    siteName: flexgridCopy.brand.name,
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: flexgridCopy.brand.name,
    description: "Open-source energy flexibility MVP for EV charging, flexible building loads, and demand-response analytics."
  }
};

export const viewport: Viewport = {
  themeColor: "#0d1663",
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
