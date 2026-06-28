import type { Metadata } from "next";
// Next font removed temporarily due to network restrictions during build

export const metadata: Metadata = {
  title: {
    template: "%s | SER",
    default: "SER | Premium Luxury Fashion",
  },
  description: "Discover the latest premium fashion collections at SER.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "SER | Premium Luxury Fashion",
    description: "Discover the latest premium fashion collections at SER.",
    url: "/",
    siteName: "SER",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SER | Premium Luxury Fashion",
    description: "Discover the latest premium fashion collections at SER.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const dynamic = "force-dynamic";

import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { GlobalBanner } from "@/components/layout/GlobalBanner";

import "./globals.css";
import { GlobalProviders } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <GlobalProviders>
          <GlobalBanner />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </GlobalProviders>
      </body>
    </html>
  );
}
