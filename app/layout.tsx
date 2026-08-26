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

export const metadata: Metadata = {
  title: data.metadata.title,
  description: data.metadata.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
