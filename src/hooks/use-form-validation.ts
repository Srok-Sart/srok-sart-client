import { useState, useEffect } from 'react';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';
import { FileOrUrl } from '@/app/interfaces/post';
import { PostMaterial } from '@/app/interfaces/material';

interface ValidationFields {
  title: string;
  difficultyLevel: PostDifficulty | '';
  type: PostType | '';
  images: FileOrUrl[];
  thumbnail: FileOrUrl | null;
  selectedMaterials: PostMaterial[];
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (fields: ValidationFields): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!fields.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!fields.difficultyLevel) {
      newErrors.postDifficulty = 'Difficulty level is required';
    }
    
    if (!fields.type) {
      newErrors.postType = 'Type is required';
    }

    if (fields.selectedMaterials.length === 0) {
      newErrors.materials = 'At least one material is required';
    }

    if (fields.type === PostType.IMAGE) {
      if (fields.images.length === 0) {
        newErrors.images = 'At least one image is required';
      }
      
      if (!fields.thumbnail) {
        newErrors.thumbnail = 'Thumbnail is required';
      }
    }

    setErrors(newErrors);
    setSubmitted(true);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
    setSubmitted(false);
  };

  return {
    errors,
    submitted,
    validateForm,
    clearErrors,
    setFieldError: (field: string, message: string) => 
      setErrors(prev => ({ ...prev, [field]: message })),
  };
};