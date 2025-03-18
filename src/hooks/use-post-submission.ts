import { PostMaterial } from "@/app/interfaces/material";
import { FileOrUrl, Post } from "@/app/interfaces/post";
import { PostDifficulty } from "@/enums/post-difficulty.enum";
import { PostType } from "@/enums/post-type.enum";
import { useState } from "react";
import { useFormValidation } from "./use-form-validation";

interface PostFormState {
  title: string;
  description: string;
  difficultyLevel: PostDifficulty | "";
  type: PostType | "";
  estimatedTime: string;
  timeUnit: "minutes" | "hours";
}

interface UsePostSubmissionProps {
  images: FileOrUrl[];
  videos: FileOrUrl[];
  thumbnail: FileOrUrl | null;
  onAddNewPost: (post: Post) => void;
  setShowAddNewPost: (show: boolean) => void;
  resetFileUploads: () => void;
  selectedMaterials: PostMaterial[];
  defaultStatus?: string;
  token: string;
}

export const usePostSubmission = ({
  images,
  videos,
  thumbnail,
  onAddNewPost,
  setShowAddNewPost,
  resetFileUploads,
  selectedMaterials,
  defaultStatus = "PENDING",
  token,
}: UsePostSubmissionProps) => {
  const [formState, setFormState] = useState<PostFormState>({
    title: "",
    description: "",
    difficultyLevel: "",
    type: "",
    estimatedTime: "",
    timeUnit: "minutes",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use validation hook with modified validation logic for videos
  const { errors, validateForm, clearErrors, submitted } = useFormValidation({
    skipThumbnailForVideos: true,
  });

  const updateField = <K extends keyof PostFormState>(
    field: K,
    value: PostFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Clear validation errors when user updates any field
    clearErrors();
  };

  const validateFormFields = () => {
    return validateForm({
      title: formState.title,
      difficultyLevel: formState.difficultyLevel,
      type: formState.type,
      images,
      videos,
      thumbnail,
      selectedMaterials,
      skipThumbnailForVideos: true,
    });
  };

  const createPost = async (
    postType: PostType,
    postTitle: string,
    postDescription: string,
    postDifficulty: PostDifficulty,
    timeValue: string,
    timeUnitValue: string,
    selectedMaterials: PostMaterial[],
    images: FileOrUrl[],
    videos: FileOrUrl[],
    thumbnail: FileOrUrl | null,
    status: string
  ) => {
    console.log("Creating post with type:", postType);
    console.log(
      "Files:",
      postType === PostType.IMAGE ? images.length : videos.length
    );

    const formData = new FormData();

    // Add basic form fields
    formData.append("title", postTitle);
    if (postDescription) {
      formData.append("description", postDescription);
    }
    formData.append("postDifficulty", postDifficulty);
    formData.append("postType", postType);
    formData.append("postStatus", status);

    // Format and add estimated time if present
    if (timeValue) {
      const formattedTime = `${timeValue} ${timeUnitValue}`;
      formData.append("estimatedTime", formattedTime);
    }

    // Add materials data as JSON string
    const materialsPayload = selectedMaterials.map((material) => ({
      materialId: material.materialId,
      quantityRequired: material.quantityRequired || 1,
    }));
    formData.append("materials", JSON.stringify(materialsPayload));

    // Handle files based on post type
    if (postType === PostType.IMAGE) {
      // For IMAGE posts, add images and thumbnail
      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("contents", image);
        } else if (typeof image === "string") {
          formData.append("imageUrls", image);
        }
      });

      // Add thumbnail for IMAGE posts
      if (thumbnail) {
        if (thumbnail instanceof File) {
          formData.append("thumbnail", thumbnail);
        } else if (typeof thumbnail === "string") {
          formData.append("thumbnailUrl", thumbnail);
        }
      }
    } else if (postType === PostType.VIDEO) {
      // For VIDEO posts, just add videos as contents (no thumbnail)
      videos.forEach((video) => {
        if (video instanceof File) {
          formData.append("contents", video);
        } else if (typeof video === "string") {
          formData.append("videoUrls", video);
        }
      });
    }

    // Debug logging
    console.log("Form data contents:");
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(
          `${pair[0]} - File: ${pair[1].name}, Type: ${pair[1].type}, Size: ${pair[1].size} bytes`
        );
      } else {
        console.log(`${pair[0]} - ${pair[1]}`);
      }
    }

    // Send the request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT include Content-Type when using FormData
      },
      body: formData,
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = errorData.message || JSON.stringify(errorData);
      } catch {
        errorText = (await response.text()) || `HTTP error ${response.status}`;
      }
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to add post: ${errorText}`);
    }

    return response.json();
  };

  const resetForm = () => {
    setFormState({
      title: "",
      description: "",
      difficultyLevel: "",
      type: "",
      estimatedTime: "",
      timeUnit: "minutes",
    });
    resetFileUploads();
    clearErrors();
    setShowAddNewPost(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First validate the form
    if (!validateFormFields()) {
      console.log("Form validation failed with errors:", errors);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form with post type:", formState.type);
      console.log(
        "Files to upload:",
        formState.type === PostType.IMAGE
          ? `${images.length} images`
          : `${videos.length} videos`
      );

      const postType = formState.type as PostType;
      const contentFiles = postType === PostType.IMAGE ? images : videos;

      console.log("Content files count:", contentFiles.length);
      console.log("Has thumbnail:", thumbnail ? "Yes" : "No");

      let postData = await createPost(
        postType,
        formState.title,
        formState.description,
        formState.difficultyLevel as PostDifficulty,
        formState.estimatedTime,
        formState.timeUnit,
        selectedMaterials,
        images,
        videos,
        thumbnail,
        defaultStatus
      );

      // Fetch the newly created post with complete information
      if (postData && postData.id) {
        const completePostResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${postData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (completePostResponse.ok) {
          postData = await completePostResponse.json();
        }
      }

      onAddNewPost(postData);
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
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
    errors, // Make sure errors are returned from the hook
    submitted,
    isFormValid: validateFormFields,
  };
};
