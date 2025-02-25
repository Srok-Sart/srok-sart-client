import { useState } from 'react';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';
import { FileOrUrl, Post } from '@/app/interfaces/post';

interface PostFormState {
  title: string;
  description: string;
  difficultyLevel: PostDifficulty | '';
  type: PostType | '';
}

interface UsePostSubmissionProps {
  images: FileOrUrl[];
  thumbnail: FileOrUrl | null;
  onAddNewPost: (post: Post) => void;
  setShowAddNewPost: (show: boolean) => void;
  resetFileUploads: () => void;
}

interface PostPayload {
  title: string;
  description?: string;
  postDifficulty: PostDifficulty;
  postType: PostType;
  imageUrls: string[];
  thumbnailUrl: string;
}

export const usePostSubmission = ({
  images,
  thumbnail,
  onAddNewPost,
  setShowAddNewPost,
  resetFileUploads,
}: UsePostSubmissionProps) => {
  const [formState, setFormState] = useState<PostFormState>({
    title: '',
    description: '',
    difficultyLevel: '',
    type: '',
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
    images.forEach(image => formData.append('images', image));
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add post: ${errorText}`);
    }

    return response.json();
  };

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      difficultyLevel: '',
      type: '',
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
        imageUrls: [], // This will be populated by the server
        thumbnailUrl: '', // This will be populated by the server
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