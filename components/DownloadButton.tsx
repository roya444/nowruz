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
      className="px-6 py-3 bg-spring text-white rounded-xl font-semibold shadow-md hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span> Exporting...
        </>
      ) : (
        <>📥 Download PNG</>
      )}
    </button>
  );
}
