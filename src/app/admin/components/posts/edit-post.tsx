"use client";
import React, { useEffect, useState } from "react";
import { Post } from "../../../interfaces/post";
import { PostDifficulty } from "@/enums/post-difficulty.enum";
import { PostType } from "@/enums/post-type.enum";
import { PostFormFields } from "./subcomponents/post-form";
import { FileUploadSection } from "./subcomponents/file-upload-section";
import { ImagePreview } from "./subcomponents/image-preview";
import { useFileUpload } from "@/hooks/use-file-upload";
import { usePostUpdate } from "@/hooks/use-post-update";
import { Material } from "@/app/interfaces/material";

interface EditPostProps {
  setShowEditPost: (show: boolean) => void;
  onUpdatePost: (post: Post) => void;
  id: number;
}

const EditPost = ({ setShowEditPost, onUpdatePost, id }: EditPostProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch post: ${res.statusText}`);

        const data = await res.json();
        setPost(data);
        setSelectedMaterials(data.materials || []);
        setNewThumbnail(data.thumbnailUrl || null);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const fetchMaterials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`);
        if (!res.ok) throw new Error(`Failed to fetch materials: ${res.statusText}`);
        const data: Material[] = await res.json();
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchPost();
    fetchMaterials();
  }, [id]);

  const {
    images: newImages,
    setImages: setNewImages,
    thumbnail: newThumbnail,
    setThumbnail: setNewThumbnail,
    selectedImage,
    setSelectedImage,
    handleImageView,
    handleThumbnailView,
  } = useFileUpload();

  const { isLoading, error, handlePostUpdate } = usePostUpdate({
    onUpdatePost,
    setShowEditPost,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    await handlePostUpdate(
      { ...post, materials: selectedMaterials },
      id,
      newThumbnail instanceof File ? newThumbnail : null,
      newImages.filter((image): image is File => image instanceof File),
      selectedMaterials.map(material => material.id)
    );
  };

  if (!post) return <div className="p-4">Loading post...</div>;

  const isFormValid = post.title && post.description && post.postDifficulty && post.postType;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <PostFormFields
          title={post.title}
          description={post.description || ""}
          postDifficulty={post.postDifficulty || ""}
          postType={post.postType || ""}
          materials={materials}
          selectedMaterials={selectedMaterials}
          onTitleChange={(value) => setPost({ ...post, title: value })}
          onDescriptionChange={(value) => setPost({ ...post, description: value })}
          onDifficultyChange={(value) => setPost({ ...post, postDifficulty: value as PostDifficulty })}
          onTypeChange={(value) => setPost({ ...post, postType: value as PostType })}
          onMaterialsChange={setSelectedMaterials}
          estimatedTime={post.estimatedTime || ""}
          onEstimatedTimeChange={(value) => setPost({ ...post, estimatedTime: value })}
        />

        {post.postType === PostType.IMAGE && (
          <FileUploadSection
            images={[...post.imageUrls, ...newImages]}
            thumbnail={newThumbnail || post.thumbnailUrl || ""}
            onImagesChange={(e) => {
              if (e.target.files) {
                const fileArray = Array.from(e.target.files);
                setNewImages(prev => [...prev, ...fileArray]);
              }
            }}
            onThumbnailChange={(e) => {
              if (e.target.files?.[0]) {
                setNewThumbnail(e.target.files[0]);
              }
            }}
            onRemoveImage={(index) => {
              if (index < post.imageUrls.length) {
                // Remove existing image
                const updatedUrls = [...post.imageUrls];
                updatedUrls.splice(index, 1);
                setPost({ ...post, imageUrls: updatedUrls });
              } else {
                // Remove new image
                const newIndex = index - post.imageUrls.length;
                setNewImages(prev => prev.filter((_, i) => i !== newIndex));
              }
            }}
            onRemoveThumbnail={() => {
              if (newThumbnail) {
                setNewThumbnail(null);
              } else {
                setPost({ ...post, thumbnailUrl: "" });
              }
            }}
            onImageView={handleImageView}
            onThumbnailView={handleThumbnailView}
          />
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowEditPost(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>

      {selectedImage && (
        <ImagePreview src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default EditPost;