import { useState } from 'react';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';
import { FileOrUrl, Post } from '@/app/interfaces/post';
import { PostMaterial } from '@/app/interfaces/material';
import { useFormValidation } from './use-form-validation';

interface PostFormState {
  title: string;
  description: string;
  difficultyLevel: PostDifficulty | '';
  type: PostType | '';
  estimatedTime: string; // Will store only numeric value
  timeUnit: 'minutes' | 'hours';
}

interface UsePostSubmissionProps {
  images: FileOrUrl[];
  thumbnail: FileOrUrl | null;
  onAddNewPost: (post: Post) => void;
  setShowAddNewPost: (show: boolean) => void;
  resetFileUploads: () => void;
  selectedMaterials: PostMaterial[];
  defaultStatus?: string;
}

interface PostPayload {
  title: string;
  description?: string;
  postDifficulty: PostDifficulty;
  postType: PostType;
  estimatedTime: string;
  timeUnit: string;
  imageUrls: string[];
  thumbnailUrl?: string;
  materials: MaterialPayload[];
  postStatus?: string;
}

interface MaterialPayload {
  materialId: number;
  quantityRequired?: number;
}

export const usePostSubmission = ({
  images,
  thumbnail,
  onAddNewPost,
  setShowAddNewPost,
  resetFileUploads,
  selectedMaterials,
  defaultStatus = "PENDING",
}: UsePostSubmissionProps) => {
  const [formState, setFormState] = useState<PostFormState>({
    title: '',
    description: '',
    difficultyLevel: '',
    type: '',
    estimatedTime: '',
    timeUnit: 'minutes',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use our validation hook
  const { errors, validateForm, clearErrors, submitted } = useFormValidation();

  const updateField = <K extends keyof PostFormState>(
    field: K,
    value: PostFormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const validateFormFields = () => {
    return validateForm({
      title: formState.title,
      difficultyLevel: formState.difficultyLevel,
      type: formState.type,
      images,
      thumbnail,
      selectedMaterials
    });
  };

  const createPost = async (payload: PostPayload, images: FileOrUrl[], thumbnail: FileOrUrl | null) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description || '');
    formData.append('postDifficulty', payload.postDifficulty);
    formData.append('postType', payload.postType);
    
    // Format estimated time with unit - estimatedTime now contains only numeric value
    const formattedTime = payload.estimatedTime ? 
      `${payload.estimatedTime} ${payload.timeUnit}` : 
      '';
    formData.append('estimatedTime', formattedTime);
    
    formData.append('postStatus', payload.postStatus || '');
    
    // Add materials data as JSON string
    formData.append('materials', JSON.stringify(payload.materials));
    
    // Add images
    images.forEach(image => {
      if (image instanceof File) {
        formData.append('contents', image);
      } else {
        formData.append('contents', new Blob([image], { type: 'image/jpeg' }));
      }
    });
  
    // Add thumbnail
    if (thumbnail) {
      if (thumbnail instanceof File) {
        formData.append('thumbnail', thumbnail);
      } else {
        formData.append('thumbnail', new Blob([thumbnail], { type: 'image/jpeg' }));
      }
    }
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData ? JSON.stringify(errorData) : await response.text();
      throw new Error(`Failed to add post: ${errorMessage}`);
    }
  
    return response.json();
  };

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      difficultyLevel: '',
      type: '',
      estimatedTime: '',
      timeUnit: 'minutes',
    });
    resetFileUploads();
    clearErrors();
    setShowAddNewPost(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form and show specific field errors immediately
    if (!validateFormFields()) {
      setError(null); // Remove any general error message
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const materialsPayload = selectedMaterials.map(material => ({
        materialId: material.materialId,
        quantityRequired: material.quantityRequired || 1
      }));
  
      const postPayload: PostPayload = {
        title: formState.title,
        description: formState.description || '',
        postDifficulty: formState.difficultyLevel as PostDifficulty,
        postType: formState.type as PostType,
        estimatedTime: formState.estimatedTime, // Now contains only numeric part
        timeUnit: formState.timeUnit,
        imageUrls: [],
        thumbnailUrl: '',
        materials: materialsPayload,
        postStatus: defaultStatus
      };
  
      let postData = await createPost(postPayload, images, thumbnail);
      
      // Fetch the newly created post with complete material information
      if (postData && postData.id) {
        const completePostResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postData.id}`);
        if (completePostResponse.ok) {
          postData = await completePostResponse.json();
        }
      }
      
      onAddNewPost(postData);
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    updateField,
    handleSubmit,
    isLoading,
    error,
    errors,
    submitted,
    isFormValid: validateFormFields,
  };
};