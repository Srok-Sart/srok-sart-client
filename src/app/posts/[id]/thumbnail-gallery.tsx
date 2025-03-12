import React from "react";
import Image from "next/image";

interface ThumbnailGalleryProps {
  imageUrls: string[];
  currentMediaIndex: number;
  setCurrentMediaIndex: (index: number) => void;
  isCurrentMediaVideo: (url: string) => boolean;
  getApiBaseUrl: () => string;
}

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({
  imageUrls,
  currentMediaIndex,
  setCurrentMediaIndex,
  isCurrentMediaVideo,
  getApiBaseUrl,
}) => {
  return (
    <div className='flex overflow-x-auto gap-2 p-3 bg-gray-100'>
      {imageUrls.map((url, index) => (
        <button
          key={index}
          onClick={() => setCurrentMediaIndex(index)}
          className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
            currentMediaIndex === index
              ? "border-blue-500 ring-2 ring-blue-300"
              : "border-transparent hover:border-gray-300"
          }`}
        >
          {isCurrentMediaVideo(url) ? (
            <div className='w-full h-full bg-gray-800 flex items-center justify-center text-white'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='white'
              >
                <path d='M8 5v14l11-7z' />
              </svg>
            </div>
          ) : (
            <Image
              src={getApiBaseUrl() + url}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className='w-full h-full object-cover'
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default ThumbnailGallery;
