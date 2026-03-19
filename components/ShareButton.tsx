"use client";

import { RefObject, useCallback, useState, useEffect } from "react";
import { exportToPng } from "@/lib/exportHelper";

interface ShareButtonProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export default function ShareButton({ targetRef }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [canShare, setCanShare] = useState(false);

  // Check share support on mount (needs to be client-side)
  useEffect(() => {
    if (typeof navigator.share === "function" && typeof navigator.canShare === "function") {
      const testFile = new File(["test"], "test.png", { type: "image/png" });
      setCanShare(navigator.canShare({ files: [testFile] }));
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await exportToPng(targetRef.current);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "my-haftsin.png", { type: "image/png" });

      await navigator.share({
        title: "My Haftsin — Nowruz Pirooz!",
        text: "Check out my personalized Haftsin table for Nowruz!",
        files: [file],
      });
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [targetRef]);

  if (!canShare) return null;

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="px-6 py-3 bg-[#FFFBF0] text-[#0F4637] rounded-[24px] font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFF8E8] transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      {loading ? "SHARiNG..." : "SHARE"}
    </button>
  );
}
