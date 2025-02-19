import { useState } from "react";
import { Post } from '../app/interfaces/post';

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
      
      if (newThumbnail) {
        formData.append("thumbnail", newThumbnail);
      }
      
      newImages.forEach((image) => formData.append("images", image));

      let uploadData: { thumbnailUrl?: string; imageUrls?: string[] } = {};

      if (newThumbnail || newImages.length > 0) {
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload files");
        uploadData = await uploadRes.json();
      }

      const thumbnailUrl = uploadData.thumbnailUrl || post.thumbnailUrl;
      const imageUrls = [...post.imageUrls, ...(uploadData.imageUrls || [])];

      const updatedPost = {
        title: post.title,
        description: post.description || "",
        postDifficulty: post.postDifficulty,
        postType: post.postType,
        thumbnailUrl,
        imageUrls
      };

      // console.log("Updated post data:", updatedPost);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update post: ${errorText}`);
      }

      const updatedPostData = await res.json();
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