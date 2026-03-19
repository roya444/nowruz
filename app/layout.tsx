import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import MusicProvider from "@/components/MusicProvider";

const soiglat = localFont({
  src: "./fonts/Soiglat-Regular.ttf",
  variable: "--font-soiglat",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["700"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nowruz — Interactive Haftsin Builder",
  description:
    "Learn about Nowruz and build your own digital Haftsin table",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${soiglat.variable} ${spaceMono.variable} ${notoSansArabic.variable} antialiased`}
      >
        <MusicProvider>{children}</MusicProvider>
      </body>
    </html>
  );
}
