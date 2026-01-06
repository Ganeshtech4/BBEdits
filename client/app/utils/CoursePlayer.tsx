import React, { FC, useEffect, useState, useRef } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [isBunny, setIsBunny] = useState(false);
  const [bunnyEmbedUrl, setBunnyEmbedUrl] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoUrl) return;

    // Check if it's a Bunny.net URL
    const bunnyRegex = /(?:iframe\.)?mediadelivery\.net\/(?:embed|play)\/(\d+)\/([a-f0-9-]+)/i;
    const bunnyMatch = videoUrl.match(bunnyRegex);
    
    if (bunnyMatch) {
      setIsBunny(true);
      // If it's already an embed URL, use it directly; otherwise construct the embed URL
      if (videoUrl.includes('iframe.mediadelivery.net')) {
        setBunnyEmbedUrl(videoUrl);
      } else {
        const libraryId = bunnyMatch[1];
        const videoId = bunnyMatch[2];
        setBunnyEmbedUrl(`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`);
      }
      return;
    }

    // Check if it's a YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = videoUrl.match(youtubeRegex);
    
    if (match && match[1]) {
      setIsYouTube(true);
      setYoutubeVideoId(match[1]);
    } else {
      // VdoCipher video
      setIsYouTube(false);
      setIsBunny(false);
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/getVdoCipherOTP`, {
          videoId: videoUrl,
        })
        .then((res) => {
          setVideoData(res.data);
        })
        .catch((err) => {
          console.error("Failed to load video:", err);
        });
    }
  }, [videoUrl]);

  // Add security event listeners
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener('contextmenu', handleContextMenu as any);
      playerElement.addEventListener('dragstart', handleDragStart as any);
      playerElement.addEventListener('selectstart', handleSelectStart as any);
    }

    return () => {
      if (playerElement) {
        playerElement.removeEventListener('contextmenu', handleContextMenu as any);
        playerElement.removeEventListener('dragstart', handleDragStart as any);
        playerElement.removeEventListener('selectstart', handleSelectStart as any);
      }
    };
  }, []);

  return (
    <div
      ref={playerRef}
      style={{ 
        position: "relative", 
        paddingTop: "56.25%", 
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none"
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isBunny && bunnyEmbedUrl ? (
        <iframe
          src={`${bunnyEmbedUrl}?autoplay=false&preload=true&responsive=true`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
            pointerEvents: "auto"
          }}
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
      ) : isYouTube && youtubeVideoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&disablekb=1`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      ) : (
        videoData.otp && videoData.playbackInfo !== "" && (
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=3thUX4gz2Z2U5DvN`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allowFullScreen={true}
            allow="encrypted-media"
          ></iframe>
        )
      )}
      {/* Overlay to prevent inspect element on video */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
      ></div>
    </div>
  );
};

export default CoursePlayer;
