"use client";
import React, { useState } from "react";
import { PostDifficulty } from "@/enums/post-difficulty.enum";
import { PostType } from "@/enums/post-type.enum";
import { Post } from "../../../interfaces/post";
import { FaFileImage, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";

interface AddNewPostProps {
  setShowAddNewPost: (show: boolean) => void;
  onAddNewPost: (post: Post) => void;
}

const AddNewPost: React.FC<AddNewPostProps> = ({ setShowAddNewPost, onAddNewPost }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState<PostDifficulty | "">("");
  const [type, setType] = useState<PostType | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler for multiple image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prevImages) => {
        const newImages = [...prevImages];
        filesArray.forEach((file) => {
          if (!newImages.some((img) => img.name === file.name)) {
            newImages.push(file);
          }
        });
        return newImages;
      });
    }
  };

  // Handler for thumbnail selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required text fields
    if (!title || !description || !difficultyLevel || !type) {
      setError("All fields are required.");
      return;
    }

    // Only require file uploads if the post type is IMAGE
    if (type === PostType.IMAGE) {
      if (images.length === 0) {
        setError("At least one image is required.");
        return;
      }
      if (!thumbnail) {
        setError("Thumbnail is required.");
        return;
      }
    }

    setIsLoading(true);
    setError(null); // Reset error message

    let imageUrls: string[] = [];
    let thumbnailUrl = "";

    // If post type is IMAGE, upload the files first
    if (type === PostType.IMAGE) {
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      try {
        const uploadRes = await fetch("http://localhost:8000/posts/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload files");
        }

        const uploadData = await uploadRes.json();
        imageUrls = uploadData.imageUrls;
        thumbnailUrl = uploadData.thumbnailUrl;
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error uploading files: ${error.message}`);
        } else {
          setError("An unknown error occurred during file upload.");
        }
        setIsLoading(false);
        return;
      }
    }

    // Prepare the payload for post creation
    const postPayload = {
      title,
      description,
      postDifficulty: difficultyLevel,
      postType: type,
      imageUrls,    // This will be an empty array if type is not IMAGE
      thumbnailUrl, // This will be an empty string if type is not IMAGE
    };

    try {
      const postRes = await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postPayload),
      });

      if (!postRes.ok) {
        const errorText = await postRes.text();
        throw new Error(`Failed to add post: ${errorText}`);
      }

      const postData = await postRes.json();
      onAddNewPost(postData);

      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setDifficultyLevel("");
      setType("");
      setImages([]);
      setThumbnail(null);
      setShowAddNewPost(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error adding post: ${error.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = title && description && difficultyLevel && type;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Difficulty Level</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value as PostDifficulty)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Difficulty Level</option>
            {Object.values(PostDifficulty).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PostType)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Type</option>
            {Object.values(PostType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        {/* Only render file inputs if the type is IMAGE */}
        {type === PostType.IMAGE && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Upload Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md"
              />
              {images.map((image, index) => (
                <div key={index} className="mt-2 flex items-center border p-2 rounded-md">
                  <FaFileImage className="text-2xl text-gray-500 mr-2" />
                  <div className="flex-1">
                    <div className="font-bold">{image.name}</div>
                    <div className="text-gray-500 text-sm">{(image.size / 1024).toFixed(2)} KB</div>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(URL.createObjectURL(image))}
                      className="text-blue-500 underline"
                    >
                      View
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload Thumbnail</label>
              <input
                type="file"
                onChange={handleThumbnailChange}
                className="w-full px-3 py-2 border rounded-md"
              />
              {thumbnail && (
                <div className="mt-2 flex items-center border p-2 rounded-md">
                  <FaFileImage className="text-2xl text-gray-500 mr-2" />
                  <div className="flex-1">
                    <div className="font-bold">{thumbnail.name}</div>
                    <div className="text-gray-500 text-sm">{(thumbnail.size / 1024).toFixed(2)} KB</div>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(URL.createObjectURL(thumbnail))}
                      className="text-blue-500 underline"
                    >
                      View
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowAddNewPost(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Submitting..." : "Add Post"}
          </button>
        </div>
      </form>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image src={selectedImage} alt="Selected" layout="fill" objectFit="contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewPost;