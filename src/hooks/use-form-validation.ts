import { useState } from 'react';
import { PostType } from '@/enums/post-type.enum';
import { FileOrUrl } from '@/app/interfaces/post';
import { PostMaterial } from '@/app/interfaces/material';

interface FormFields {
  title: string;
  difficultyLevel: string;
  type: string;
  images?: FileOrUrl[];
  videos?: FileOrUrl[];
  thumbnail?: FileOrUrl | null;
  selectedMaterials?: PostMaterial[];
  skipThumbnailForVideos?: boolean;
}

interface ValidationOptions {
  skipThumbnailForVideos?: boolean;
}

export const useFormValidation = (options: ValidationOptions = {}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { skipThumbnailForVideos = false } = options;

  const validateForm = (fields: FormFields): boolean => {
    setSubmitted(true);
    const newErrors: Record<string, string> = {};
    
    // Validate title
    if (!fields.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (fields.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Validate difficulty level
    if (!fields.difficultyLevel) {
      newErrors.difficultyLevel = 'Difficulty level is required';
    }
    
    // Validate post type
    if (!fields.type) {
      newErrors.type = 'Post type is required';
    }
    
    // Validate content based on post type
    if (fields.type === PostType.IMAGE) {
      if (!fields.images || fields.images.length === 0) {
        newErrors.images = 'At least one image is required';
      }
      
      if (!fields.thumbnail) {
        newErrors.thumbnail = 'Thumbnail is required for image posts';
      }
    } else if (fields.type === PostType.VIDEO) {
      if (!fields.videos || fields.videos.length === 0) {
        newErrors.videos = 'At least one video is required';
      } else if (fields.videos.length > 1) {
        newErrors.videos = 'Only one video is allowed per post';
      }
      
      // For video posts, thumbnail is optional based on skipThumbnailForVideos option
      if (!skipThumbnailForVideos && !fields.thumbnail) {
        newErrors.thumbnail = 'Thumbnail is required';
      }
    }
    
    // Validate materials
    if (!fields.selectedMaterials || fields.selectedMaterials.length === 0) {
      newErrors.materials = 'At least one material is required';
    }
    
    // Set the errors state
    setErrors(newErrors);
    
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
    setSubmitted(false);
  };

  return {
    errors,
    validateForm,
    clearErrors,
    submitted
  };
};