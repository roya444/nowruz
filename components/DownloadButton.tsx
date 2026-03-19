"use client";

import { RefObject, useCallback, useState } from "react";
import { exportToPng } from "@/lib/exportHelper";

interface DownloadButtonProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export default function DownloadButton({ targetRef }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await exportToPng(targetRef.current);
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // On mobile, use share API so user can "Save Image" to Photos
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
      if (isMobile && typeof navigator.share === "function") {
        const file = new File([blob], "my-haftsin.png", { type: "image/png" });
        await navigator.share({ files: [file] });
      } else {
        const link = document.createElement("a");
        link.download = "my-haftsin.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        console.error("Failed to export image:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [targetRef]);

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="text-[#FFFBF0] font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em] hover:underline transition-all disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? (
        <span className="font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em]">EXPORTiNG...</span>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>DOWNLOAD</span>
        </>
      )}
    </button>
  );
}
