import type React from "react";
import type { Metadata } from "next";
import { Inter, Reenie_Beanie } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/app-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const reenieBeanie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-reenie",
});

export const metadata: Metadata = {
  title: "StreetARTists - Empowering Street Artists Worldwide",
  description:
    "Join thousands of street artists showcasing their work, tracking income, and gaining global visibility on the premier street art platform.",
  keywords: "street art, graffiti, urban art, artists, marketplace, auctions",
  authors: [{ name: "StreetARTists" }],
  openGraph: {
    title: "StreetARTists - Where Street Art Meets Digital Canvas",
    description:
      "Discover and collect unique street art from talented artists around the world",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.variable} ${reenieBeanie.variable} font-sans`}
        cz-shortcut-listen="true"
      >
        <AppProvider>
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
