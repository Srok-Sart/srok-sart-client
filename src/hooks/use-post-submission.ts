import { useState } from 'react';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';
import { FileOrUrl, Post } from '@/app/interfaces/post';
import { Material } from '@/app/interfaces/material';

interface PostFormState {
  title: string;
  description: string;
  difficultyLevel: PostDifficulty | '';
  type: PostType | '';
  estimatedTime: string;
}

interface UsePostSubmissionProps {
  images: FileOrUrl[];
  thumbnail: FileOrUrl | null;
  onAddNewPost: (post: Post) => void;
  setShowAddNewPost: (show: boolean) => void;
  resetFileUploads: () => void;
  selectedMaterials: Material[];
  defaultStatus?: string;
}

interface PostPayload {
  title: string;
  description?: string;
  postDifficulty: PostDifficulty;
  postType: PostType;
  estimatedTime: string;
  imageUrls: string[];
  thumbnailUrl?: string;
  materialIds: number[];
  postStatus?: string;
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof PostFormState>(
    field: K,
    value: PostFormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { title, difficultyLevel, type } = formState;
    
    if (!title || !difficultyLevel || !type) {
      setError('Title, difficulty level, and type are required.');
      return false;
    }

    if (type === PostType.IMAGE) {
      if (images.length === 0) {
        setError('At least one image is required.');
        return false;
      }
      if (!thumbnail) {
        setError('Thumbnail is required.');
        return false;
      }
    }

    return true;
  };

  const createPost = async (payload: PostPayload, images: FileOrUrl[], thumbnail: FileOrUrl | null) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description || '');
    formData.append('postDifficulty', payload.postDifficulty);
    formData.append('postType', payload.postType);
    formData.append('estimatedTime', payload.estimatedTime);
    formData.append('postStatus', payload.postStatus || '');
    
    payload.materialIds.forEach(id => formData.append('materialIds', id.toString()));
    
    // Add images with the correct field name: 'contents' instead of 'imageUrls'
    images.forEach(image => {
      if (image instanceof File) {
        formData.append('contents', image);
      } else {
        formData.append('contents', new Blob([image], { type: 'image/jpeg' }));
      }
    });
  
    // Add thumbnail with the correct field name: 'thumbnail' instead of 'thumbnailUrl'
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
    });
    resetFileUploads();
    setShowAddNewPost(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const postPayload: PostPayload = {
        title: formState.title,
        description: formState.description || '',
        postDifficulty: formState.difficultyLevel as PostDifficulty,
        postType: formState.type as PostType,
        estimatedTime: formState.estimatedTime,
        imageUrls: [],
        thumbnailUrl: '',
        materialIds: selectedMaterials.map(material => material.id),
        postStatus: defaultStatus
      };

      const postData = await createPost(postPayload, images, thumbnail);
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
    isFormValid: formState.title && formState.difficultyLevel && formState.type,
  };
};