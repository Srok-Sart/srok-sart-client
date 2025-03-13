import React from "react";
import Image from "next/image";

interface MediaDisplayProps {
  url: string;
  title?: string;
  index: number;
  isFullscreen: boolean;
  isVideo: boolean;
  getApiBaseUrl: () => string;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  url,
  title,
  index,
  isFullscreen,
  isVideo,
  getApiBaseUrl,
}) => {
  const fullUrl = getApiBaseUrl() + url;

  if (isVideo) {
    return (
      <video
        src={fullUrl}
        controls
        autoPlay={isFullscreen}
        className={`${
          isFullscreen
            ? "max-h-screen w-auto max-w-full mx-auto"
            : "w-full h-auto max-h-[600px] object-contain"
        }`}
      />
    );
  }

  return (
    <div
      className={`relative ${
        isFullscreen ? "h-screen flex items-center justify-center" : "h-[500px]"
      }`}
    >
      <Image
        src={fullUrl}
        alt={`${title || "Post media"} ${index + 1}`}
        fill={!isFullscreen}
        width={isFullscreen ? 1200 : undefined}
        height={isFullscreen ? 800 : undefined}
        className={`${
          isFullscreen
            ? "max-h-screen max-w-full h-auto w-auto object-contain"
            : "object-contain"
        }`}
        priority
      />
    </div>
  );
};

export default MediaDisplay;
