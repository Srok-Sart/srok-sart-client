import { FileOrUrl } from '@/app/interfaces/post';
import { useState, useEffect } from 'react';

export const useFileUpload = () => {
  const [images, setImages] = useState<FileOrUrl[]>([]);
  const [thumbnail, setThumbnail] = useState<FileOrUrl | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const createImageUrl = (image: FileOrUrl) => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setBlobUrl(url);
      return url;
    }
    return image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
  };

  const handleImageView = (image: FileOrUrl) => {
    setSelectedImage(createImageUrl(image));
  };

  const handleThumbnailView = () => {
    if (thumbnail) setSelectedImage(createImageUrl(thumbnail));
  };

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
    };
  }, [blobUrl]);

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
      const files = e.target.files;
      if (files && files.length > 0) {
        setImages(prev => [...prev, ...Array.from(files)]);
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
