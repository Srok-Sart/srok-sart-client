import { useState, useEffect } from 'react';
import { FileOrUrl } from '../app/interfaces/post';

export const useFileUpload = () => {
  const [images, setImages] = useState<FileOrUrl[]>([]);
  const [thumbnail, setThumbnail] = useState<FileOrUrl | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageView = (image: FileOrUrl) => {
    const imageUrl = image instanceof File 
      ? URL.createObjectURL(image)
      : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
    setSelectedImage(imageUrl);
  };

  const handleThumbnailView = () => {
    if (!thumbnail) return;
    
    const thumbnailUrl = thumbnail instanceof File 
      ? URL.createObjectURL(thumbnail)
      : `${process.env.NEXT_PUBLIC_API_URL}${thumbnail}`;
    setSelectedImage(thumbnailUrl);
  };

  useEffect(() => {
    return () => {
      if (selectedImage?.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  return {
    images,
    setImages,
    thumbnail,
    setThumbnail,
    selectedImage,
    setSelectedImage,
    handleImageView,
    handleThumbnailView,
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setImages(prev => [...prev, ...Array.from(e.target.files!)]);
      }
    },
    handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setThumbnail(e.target.files[0]);
      }
    },
    handleRemoveImage: (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
    },
    handleRemoveThumbnail: () => {
      setThumbnail(null);
    },
  };
};