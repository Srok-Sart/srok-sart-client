import React, { useEffect, useRef, useState } from "react";

interface VideoPreviewProps {
  src: string;
  onClose: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ src, onClose }) => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVertical, setIsVertical] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);

    // Clean up previous blob URL if it exists
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    // Handle different types of sources
    if (src.startsWith("blob:")) {
      // For blob URLs, use directly without re-fetching
      setVideoUrl(src);
      setLoading(false);
    } else if (src.startsWith("http") || src.startsWith("/")) {
      // For regular URLs or server paths
      const fullUrl = src.startsWith("http") 
        ? src 
        : `${process.env.NEXT_PUBLIC_API_URL || ""}${src}`;
      setVideoUrl(fullUrl);
      setLoading(false);
    } else {
      console.error("Unsupported video source format");
      setError(true);
      setLoading(false);
    }

    // Handle ESC key for closing
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Clean up when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [src, onClose]);

  // Detect video orientation when metadata is loaded
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setIsVertical(videoHeight > videoWidth);
      setLoading(false);
    }
  };

  // Handle backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className='fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4'
      onClick={handleBackdropClick}
    >
      <div className='relative max-w-4xl max-h-[90vh] w-full bg-black rounded-lg overflow-hidden'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity'
        >
          ×
        </button>
        <div className='flex items-center justify-center w-full h-full'>
          {error ? (
            <div className='flex items-center justify-center p-8 text-red-500 bg-black bg-opacity-50'>
              Error loading video. The file may be unavailable or in an
              unsupported format.
            </div>
          ) : loading ? (
            <div className='flex items-center justify-center p-8 bg-black bg-opacity-50'>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${
                isVertical ? "h-full" : "w-full"
              }`}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                className={
                  isVertical
                    ? "h-full max-h-[80vh] w-auto"
                    : "w-full max-w-full h-auto"
                }
                controls
                autoPlay
                controlsList='nodownload'
                onLoadedMetadata={handleMetadataLoaded}
                onError={() => {
                  console.error("Error loading video:", videoUrl);
                  setError(true);
                  setLoading(false);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;