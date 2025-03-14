import { useState } from "react";
import { Post } from "@/app/interfaces/post";
import { PostMaterial } from "@/app/interfaces/material";
import { PostDifficulty } from "@/enums/post-difficulty.enum";
import { PostType } from "@/enums/post-type.enum";
import { FileOrUrl } from "@/app/interfaces/post";
import { useFormValidation } from "./use-form-validation";

interface UsePostUpdateProps {
  onUpdatePost: (post: Post) => void;
  setShowEditPost: (show: boolean) => void;
  images: FileOrUrl[];
  newImages: File[];
  thumbnail: FileOrUrl | null;
  selectedMaterials: PostMaterial[];
  token: string;
}

interface PostUpdatePayload {
  title: string;
  description?: string;
  postDifficulty: PostDifficulty;
  postType: PostType;
  estimatedTime: string;
  materials: MaterialPayload[];
  postStatus?: string;
}

interface MaterialPayload {
  materialId: number;
  quantityRequired?: number;
}

export const usePostUpdate = ({
  onUpdatePost,
  setShowEditPost,
  images,
  newImages,
  thumbnail,
  selectedMaterials,
  token,
}: UsePostUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use our validation hook
  const { errors, validateForm, clearErrors, submitted } = useFormValidation();

  const validatePostFields = (post: Post): boolean => {
    return validateForm({
      title: post.title,
      difficultyLevel: post.postDifficulty as PostDifficulty | '',
      type: post.postType as PostType | '',
      images,
      thumbnail,
      selectedMaterials
    });
  };

  const updatePost = async (
    payload: PostUpdatePayload,
    id: number,
    newImages: File[],
    thumbnail: FileOrUrl | null
  ) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description || "");
    formData.append("postDifficulty", payload.postDifficulty);
    formData.append("postType", payload.postType);
    formData.append("estimatedTime", payload.estimatedTime);
    
    if (payload.postStatus) {
      formData.append("postStatus", payload.postStatus);
    }
    
    // Add materials data as JSON string
    formData.append('materials', JSON.stringify(payload.materials));
    
    // Add new images
    newImages.forEach((image) => {
      formData.append("contents", image);
    });
    
    // Add thumbnail if it's a File (new thumbnail)
    if (thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`, // Add authorization header
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      }
      const errorMessage = errorData ? JSON.stringify(errorData) : await response.text();
      throw new Error(`Failed to update post: ${errorMessage}`);
    }

    return response.json();
  };

  const handlePostUpdate = async (post: Post, id: number) => {
    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    // Validate and show specific field errors immediately
    if (!validatePostFields(post)) {
      setError(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Create materials payload
      const materialsPayload = selectedMaterials.map(material => ({
        materialId: material.materialId,
        quantityRequired: material.quantityRequired || 1
      }));

      // Create post payload
      const postPayload: PostUpdatePayload = {
        title: post.title,
        description: post.description || "",
        postDifficulty: post.postDifficulty as PostDifficulty,
        postType: post.postType as PostType,
        estimatedTime: post.estimatedTime || "",
        materials: materialsPayload,
        postStatus: post.postStatus
      };

      const updatedPostData = await updatePost(
        postPayload,
        id,
        newImages,
        thumbnail
      );
      
      onUpdatePost(updatedPostData);
      clearErrors();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        // Handle authentication errors
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      }
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    errors,
    submitted,
    handlePostUpdate,
    validatePost: validatePostFields
  };
};