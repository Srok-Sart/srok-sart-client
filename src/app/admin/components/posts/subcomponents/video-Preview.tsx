import React, { useEffect, useState } from 'react';

interface VideoPreviewProps {
  src: string;
  onClose: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ src, onClose }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Handle different types of sources
    if (src.startsWith('blob:')) {
      // For blob URLs, verify they are valid
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          if (xhr.status === 200) {
            // Create a new blob URL that we control in this component
            const validBlob = new Blob([xhr.response], { type: 'video/mp4' });
            const newBlobUrl = URL.createObjectURL(validBlob);
            setVideoUrl(newBlobUrl);
          } else {
            console.error('Failed to fetch blob:', xhr.statusText);
            setError(true);
          }
        };
        xhr.onerror = () => {
          console.error('Blob URL is invalid or inaccessible');
          setError(true);
        };
        xhr.send();
      } catch (e) {
        console.error('Error accessing blob URL:', e);
        setError(true);
      }
    } else if (src.startsWith('http') || src.startsWith('/')) {
      // For regular URLs or server paths
      setVideoUrl(src);
    } else {
      console.error('Unsupported video source format');
      setError(true);
    }

    // Clean up when component unmounts
    return () => {
      if (videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [src]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
        >
          ×
        </button>
        <div className="p-2">
          {error ? (
            <div className="flex items-center justify-center h-64 bg-gray-100 text-red-500">
              Error loading video. The file may be unavailable or in an unsupported format.
            </div>
          ) : !videoUrl ? (
            <div className="flex items-center justify-center h-64 bg-gray-100">
              Loading video...
            </div>
          ) : (
            <video 
              src={videoUrl} 
              className="w-full" 
              controls 
              autoPlay 
              controlsList="nodownload"
              onError={() => setError(true)}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;