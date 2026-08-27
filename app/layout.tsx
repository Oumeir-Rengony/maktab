import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";

import pageData from "@/data/data.json";
import type { SiteData } from "@/lib/types";
import "./globals.css";

const data = pageData as SiteData;

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const siteUrl = new URL(data.metadata.canonicalUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: data.metadata.title,
    template: `%s | ${data.brand.name}`,
  },
  description: data.metadata.description,
  applicationName: data.brand.name,
  keywords: data.metadata.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: data.metadata.locale,
    url: "/",
    siteName: data.brand.name,
    title: data.metadata.title,
    description: data.metadata.description,
    images: [
      {
        url: "/logo.png",
        width: 466,
        height: 591,
        alt: data.metadata.logoAlt,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: data.metadata.title,
    description: data.metadata.description,
    images: ["/logo.png"],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
