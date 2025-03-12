import React, { useState } from "react";
import { Post } from "@/app/interfaces/post";
import ThumbnailGallery from "./thumbnail-gallery";
import MediaDisplay from "./media-display";
import MediaControls from "./media-controls";

interface MediaGalleryProps {
  post: Post;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === post.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? post.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Check if current media is a video
  const isCurrentMediaVideo = (url: string) => {
    return (
      url.endsWith(".webm") || url.endsWith(".mp4") || url.endsWith(".mov")
    );
  };

  // Get the base API URL
  const getApiBaseUrl = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 bg-black flex items-center justify-center"
          : "flex-1"
      }`}
    >
      <div
        className={`relative ${
          isFullscreen
            ? "w-full h-full"
            : "bg-white rounded-xl overflow-hidden shadow-lg"
        }`}
      >
        {/* Main Media Display */}
        <div className='relative w-full h-full'>
          <MediaDisplay
            url={post.imageUrls[currentMediaIndex]}
            title={post.title}
            index={currentMediaIndex}
            isFullscreen={isFullscreen}
            isVideo={isCurrentMediaVideo(post.imageUrls[currentMediaIndex])}
            getApiBaseUrl={getApiBaseUrl}
          />

          <MediaControls
            hasMultipleMedia={post.imageUrls.length > 1}
            currentIndex={currentMediaIndex}
            totalCount={post.imageUrls.length}
            onPrevious={prevMedia}
            onNext={nextMedia}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>

        {/* Thumbnail Gallery */}
        {!isFullscreen && post.imageUrls.length > 1 && (
          <ThumbnailGallery
            imageUrls={post.imageUrls}
            currentMediaIndex={currentMediaIndex}
            setCurrentMediaIndex={setCurrentMediaIndex}
            isCurrentMediaVideo={isCurrentMediaVideo}
            getApiBaseUrl={getApiBaseUrl}
          />
        )}
      </div>

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className='absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full z-50'
          aria-label='Close fullscreen'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='white'
          >
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MediaGallery;
