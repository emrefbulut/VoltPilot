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
  description: flexgridCopy.brand.title,
  applicationName: flexgridCopy.brand.name,
  keywords: [
    "enerji esnekliği",
    "talep yanıtı",
    "akıllı şarj",
    "EV şarjı",
    "bina enerjisi",
    "telemetri doğrulama",
    "trafo yüklenmesi",
    "güç sistemleri",
    "Türkiye"
  ],
  category: "technology",
  openGraph: {
    title: flexgridCopy.brand.name,
    description: flexgridCopy.brand.title,
    siteName: flexgridCopy.brand.name,
    locale: "tr_TR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: flexgridCopy.brand.name,
    description: flexgridCopy.brand.title
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
    <html lang="tr" suppressHydrationWarning>
      <body className={`${manrope.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
