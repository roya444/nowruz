"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from "react";

interface MusicContextValue {
  playing: boolean;
  title: string | null;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  playing: false,
  title: null,
  togglePlay: () => {},
});

export const useMusic = () => useContext(MusicContext);

const YOUTUBE_VIDEO_ID = "HXvdra4wG0Y";

export default function MusicProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const iframeRef = useRef<HTMLDivElement>(null);

  // Pre-initialize the YouTube player on mount so it's ready when user taps
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    function createPlayer() {
      if (!iframeRef.current || playerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playerRef.current = new (window as any).YT.Player(iframeRef.current, {
        height: "0",
        width: "0",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            const videoData = playerRef.current?.getVideoData?.();
            if (videoData?.title) setTitle(videoData.title);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            const videoData = playerRef.current?.getVideoData?.();
            if (videoData?.title) setTitle(videoData.title);
            if (event.data === 1) setPlaying(true);
            else if (event.data === 2) setPlaying(false);
          },
        },
      });
    }

    if (!win.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      win.onYouTubeIframeAPIReady = () => createPlayer();
    } else {
      createPlayer();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !readyRef.current) {
      // Player not ready yet — nothing we can do, user will need to tap again
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = playerRef.current.getPlayerState?.();
    if (state === 1) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, []);

  return (
    <MusicContext.Provider value={{ playing, title, togglePlay }}>
      <div className="hidden">
        <div ref={iframeRef} />
      </div>
      {children}
    </MusicContext.Provider>
  );
}
