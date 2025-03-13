/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Material, PostMaterial } from "@/app/interfaces/material";
import { PostDifficulty } from "@/enums/post-difficulty.enum";
import { PostType } from "@/enums/post-type.enum";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { PostStatus } from "./enum/post-status.enum";
import FormActions from "./form-action";
import FormHeader from "./form-header";
import MediaUpload from "./media-upload";
import PostDifficultySelector from "./post-difficulty";
import TitleDescription from "./title-description";

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
  const [selectedMaterials, setSelectedMaterials] = useState<PostMaterial[]>([]);
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materials`
        );
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

      // Clear any previous validation errors for contents
      if (validationErrors.contents && filesArray.length > 0) {
        setValidationErrors((prev) => ({ ...prev, contents: "" }));
      }
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setThumbnail(event.target.files[0]);

      // Clear any previous validation errors for thumbnail
      if (validationErrors.thumbnail) {
        setValidationErrors((prev) => ({ ...prev, thumbnail: "" }));
      }
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
    // Set default post status to PENDING
    formData.append("postStatus", PostStatus.PENDING);

    if (description) {
      formData.append("description", description);
    }

    if (estimatedTime) {
      formData.append("estimatedTime", estimatedTime);
    }



    // Append materials with quantities
    if (selectedMaterials.length > 0) {
      formData.append("materials", JSON.stringify(selectedMaterials));
    }

    // Append files with correct field names
    uploadedFiles.forEach((file) => {
      formData.append("contents", file);
    });

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to submit post: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      setValidationErrors((prev) => ({
        ...prev,
        submit:
          error instanceof Error ? error.message : "Failed to submit post",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='pt-16 max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-6'>
        <FormHeader />

        <TitleDescription
          title={title}
          description={description}
          setTitle={(value) => {
            setTitle(value);
            if (validationErrors.title && value.trim()) {
              setValidationErrors((prev) => ({ ...prev, title: "" }));
            }
          }}
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
              Materials <span className='text-red-500'>*</span>
            </label>
            
            <Select
              isMulti
              options={materials.map(material => ({
                value: material.id.toString(),
                label: material.name,
              }))}
              onChange={(selectedOptions) => {
                const materialObjects = selectedOptions.map((option: any) => {
                  const material = materials.find(m => m.id.toString() === option.value);
                  const existingMaterial = selectedMaterials.find(m => m.materialId.toString() === option.value);
                  
                  return {
                    materialId: material?.id || parseInt(option.value),
                    material,
                    quantityRequired: existingMaterial?.quantityRequired || 1,
                  };
                });
                setSelectedMaterials(materialObjects);
                
                // Clear any previous validation errors
                if (validationErrors.materials && materialObjects.length > 0) {
                  setValidationErrors((prev) => ({ ...prev, materials: "" }));
                }
              }}
              value={selectedMaterials.map(material => ({
                value: material.materialId.toString(),
                label: material.material?.name || materials.find(m => m.id === material.materialId)?.name || 'Unknown',
              }))}
              className='w-full'
              classNamePrefix='react-select'
              placeholder='Select the materials required for the post'
            />
            
            {validationErrors.materials && (
              <p className='text-red-500 text-sm mt-1'>
                {validationErrors.materials}
              </p>
            )}
            
            {selectedMaterials.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Material Quantities:</h3>
                <div className="space-y-2">
                  {selectedMaterials.map((material, index) => (
                    <div key={index} className="flex items-center">
                      <span className="flex-grow">
                        {material.material?.name || 
                         materials.find(m => m.id === material.materialId)?.name || 
                         'Unknown'}:
                      </span>
                      <div className="flex items-center ml-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedMaterials = [...selectedMaterials];
                            const currentQuantity = updatedMaterials[index].quantityRequired || 1;
                            updatedMaterials[index].quantityRequired = Math.max(1, currentQuantity - 1);
                            setSelectedMaterials(updatedMaterials);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded-l-md hover:bg-blue-700"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={material.quantityRequired || 1}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            const updatedMaterials = [...selectedMaterials];
                            updatedMaterials[index].quantityRequired = parseInt(value) || 1;
                            setSelectedMaterials(updatedMaterials);
                          }}
                          placeholder="1"
                          className="w-12 px-2 py-1 border-t border-b border-gray-300 text-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedMaterials = [...selectedMaterials];
                            const currentQuantity = updatedMaterials[index].quantityRequired || 1;
                            updatedMaterials[index].quantityRequired = currentQuantity + 1;
                            setSelectedMaterials(updatedMaterials);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Use the +/- buttons to adjust quantities or enter a value directly.</p>
              </div>
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

        {validationErrors.submit && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
            {validationErrors.submit}
          </div>
        )}

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