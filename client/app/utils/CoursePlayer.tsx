import React, { FC, useEffect, useState, useRef } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
  title: string;
};

const iframeStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: 0,
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [isBunny, setIsBunny] = useState(false);
  const [bunnyEmbedUrl, setBunnyEmbedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset all state when the video URL changes to avoid stale content / white screen
    setIsLoading(true);
    setVideoData({ otp: "", playbackInfo: "" });
    setIsYouTube(false);
    setYoutubeVideoId("");
    setIsBunny(false);
    setBunnyEmbedUrl("");

    if (!videoUrl) {
      setIsLoading(false);
      return;
    }

    // Bunny.net
    const bunnyRegex = /(?:iframe\.)?mediadelivery\.net\/(?:embed|play)\/(\d+)\/([a-f0-9-]+)/i;
    const bunnyMatch = videoUrl.match(bunnyRegex);
    if (bunnyMatch) {
      const embedUrl = videoUrl.includes("iframe.mediadelivery.net")
        ? videoUrl
        : `https://iframe.mediadelivery.net/embed/${bunnyMatch[1]}/${bunnyMatch[2]}`;
      setBunnyEmbedUrl(embedUrl);
      setIsBunny(true);
      // isLoading cleared by onLoad
      return;
    }

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const ytMatch = videoUrl.match(youtubeRegex);
    if (ytMatch && ytMatch[1]) {
      setYoutubeVideoId(ytMatch[1]);
      setIsYouTube(true);
      // isLoading cleared by onLoad
      return;
    }

    // VdoCipher
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/getVdoCipherOTP`, {
        videoId: videoUrl,
      })
      .then((res) => {
        setVideoData(res.data);
        // isLoading cleared by onLoad
      })
      .catch((err) => {
        console.error("Failed to load video:", err);
        setIsLoading(false);
      });
  }, [videoUrl]);

  // Security: block context-menu / drag / select on the player wrapper
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const el = playerRef.current;
    if (!el) return;
    el.addEventListener("contextmenu", prevent);
    el.addEventListener("dragstart", prevent);
    el.addEventListener("selectstart", prevent);
    return () => {
      el.removeEventListener("contextmenu", prevent);
      el.removeEventListener("dragstart", prevent);
      el.removeEventListener("selectstart", prevent);
    };
  }, []);

  return (
    <div
      ref={playerRef}
      style={{
        position: "relative",
        paddingTop: "56.25%",
        overflow: "hidden",
        // Black background prevents white flash while the iframe loads
        backgroundColor: "#000",
        // Force GPU compositing layer — fixes iOS Safari blank/white rendering
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none" as any,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Loading skeleton shown until the iframe fires onLoad */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <div style={{ textAlign: "center", color: "#666" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #333",
                borderTop: "3px solid #7c3aed",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 13 }}>Loading video…</span>
          </div>
        </div>
      )}

      {isBunny && bunnyEmbedUrl ? (
        <iframe
          key={bunnyEmbedUrl}
          // NOTE: No `sandbox` attribute — iOS Safari blocks MSE/EME inside sandboxed iframes,
          //       which prevents Bunny's player from initialising at all.
          // NOTE: No `referrerPolicy="no-referrer"` — Bunny CDN needs the origin header to
          //       validate the embed token; stripping it causes auth failures on iOS.
          src={`${bunnyEmbedUrl}?autoplay=false&preload=true&responsive=true`}
          style={iframeStyle}
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          onLoad={() => setIsLoading(false)}
        />
      ) : isYouTube && youtubeVideoId ? (
        <iframe
          key={youtubeVideoId}
          // playsinline=1 is required for iOS — without it Safari opens a native full-screen
          // player and the embed appears blank until the user taps
          src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&disablekb=1&playsinline=1`}
          style={iframeStyle}
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={() => setIsLoading(false)}
        />
      ) : videoData.otp && videoData.playbackInfo ? (
        <iframe
          key={videoData.otp}
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=3thUX4gz2Z2U5DvN`}
          style={iframeStyle}
          allowFullScreen={true}
          allow="encrypted-media; fullscreen"
          onLoad={() => setIsLoading(false)}
        />
      ) : null}
    </div>
  );
};

export default CoursePlayer;
