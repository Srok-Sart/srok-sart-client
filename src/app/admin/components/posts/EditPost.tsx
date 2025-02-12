"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Post } from "../../../interfaces/post";
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';
import { FaFileImage, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';

interface EditPostProps {
  setShowEditPost: (show: boolean) => void;
  onUpdatePost: (post: Post) => void;
  id: number;
}

const EditPost: React.FC<EditPostProps> = ({ setShowEditPost, onUpdatePost, id }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8000/posts/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch post: ${res.statusText}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        setError("Error fetching post. Please try again.");
        console.error("Fetch error:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleRemoveImage = useCallback((index: number) => {
    setPost(prev => prev ? { ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) } : null);
  }, []);

  const handleRemoveThumbnail = useCallback(() => {
    setNewThumbnail(null);
    setPost(prev => prev ? { ...prev, thumbnailUrl: '' } : null);
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewThumbnail(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
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
        const uploadRes = await fetch("http://localhost:8000/posts/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload files");

        uploadData = await uploadRes.json();
      }

      const thumbnailUrl = uploadData.thumbnailUrl || post.thumbnailUrl;
      const imageUrls = [...post.imageUrls, ...(uploadData.imageUrls || [])];

      const updatedPost = { ...post, thumbnailUrl, imageUrls };

      const res = await fetch(`http://localhost:8000/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
      if (!res.ok) throw new Error(`Failed to update post: ${res.statusText}`);
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

  if (!post) return <div className="p-4">Loading post...</div>;

  const isFormValid = post.title && post.description && post.postDifficulty && post.postType;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Difficulty Level</label>
          <select
            value={post.postDifficulty}
            onChange={(e) => setPost({ ...post, postDifficulty: e.target.value as PostDifficulty })}
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
            value={post.postType}
            onChange={(e) => setPost({ ...post, postType: e.target.value as PostType })}
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
        {post.postType === PostType.IMAGE && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Upload New Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col gap-4 mb-4">
              {post.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center border p-2 rounded-md">
                  <FaFileImage className="text-2xl text-gray-500 mr-2" />
                  <div className="flex-1">
                    <div className="font-bold">{url.split('/').pop()}</div>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(`http://localhost:8000${url}`)}
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
              {newImages.map((image, index) => (
                <div key={index} className="flex items-center border p-2 rounded-md">
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
                    onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Upload New Thumbnail</label>
          <input
            type="file"
            onChange={handleThumbnailChange}
            className="w-full px-3 py-2 border rounded-md"
            required={!post.thumbnailUrl}
          />
          {(newThumbnail || post.thumbnailUrl) && (
            <div className="mt-2 flex items-center border p-2 rounded-md">
              <FaFileImage className="text-2xl text-gray-500 mr-2" />
              <div className="flex-1">
                <div className="font-bold">{newThumbnail ? newThumbnail.name : post.thumbnailUrl.split('/').pop()}</div>
                <div className="text-gray-500 text-sm">{newThumbnail ? (newThumbnail.size / 1024).toFixed(2) + ' KB' : ''}</div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(newThumbnail ? URL.createObjectURL(newThumbnail) : `http://localhost:8000${post.thumbnailUrl}`)}
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowEditPost(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Updating..." : "Update Post"}
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

export default EditPost;