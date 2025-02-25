import { useState } from "react";
import { Post } from "@/app/interfaces/post";

interface UsePostUpdateProps {
  onUpdatePost: (post: Post) => void;
  setShowEditPost: (show: boolean) => void;
}

export const usePostUpdate = ({ onUpdatePost, setShowEditPost }: UsePostUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePostUpdate = async (
    post: Post, 
    id: number,
    newThumbnail: File | null,
    newImages: File[]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description || "");
      formData.append("postDifficulty", post.postDifficulty);
      formData.append("postType", post.postType);
      
      if (newThumbnail) {
        formData.append("thumbnail", newThumbnail);
      }
      
      newImages.forEach((image) => formData.append("images", image));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update post: ${errorText}`);
      }

      const updatedPostData = await response.json();
      onUpdatePost(updatedPostData);
      setShowEditPost(false);
    } catch (error) {
      setError("Error updating post. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handlePostUpdate,
  };
};