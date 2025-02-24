"use client";

import { clientFetcher } from "@/api/client-fetcher";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Navigation from "../components/navigation";
import FormActions from "./form-action";
import FormHeader from "./form-header";
import MediaUpload from "./media-upload";
import PostDifficulty from "./post-difficulty";
import TitleDescription from "./title-description";

const UploadRequest: React.FC = () => {
  const router = useRouter();

  // Overall state
  const [uploadType, setUploadType] = useState<"video" | "photo">("video");
  const [materials, setMaterials] = useState<
    { name: string; quantity: number; unit: string }[]
  >([
    { name: "Bottle", quantity: 1, unit: "Unit" },
    { name: "Chopstick", quantity: 2, unit: "Pair" },
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY"
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handlers
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: "", quantity: 1, unit: "Unit" }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

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
    console.log("Cancelled");
    router.back();
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();

    // Append form data
    formData.append("title", title);
    formData.append("postType", uploadType === "photo" ? "IMAGE" : "VIDEO");
    formData.append("postDifficulty", difficulty);
    formData.append("description", description);

    // Append uploaded files
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      // Send the form data to the API - using clientFetcher instead of fetcher
      const response = await clientFetcher("/posts", {
        method: "POST",
        body: formData,
        headers: {}, // Remove Content-Type to let browser set it with boundary for FormData
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
        {" "}
        <FormHeader />
        <TitleDescription setTitle={setTitle} setDescription={setDescription} />
        {/* <TagsMaterials
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        materials={materials}
        setMaterials={setMaterials}
        addMaterial={addMaterial}
        removeMaterial={removeMaterial}
      /> */}
        <PostDifficulty difficulty={difficulty} setDifficulty={setDifficulty} />
        <MediaUpload
          uploadType={uploadType}
          setUploadType={setUploadType}
          handleFileUpload={handleFileUpload}
          handleThumbnailUpload={handleThumbnailUpload}
          uploadedFiles={uploadedFiles}
          thumbnail={thumbnail}
          setUploadedFiles={setUploadedFiles}
          setThumbnail={setThumbnail}
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
