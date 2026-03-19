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
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLDivElement>(null);

  const initPlayer = useCallback(() => {
    if (playerRef.current) return;

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => createPlayer();
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (!iframeRef.current) return;
      playerRef.current = new (window as any).YT.Player(iframeRef.current, {
        height: "0",
        width: "0",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: () => {
            const videoData = playerRef.current?.getVideoData?.();
            if (videoData?.title) setTitle(videoData.title);
            playerRef.current?.playVideo();
            setPlaying(true);
          },
          onStateChange: () => {
            const videoData = playerRef.current?.getVideoData?.();
            if (videoData?.title) setTitle(videoData.title);
          },
        },
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) {
      initPlayer();
      return;
    }
    if (playing) {
      playerRef.current.pauseVideo();
      setPlaying(false);
    } else {
      playerRef.current.playVideo();
      setPlaying(true);
    }
  }, [playing, initPlayer]);

  return (
    <MusicContext.Provider value={{ playing, title, togglePlay }}>
      <div className="hidden">
        <div ref={iframeRef} />
      </div>
      {children}
    </MusicContext.Provider>
  );
}
