import React from "react";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";

interface MediaControlsProps {
  hasMultipleMedia: boolean;
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const MediaControls: React.FC<MediaControlsProps> = ({
  hasMultipleMedia,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onToggleFullscreen,
  isFullscreen,
}) => {
  return (
    <>
      {/* Navigation Controls */}
      {hasMultipleMedia && (
        <>
          <button
            onClick={onPrevious}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition focus:outline-none'
            aria-label='Previous image'
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={onNext}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition focus:outline-none'
            aria-label='Next image'
          >
            <FaChevronRight size={24} />
          </button>
        </>
      )}

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        className='absolute top-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition focus:outline-none'
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        <FaExpand size={18} />
      </button>

      {/* Media Counter */}
      {hasMultipleMedia && (
        <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'>
          {currentIndex + 1} / {totalCount}
        </div>
      )}
    </>
  );
};

export default MediaControls;
