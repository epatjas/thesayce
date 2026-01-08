import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lili Sayce | Innovation Consultant",
  description: "I create protected spaces where good ideas can survive long enough to prove themselves.",
  openGraph: {
    title: "Lili Sayce | Innovation Consultant",
    description: "I create protected spaces where good ideas can survive long enough to prove themselves.",
    type: "website",
    images: [
      {
        url: "/images/share.png",
        width: 1200,
        height: 630,
        alt: "Lili Sayce - Innovation Consultant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lili Sayce | Innovation Consultant",
    description: "I create protected spaces where good ideas can survive long enough to prove themselves.",
    images: ["/images/share.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSerif.variable} ${inter.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
