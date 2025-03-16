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
  videos: FileOrUrl[];
  newImages: File[];
  newVideos: File[];
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
  videos,
  newImages,
  newVideos,
  thumbnail,
  selectedMaterials,
  token,
}: UsePostUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use our validation hook
  const { errors, validateForm, clearErrors, submitted } = useFormValidation({
    skipThumbnailForVideos: true
  });

  const validatePostFields = (post: Post): boolean => {
    // Custom validation for videos - either newVideos or videos should have content
    const hasVideo = newVideos.length > 0 || videos.length > 0;
    
    // Log validation state for debugging
    console.log("usePostUpdate validation:", {
      postType: post.postType,
      hasVideo,
      newVideosCount: newVideos.length,
      videosCount: videos.length,
    });
    
    if (post.postType === PostType.VIDEO && !hasVideo) {
      errors.videos = "At least one video is required";
      return false;
    }
    
    return validateForm({
      title: post.title,
      difficultyLevel: post.postDifficulty as PostDifficulty | '',
      type: post.postType as PostType | '',
      images,
      videos: [...videos, ...newVideos],
      thumbnail,
      selectedMaterials,
      skipThumbnailForVideos: post.postType === PostType.VIDEO
    });
  };

  const updatePost = async (
    payload: PostUpdatePayload,
    id: number,
    newImages: File[],
    newVideos: File[],
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
    
    // Handle files based on post type
    if (payload.postType === PostType.IMAGE) {
      // Add new images as contents
      newImages.forEach((image) => {
        formData.append("contents", image);
      });
      
      // Add thumbnail if it's a File (new thumbnail)
      if (thumbnail instanceof File) {
        formData.append("thumbnail", thumbnail);
      }
    } else if (payload.postType === PostType.VIDEO) {
      // Add new videos as contents
      if (newVideos.length > 0) {
        const video = newVideos[0]; // Only use the first video
        console.log("Appending video to form data:", video.name, video.type, video.size);
        formData.append("contents", video);
      } else {
        // If no new videos, we need to tell the server we're keeping the existing video
        console.log("No new videos to upload, keeping existing video");
      }
    }

    // Debug logging
    console.log('Form data contents:');
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]} - File: ${pair[1].name}, Type: ${pair[1].type}, Size: ${pair[1].size} bytes`);
      } else {
        console.log(`${pair[0]} - ${pair[1]}`);
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do NOT include Content-Type when using FormData
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      let errorMessage;
      
      try {
        errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMessage = await response.text() || `HTTP error ${response.status}`;
      }
      
      console.error("API Error Response:", errorMessage);
      
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      }
      
      throw new Error(`Failed to update post: ${errorMessage}`);
    }

    return response.json();
  };

  const handlePostUpdate = async (post: Post, id: number) => {
    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    // Custom validation check for videos
    const hasVideo = newVideos.length > 0 || videos.length > 0;
    
    // Log what we're trying to update
    console.log("Trying to update post with:", {
      postType: post.postType,
      hasVideo,
      newVideosCount: newVideos.length,
      videosCount: videos.length
    });
    
    if (post.postType === PostType.VIDEO && !hasVideo) {
      setError("At least one video is required");
      return;
    }
    
    // Validate and show specific field errors immediately
    if (!validatePostFields(post)) {
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      console.log('Updating post of type:', post.postType);
      console.log('Files to upload:', post.postType === PostType.IMAGE 
        ? `${newImages.length} new images` 
        : `${newVideos.length} new videos`);
      
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
        newVideos,
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