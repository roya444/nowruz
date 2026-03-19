"use client";

import { toPng } from "html-to-image";
import { RefObject, useCallback, useState } from "react";

interface DownloadButtonProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export default function DownloadButton({ targetRef }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#FFFBF0",
      });
      const link = document.createElement("a");
      link.download = "my-haftsin.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setLoading(false);
    }
  }, [targetRef]);

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-6 py-3 bg-[#FFFBF0] text-[#0F4637] rounded-[24px] font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFF8E8] transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? (
        <span className="font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em]">EXPORTiNG...</span>
      ) : (
        <span>DOWNLOAD PNG</span>
      )}
    </button>
  );
}
