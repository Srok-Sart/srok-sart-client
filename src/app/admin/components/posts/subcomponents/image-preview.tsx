import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ImagePreviewProps {
  src: string;
  onClose: () => void;
}

export const ImagePreview = ({ src, onClose }: ImagePreviewProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  // Make sure we have a valid URL format
  const imageUrl = src.startsWith("http") || src.startsWith("blob:") 
    ? src 
    : `${process.env.NEXT_PUBLIC_API_URL || ""}${src}`;

  // Close when clicking escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle clicks on the backdrop to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 bg-white rounded-full p-2 z-10"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        
        {/* Image container */}
        <div className="flex items-center justify-center h-full w-full overflow-auto">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {/* Using a regular img tag for the preview instead of Next.js Image component */}
          <img
            src={imageUrl}
            alt="Image preview"
            className="max-w-full max-h-[80vh] object-contain"
            onLoad={() => setLoading(false)}
            onError={(e) => {
              setLoading(false);
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
};