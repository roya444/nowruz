"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserSelection } from "@/lib/types";
import SofrehPreview from "@/components/SofrehPreview";
import DownloadButton from "@/components/DownloadButton";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import MusicPlayer from "@/components/MusicPlayer";

export default function ViewPage() {
  const router = useRouter();
  const sofrehRef = useRef<HTMLDivElement>(null);
  const [selections, setSelections] = useState<UserSelection[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sofrehSelections");
    if (stored) {
      setSelections(JSON.parse(stored));
      setLoaded(true);
    } else {
      router.push("/build");
    }
  }, [router]);

  if (!loaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading your sofreh...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F4637] relative overflow-hidden">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,160,8,0) 0%, rgba(255,160,8,0.2) 100%)",
        }}
      />

      {/* Noise texture overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" aria-hidden="true">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="5"
            numOctaves="1"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 0.984  0 0 0 0 0.878  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="relative z-10">
        <NavBar variant="dark" />

        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-[family-name:var(--font-space-mono)] font-bold text-2xl md:text-4xl text-[#FFFBF0] mb-2 tracking-[0.08em]">
              YOUR HAFTSiN
            </h1>
            <p className="font-[family-name:var(--font-space-mono)] text-[13px] text-white/50">
              Nowruz Mobarak! Here is your personalized Haftsin table.
            </p>
          </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 overflow-x-auto flex justify-center"
        >
          <div ref={sofrehRef} className="w-full">
            <SofrehPreview selections={selections} showPhotoFrames />
          </div>
        </motion.div>

        <div className="max-w-xs mx-auto mb-6">
          <MusicPlayer />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <DownloadButton targetRef={sofrehRef} />
          <Link
            href="/build"
            className="px-6 py-3 bg-[#FFFBF0] text-[#0F4637] rounded-[24px] font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFF8E8] transition-colors"
          >
            START OVER
          </Link>
        </motion.div>
        </div>
      </div>
    </main>
  );
}
