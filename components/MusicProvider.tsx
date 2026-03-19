"use client";

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";

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
  const pendingPlayRef = useRef(false);
  const iframeRef = useRef<HTMLDivElement>(null);

  const initPlayer = useCallback(() => {
    if (playerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (!win.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      win.onYouTubeIframeAPIReady = () => createPlayer();
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (!iframeRef.current) return;
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
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              playerRef.current?.playVideo();
              setPlaying(true);
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            const videoData = playerRef.current?.getVideoData?.();
            if (videoData?.title) setTitle(videoData.title);
            // Sync state with actual player
            if (event.data === 1) setPlaying(true);
            else if (event.data === 2) setPlaying(false);
          },
        },
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) {
      pendingPlayRef.current = true;
      initPlayer();
      return;
    }
    if (!readyRef.current) {
      pendingPlayRef.current = true;
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = playerRef.current.getPlayerState?.();
    if (state === 1) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [initPlayer]);

  return (
    <MusicContext.Provider value={{ playing, title, togglePlay }}>
      <div className="hidden">
        <div ref={iframeRef} />
      </div>
      {children}
    </MusicContext.Provider>
  );
}
