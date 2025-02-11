"use client";
import React, { useState } from "react";
import Navigation from "../components/navigation";
import FormHeader from "./FormHeader";
import TitleDescription from "./TitleDescription";
import TagsMaterials from "./TagsMaterials";
import MediaUpload from "./MediaUpload";
import FormActions from "./FormActions";

const UploadRequest: React.FC = () => {
  // Overall state
  const [uploadType, setUploadType] = useState<"video" | "photo">("video");
  const [materials, setMaterials] = useState<{ name: string; quantity: number; unit: string }[]>([
    { name: "Bottle", quantity: 1, unit: "Unit" },
    { name: "Chopstick", quantity: 2, unit: "Pair" },
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

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
        uploadType === "photo" ? [...uploadedFiles, ...filesArray] : [filesArray[0]]
      );
    }
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setThumbnail(event.target.files[0]);
    }
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  const handleConfirm = () => {
    console.log("Confirmed");
  };

  return (
    <>
      <Navigation />
      <div className="pt-16 max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-6 border border-gray-200">      <FormHeader />
      <TitleDescription />
      <TagsMaterials
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        materials={materials}
        addMaterial={addMaterial}
        removeMaterial={removeMaterial}
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
      />
      <FormActions handleCancel={handleCancel} handleConfirm={handleConfirm} />
    </div>
    </>
  );
};

export default UploadRequest;
