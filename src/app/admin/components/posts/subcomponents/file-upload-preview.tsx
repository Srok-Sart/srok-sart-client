import { FaTrashAlt, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { FileOrUrl } from '@/app/interfaces/post';
import Image from 'next/image';

interface FilePreviewProps {
  file: FileOrUrl;
  onRemove: () => void;
  onView: () => void;
}

export const FilePreview = ({ file, onRemove, onView }: FilePreviewProps) => {
  const [fileSize, setFileSize] = useState<string>("Loading size...");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Initialize as null instead of empty string
  const fileName =
    file instanceof File ? file.name : file.split("/").pop() || "Unknown";

  useEffect(() => {
    // Get the image URL
    if (file instanceof File) {
      setImageUrl(URL.createObjectURL(file));
    } else if (typeof file === 'string' && file) { // Check if file is a non-empty string
      setImageUrl(file.startsWith("http") ? file : `${process.env.NEXT_PUBLIC_API_URL || ''}${file}`);
    } else {
      // If file is invalid, set to placeholder or null
      setImageUrl('/placeholder-image.jpg');
    }

    // Get the file size
    const fetchFileSize = async () => {
      if (file instanceof File) {
        setFileSize(`${(file.size / 1024).toFixed(2)} KB`);
        return;
      }

      if (typeof file !== 'string' || !file) {
        setFileSize("Size unavailable");
        return;
      }

      try {
        const url = file.startsWith("http")
          ? file
          : `${process.env.NEXT_PUBLIC_API_URL || ''}${file}`;
        const response = await fetch(url, { method: "HEAD" });
        const size = response.headers.get("content-length");
        if (size) {
          const sizeInKB = (parseInt(size) / 1024).toFixed(2);
          setFileSize(`${sizeInKB} KB`);
        } else {
          setFileSize("Size unknown");
        }
      } catch (error) {
        console.error("Error fetching file size:", error);
        setFileSize("Size unavailable");
      }
    };

    fetchFileSize();

    // Clean up URL objects to avoid memory leaks
    return () => {
      if (file instanceof File && imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file]);

  // Don't render the Image component if imageUrl is null
  return (
    <div className='relative group border rounded-md overflow-hidden bg-white'>
      {/* Image preview */}
      <div className='relative h-36 w-full'>
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={fileName}
            fill
            className='object-cover'
            onError={() => setImageUrl('/placeholder-image.jpg')} // Fallback for invalid images
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      {/* File info overlay - appears on hover */}
      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 transform translate-y-0 transition-transform duration-200'>
        <div className='text-sm font-medium truncate'>{fileName}</div>
        <div className='text-xs text-gray-300'>{fileSize}</div>
      </div>
      
      {/* Action buttons overlay - appears on hover */}
      <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200'>
        <button
          type='button'
          onClick={onView}
          className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full mx-1 transition-colors duration-200'
          title="View image"
        >
          <FaSearch />
        </button>
        <button
          type='button'
          onClick={onRemove}
          className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full mx-1 transition-colors duration-200'
          title="Remove image"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};