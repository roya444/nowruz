"use client";

import { useMusic } from "./MusicProvider";

export default function MusicPlayer() {
  const { playing, title, togglePlay } = useMusic();

  return (
    <div className="mb-4">
      <p className="font-[family-name:var(--font-space-mono)] text-[11px] text-[#FFFBF0] mb-2 italic">
        Enjoy some persian music while you design!
      </p>
      <button
        onClick={togglePlay}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#FFFBF0]/10 hover:bg-[#FFFBF0]/15 transition-colors w-full"
      >
        <span className="w-8 h-8 rounded-full bg-[#FFFBF0] flex items-center justify-center flex-shrink-0">
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#0F4637">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#0F4637">
              <path d="M4 2l10 6-10 6V2z" />
            </svg>
          )}
        </span>
        <span className="font-[family-name:var(--font-space-mono)] text-[12px] text-[#FFFBF0] truncate text-left">
          {title ?? "Persian Music"}
        </span>
        {playing && (
          <span className="flex gap-[2px] items-end ml-auto flex-shrink-0">
            <span className="w-[3px] h-[8px] bg-[#FFFBF0]/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
            <span className="w-[3px] h-[12px] bg-[#FFFBF0]/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.15s]" />
            <span className="w-[3px] h-[6px] bg-[#FFFBF0]/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.3s]" />
          </span>
        )}
      </button>
    </div>
  );
}
