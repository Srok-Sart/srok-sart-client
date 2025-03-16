import { FileOrUrl } from '@/app/interfaces/post';
import { useState, useEffect, useRef } from 'react';

export const useFileUpload = () => {
  // Image state
  const [images, setImages] = useState<FileOrUrl[]>([]);
  const [thumbnail, setThumbnail] = useState<FileOrUrl | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Video state
  const [videos, setVideos] = useState<FileOrUrl[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Refs to store blob URLs for cleanup
  const blobUrlsRef = useRef<string[]>([]);

  // Create URL for image files with proper tracking for cleanup
  const createImageUrl = (image: FileOrUrl) => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      blobUrlsRef.current.push(url); // Track for cleanup
      return url;
    }
    
    if (typeof image === 'string') {
      return image.startsWith('http') ? 
        image : 
        `${process.env.NEXT_PUBLIC_API_URL || ''}${image}`;
    }
    
    return null;
  };

  // Create URL for video files with proper tracking for cleanup
  const createVideoUrl = (video: FileOrUrl) => {
    if (video instanceof File) {
      const url = URL.createObjectURL(video);
      blobUrlsRef.current.push(url); // Track for cleanup
      return url;
    }
    
    if (typeof video === 'string') {
      return video.startsWith('http') ? 
        video : 
        `${process.env.NEXT_PUBLIC_API_URL || ''}${video}`;
    }
    
    return null;
  };

  // Handle image view
  const handleImageView = (image: FileOrUrl) => {
    const url = createImageUrl(image);
    if (url) setSelectedImage(url);
  };

  // Handle thumbnail view
  const handleThumbnailView = () => {
    if (thumbnail) {
      const url = createImageUrl(thumbnail);
      if (url) setSelectedImage(url);
    }
  };

  // Handle video view
  const handleVideoView = (video: FileOrUrl) => {
    const url = createVideoUrl(video);
    if (url) setSelectedVideo(url);
  };

  // Clean up blob URLs on unmount or when they're no longer needed
  useEffect(() => {
    return () => {
      // Revoke all tracked blob URLs
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Failed to revoke URL:', e);
        }
      });
      blobUrlsRef.current = [];
    };
  }, []);

  // Handle image selection changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and append to existing images
      const newImages = Array.from(files);
      setImages(prev => [...prev, ...newImages]);
      
      // Preload the images to ensure they're valid
      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          // This ensures the file is readable
          console.log(`File ${file.name} loaded successfully`);
        };
        reader.onerror = () => {
          console.error(`File ${file.name} failed to load`);
          // Remove invalid file from images array
          setImages(prev => prev.filter(img => img !== file));
        };
        reader.readAsArrayBuffer(file);
      });
    }
  };

  // Handle video selection changes with validation
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and append to existing videos
      const newVideos = Array.from(files);
      setVideos(prev => [...prev, ...newVideos]);
      
      // Validate the videos
      newVideos.forEach(file => {
        // Check file type
        if (!file.type.startsWith('video/')) {
          console.warn(`File ${file.name} is not a video type (${file.type})`);
        }
        
        // Preload a small chunk to verify it's readable
        const reader = new FileReader();
        reader.onload = () => {
          console.log(`Video ${file.name} loaded successfully`);
        };
        reader.onerror = () => {
          console.error(`Video ${file.name} failed to load`);
          // Remove invalid file from videos array
          setVideos(prev => prev.filter(vid => vid !== file));
        };
        // Read just the first chunk to validate
        const blob = file.slice(0, 1024 * 1024); // First 1MB
        reader.readAsArrayBuffer(blob);
      });
    }
  };

  // Handle thumbnail selection with validation
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Ensure it's an image
      if (!file.type.startsWith('image/')) {
        console.warn(`File ${file.name} is not an image type`);
        return;
      }
      
      setThumbnail(file);
      
      // Validate the thumbnail image
      const reader = new FileReader();
      reader.onload = () => {
        console.log(`Thumbnail ${file.name} loaded successfully`);
      };
      reader.onerror = () => {
        console.error(`Thumbnail ${file.name} failed to load`);
        setThumbnail(null);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return {
    // Image states and handlers
    images,
    setImages,
    thumbnail,
    setThumbnail,
    selectedImage,
    setSelectedImage,
    handleImageView,
    handleThumbnailView,
    handleImageChange,
    handleThumbnailChange,
    handleRemoveImage: (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
    },
    handleRemoveThumbnail: () => {
      setThumbnail(null);
    },
    
    // Video states and handlers
    videos,
    setVideos,
    selectedVideo,
    setSelectedVideo,
    handleVideoView,
    handleVideoChange,
    handleRemoveVideo: (index: number) => {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };
};