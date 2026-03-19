"use client";

import { toPng } from "html-to-image";
import { RefObject, useCallback, useState, useEffect } from "react";

interface ShareButtonProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export default function ShareButton({ targetRef }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [canShare, setCanShare] = useState(false);

  // Check share support on mount (needs to be client-side)
  useEffect(() => {
    if (navigator.share && navigator.canShare) {
      const testFile = new File(["test"], "test.png", { type: "image/png" });
      setCanShare(navigator.canShare({ files: [testFile] }));
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#FFFBF0",
      });
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
      className="px-6 py-3 bg-[#FFFBF0] text-[#0F4637] rounded-[24px] font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFF8E8] transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? "SHARiNG..." : "SHARE"}
    </button>
  );
}
