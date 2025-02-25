"use client";

import { clientFetcher } from "@/api/client-fetcher";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Navigation from "../components/navigation";
import FormActions from "./form-action";
import FormHeader from "./form-header";
import MediaUpload from "./media-upload";
import PostDifficultySelector from "./post-difficulty";
import TitleDescription from "./title-description";

// Define enums to match backend
enum PostType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

enum PostDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

const UploadRequest = () => {
  const router = useRouter();

  // Overall state
  const [uploadType, setUploadType] = useState<"video" | "photo">("photo");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<PostDifficulty>(
    PostDifficulty.EASY
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setUploadedFiles(
        uploadType === "photo"
          ? [...uploadedFiles, ...filesArray]
          : [filesArray[0]]
      );
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setThumbnail(event.target.files[0]);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    }

    if (!thumbnail) {
      errors.thumbnail = "Thumbnail is required";
    }

    if (uploadedFiles.length === 0) {
      errors.contents = "At least one content file is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();

    // Append form data according to DTO
    formData.append("title", title);
    formData.append(
      "postType",
      uploadType === "photo" ? PostType.IMAGE : PostType.VIDEO
    );
    formData.append("postDifficulty", difficulty);

    if (description) {
      formData.append("description", description);
    }

    if (estimatedTime) {
      formData.append("estimatedTime", estimatedTime);
    }

    // Append files with correct field names
    uploadedFiles.forEach((file) => {
      formData.append("contents", file);
    });

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await clientFetcher("/posts", {
        method: "POST",
        body: formData,
      });

      console.log("Success:", response);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className='pt-16 max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-6 border border-gray-200'>
        <FormHeader />

        <TitleDescription
          title={title}
          description={description}
          setTitle={setTitle}
          setDescription={setDescription}
          error={validationErrors.title}
        />

        <div className='mb-4'>
          <label className='block text-gray-700 font-semibold mb-2'>
            Estimated Time (optional)
          </label>
          <input
            type='text'
            className='w-full p-2 border border-gray-300 rounded'
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder='e.g., 15 minutes'
          />
        </div>

        <PostDifficultySelector
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        <MediaUpload
          uploadType={uploadType}
          setUploadType={setUploadType}
          handleFileUpload={handleFileUpload}
          handleThumbnailUpload={handleThumbnailUpload}
          uploadedFiles={uploadedFiles}
          thumbnail={thumbnail}
          setUploadedFiles={setUploadedFiles}
          setThumbnail={setThumbnail}
          errors={{
            thumbnail: validationErrors.thumbnail,
            contents: validationErrors.contents,
          }}
        />

        <FormActions
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
};

export default UploadRequest;
