"use client";

import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <img
        src="/flowers-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at -6% 41%, rgba(24,49,32,0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 105% 110%, rgba(147,75,58,0.6) 0%, transparent 50%)
          `,
        }}
      />

      {/* Diamond vignette overlay */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(ellipse at 50% 54%, rgba(0,0,0,0.56) 0%, rgba(51,51,51,0.28) 30%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <NavBar variant="light" />

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center mt-4 sm:mt-16 md:mt-24 gap-0 sm:gap-6 md:gap-11 px-4 sm:px-8 md:px-[110px]">
          <h1 className="font-[family-name:var(--font-soiglat)] text-[80px] sm:text-[110px] md:text-[160px] min-[900px]:text-[200px] lg:text-[300px] leading-[0.85] text-white">
            Nowruz
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 font-[family-name:var(--font-space-mono)] text-[14px] sm:text-[20px] md:text-[32px] text-white text-center">
            <span className="font-[family-name:var(--font-noto-arabic)]">
              نوروز
            </span>
            <span>•</span>
            <span>/no-ROOZ/</span>
            <span>•</span>
            <span>meaning &ldquo;New Day&rdquo;</span>
          </div>
        </div>

        {/* Bottom section with gradient backdrop */}
        <div
          className="relative pt-10 sm:pt-32 md:pt-40"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.6) 100%)",
          }}
        >
          <div className="flex flex-col min-[900px]:flex-row items-center min-[900px]:items-center gap-6 min-[900px]:gap-[100px] pb-10 sm:pb-14 min-[900px]:pb-[60px] px-4 min-[900px]:px-[100px] justify-center">
            <p className="font-[family-name:var(--font-space-mono)] text-[16px] sm:text-[16px] min-[900px]:text-[20px] text-white leading-[22px] sm:leading-[28px] text-center min-[900px]:text-justify max-w-[650px]">
              Celebrate this ancient holiday by building your own digital{" "}
              <strong>
                Haftsin{" "}
                <span className="font-[family-name:var(--font-noto-arabic)]">
                  هفت سین
                </span>{" "}
                /haft-SEEN/
              </strong>{" "}
              — a traditional spread of symbolic items, each
              representing a hope for the new year.
            </p>
            <Link
              href="/build"
              className="flex items-center gap-16 px-10 py-4 bg-[#1B6B54] text-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] shrink-0 hover:bg-[#237a62] transition-colors"
            >
              <span className="font-[family-name:var(--font-space-mono)] font-bold text-[14px] sm:text-[18px] md:text-[24px] tracking-[0.08em] whitespace-nowrap">
                BERiM, LET&apos;S GO!
              </span>
              <span className="text-[22px] sm:text-[26px] md:text-[32px]">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
