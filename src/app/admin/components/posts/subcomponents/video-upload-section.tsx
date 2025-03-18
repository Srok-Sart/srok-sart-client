import { FileOrUrl } from "@/app/interfaces/post";
import React, { useState } from "react";
import {
  FaExclamationTriangle,
  FaPlay,
  FaTrash,
  FaVideo,
} from "react-icons/fa";

interface VideoUploadSectionProps {
  videos: FileOrUrl[];
  errors?: Record<string, string>;
  onVideosChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: (index: number) => void;
  onVideoView: (video: FileOrUrl) => void;
  existingVideoUrl?: string | null;
  newVideos?: File[];
}

export const VideoUploadSection = ({
  videos,
  errors = {},
  onVideosChange,
  onRemoveVideo,
  onVideoView,
  existingVideoUrl,
  newVideos = [],
}: VideoUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);

  // Maximum file size (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // Helper function to get file name
  const getFileName = (file: FileOrUrl): string => {
    if (file instanceof File) return file.name;
    if (typeof file === "string") {
      const parts = file.split("/");
      return parts[parts.length - 1] || "Video";
    }
    return "Video";
  };

  // Helper function to get file size
  const getFileSize = (file: FileOrUrl): string => {
    if (file instanceof File) {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB < 1
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${sizeInMB.toFixed(1)} MB`;
    }
    return "1.9 MB"; // Default size for existing videos
  };

  // Check if file is too large
  const isFileTooLarge = (file: File): boolean => {
    return file.size > MAX_FILE_SIZE;
  };

  // Handle file change with loading indicator and size validation
  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSizeWarning(null);

      const file = e.target.files[0];

      // Check file size
      if (isFileTooLarge(file)) {
        setSizeWarning(
          `File size (${(file.size / (1024 * 1024)).toFixed(
            2
          )} MB) exceeds the maximum allowed size (5 MB)`
        );
        return;
      }

      setIsUploading(true);
      // Minor delay to show loading state
      setTimeout(() => {
        onVideosChange(e);
        setIsUploading(false);
      }, 300);
    } else {
      onVideosChange(e);
    }
  };

  // Custom video play function that uses the correct source URL
  const handlePlayVideo = (video: FileOrUrl) => {
    // If we have an existing video URL for URLs, use that
    if (typeof video === "string" && existingVideoUrl) {
      onVideoView(existingVideoUrl);
    } else {
      onVideoView(video);
    }
  };

  // Determine which video to display
  // Priority: 1. New video files, 2. Existing videos from the server
  const displayVideos = newVideos.length > 0 ? newVideos : videos;

  return (
    <div className='mb-6 space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>
          Video <span className='text-red-500'>*</span>
        </h3>
        <div
          className={`border-2 border-dashed ${
            errors.videos || sizeWarning ? "border-red-500" : "border-gray-300"
          } p-6 rounded-lg text-center`}
        >
          <input
            type='file'
            id='videos-upload'
            className='hidden'
            onChange={handleVideosChange}
            accept='video/*'
          />
          <label
            htmlFor='videos-upload'
            className={`cursor-pointer ${
              isUploading ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
            } text-white px-4 py-2 rounded inline-flex items-center justify-center transition duration-200`}
          >
            <FaVideo className='mr-2' />
            {isUploading ? "Processing..." : "Upload Video"}
          </label>
          <p className='mt-2 text-gray-500'>
            Upload a video to showcase your project (only one video allowed)
          </p>
          <p className='mt-1 text-gray-400 text-xs'>
            Supported formats: MP4, WebM, MOV, OGG (max 5MB)
          </p>
          {errors.videos && (
            <p className='text-red-500 text-sm mt-1'>{errors.videos}</p>
          )}
          {sizeWarning && (
            <div className='mt-2 text-red-500 text-sm flex items-center justify-center'>
              <FaExclamationTriangle className='mr-2' />
              {sizeWarning}
            </div>
          )}
        </div>

        {displayVideos.length > 0 && (
          <div className='mt-4'>
            <h4 className='font-medium mb-2'>Uploaded Video:</h4>
            <div className='grid grid-cols-1 gap-3'>
              {displayVideos.map((video, index) => (
                <div
                  key={index}
                  className='relative group border rounded-md overflow-hidden bg-gray-800 shadow-md'
                >
                  {/* Video preview card */}
                  <div className='p-3 h-36 flex flex-col items-center justify-center text-center'>
                    <FaVideo className='text-blue-400 text-3xl mb-2' />
                    <div className='text-white text-sm truncate w-full'>
                      {getFileName(video)}
                    </div>
                    <div className='text-gray-400 text-xs mt-1'>
                      {getFileSize(video)}
                    </div>
                  </div>

                  {/* Overlay actions */}
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200'>
                    <button
                      type='button'
                      onClick={() => handlePlayVideo(video)}
                      className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full mx-1 transition-colors duration-200'
                      title='Play video'
                    >
                      <FaPlay />
                    </button>
                    <button
                      type='button'
                      onClick={() => onRemoveVideo(index)}
                      className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full mx-1 transition-colors duration-200'
                      title='Remove video'
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploadSection;
