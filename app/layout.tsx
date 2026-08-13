import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { VisualEditing } from "next-sanity/visual-editing";
import { stegaClean } from "next-sanity";
import { SanityLive } from "@/sanity/live";
import { sanityFetch } from "@/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
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

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export async function generateMetadata(): Promise<Metadata> {
  // The not-found page is prerendered at build time, so this must not throw
  // if Sanity is unreachable — fall back to the site defaults instead.
  let name = "Lili Sayce";
  let description: string | undefined;

  try {
    const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    name = stegaClean(settings?.name) || name;
    description = stegaClean(settings?.seoDescription) || undefined;
  } catch {
    // keep the defaults
  }

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: name, template: `%s | ${name}` },
    description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html lang="en" className={`${ibmPlexSerif.variable} ${inter.variable}`}>
      <body>
        {children}
        {/* Pushes published changes to the live site without a redeploy. */}
        <SanityLive />
        {/* Click-to-edit overlays, only inside Presentation mode. */}
        {isDraft && <VisualEditing />}
        <Analytics />
      </body>
    </html>
  );
}
