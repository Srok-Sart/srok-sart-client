"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Navigation from "../components/navigation";
import FormActions from "./form-action";
import FormHeader from "./form-header";
import MediaUpload from "./media-upload";
import PostDifficultySelector from "./post-difficulty";
import TitleDescription from "./title-description";
import Select from 'react-select';
import { Material } from '@/app/interfaces/material';

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
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    // Fetch materials from the API
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`);
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.statusText}`);
        }
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
    setIsClient(true); // Set isClient to true after the component mounts
  }, []);

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

    if (selectedMaterials.length === 0) {
      errors.materials = "At least one material is required";
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

    // Append selected materials
    selectedMaterials.forEach((material) => {
      formData.append("materialIds[]", material.id.toString());
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to submit post: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaterialsChange = (selectedOptions: any) => {
    const selectedMaterialObjects = selectedOptions.map((option: any) =>
      materials.find((material) => material.id.toString() === option.value)
    );
    setSelectedMaterials(selectedMaterialObjects);
  };

  const materialOptions = materials.map((material) => ({
    value: material.id.toString(),
    label: material.name,
  }));

  const selectedMaterialOptions = selectedMaterials.map((material) => ({
    value: material.id.toString(),
    label: material.name,
  }));

  return (
    <>
      <div className='pt-16 max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-6'>
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

        {isClient && (
          <div className='mb-4'>
            <label className='block text-gray-700 font-semibold mb-2'>
              Materials <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              value={selectedMaterialOptions}
              onChange={handleMaterialsChange}
              options={materialOptions}
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Select the materials required for the post"
            />
            {validationErrors.materials && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.materials}</p>
            )}
          </div>
        )}

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