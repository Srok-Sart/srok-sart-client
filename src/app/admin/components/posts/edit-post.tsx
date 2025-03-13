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
import { Material, PostMaterial } from "@/app/interfaces/material";
import { FileOrUrl } from "@/app/interfaces/post";

interface EditPostProps {
  setShowEditPost: (show: boolean) => void;
  onUpdatePost: (post: Post) => void;
  id: number;
}

const EditPost = ({ setShowEditPost, onUpdatePost, id }: EditPostProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<PostMaterial[]>([]);
  const [newImagesFiles, setNewImagesFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');

  // Use file upload functionality
  const {
    images,
    setImages,
    thumbnail,
    setThumbnail,
    selectedImage,
    setSelectedImage,
    handleImageView,
    handleThumbnailView,
  } = useFileUpload();

  // Fetch initial data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch post: ${res.statusText}`);

        const data = await res.json();
        
        // Fix any duplicated time units in estimatedTime field
        if (data.estimatedTime) {
          // First determine the time unit
          const timeUnitToUse = data.estimatedTime.toLowerCase().includes('hour') ? 'hours' : 'minutes';
          setTimeUnit(timeUnitToUse);
          
          // Extract just the numeric part
          const numericPart = data.estimatedTime.replace(/[^0-9]/g, '');
          
          // Set the cleaned estimatedTime value
          data.estimatedTime = `${numericPart} ${timeUnitToUse}`;
        }
        
        setPost(data);
        
        // Initialize selected materials with the post's materials
        if (data.postMaterials && Array.isArray(data.postMaterials)) {
          // Properly format the material data to ensure IDs are correct
          const formattedMaterials = data.postMaterials.map((material: any) => ({
            materialId: material.material?.id || material.materialId,
            quantityRequired: material.quantity || material.quantityRequired || 1,
            material: material.material
          }));
          setSelectedMaterials(formattedMaterials);
        }
        
        // Initialize thumbnail
        setThumbnail(data.thumbnailUrl || null);
        
        // Initialize images
        if (data.imageUrls && Array.isArray(data.imageUrls)) {
          setImages(data.imageUrls);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setLoadError(error instanceof Error ? error.message : "Failed to load post");
      } finally {
        setIsLoading(false);
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

  // Helper function to update post fields
  const updateField = <K extends keyof Post>(field: K, value: Post[K]) => {
    if (post) {
      setPost(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Parse estimated time to display in the input
  const parseEstimatedTime = () => {
    if (!post?.estimatedTime) return "";
    // Extract just the numeric part by removing any non-numeric characters
    return post.estimatedTime.replace(/[^0-9]/g, '');
  };

  // Handle time value change
  const handleTimeValueChange = (value: string) => {
    // Store only the numeric value in estimatedTime
    const numericValue = value.replace(/[^0-9]/g, '');
    // Format with the unit for storage/API
    const newTime = numericValue ? `${numericValue} ${timeUnit}` : "";
    updateField("estimatedTime", newTime);
  };

  // Handle time unit change
  const handleTimeUnitChange = (unit: 'minutes' | 'hours') => {
    setTimeUnit(unit);
    
    // Update the formatted time string with the new unit
    const numericValue = parseEstimatedTime();
    if (numericValue) {
      const newTime = `${numericValue} ${unit}`;
      updateField("estimatedTime", newTime);
    }
  };

  // Image handling functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setNewImagesFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImagesLength = images.length;
    
    if (index < currentImagesLength) {
      // Remove existing image
      setImages(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    } else {
      // Remove new image
      const newIndex = index - currentImagesLength;
      setNewImagesFiles(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
  };

  // Use post update hook
  const { 
    isLoading: isUpdating, 
    error: updateError,
    errors,
    handlePostUpdate 
  } = usePostUpdate({
    onUpdatePost: (updatedPost) => {
      // This is the key fix - we need to fetch the complete post data after update
      const fetchUpdatedPost = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
          if (res.ok) {
            const completePost = await res.json();
            // Update parent component state with complete post data
            onUpdatePost(completePost);
            // Close the edit form
            setShowEditPost(false);
          } else {
            // If fetch fails, still use the returned data from update
            onUpdatePost(updatedPost);
            setShowEditPost(false);
          }
        } catch (error) {
          console.error("Error fetching updated post:", error);
          // On error, still use returned data from update
          onUpdatePost(updatedPost);
          setShowEditPost(false);
        }
      };
      
      // Fetch the complete post with all related data
      fetchUpdatedPost();
    },
    setShowEditPost: () => {}, // We handle this in our success callback now
    images,
    newImages: newImagesFiles,
    thumbnail,
    selectedMaterials,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    await handlePostUpdate(post, id);
  };

  if (isLoading) return <div className="p-4">Loading post...</div>;
  if (loadError) return <div className="p-4 text-red-500">Error: {loadError}</div>;
  if (!post) return <div className="p-4">Post not found</div>;

  // Combine existing images and new files for display
  const allImages: FileOrUrl[] = [...images, ...newImagesFiles];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      {updateError && <div className="text-red-500 mb-4">{updateError}</div>}

      <form onSubmit={handleSubmit}>
        <PostFormFields
          title={post.title}
          description={post.description || ""}
          postDifficulty={post.postDifficulty || ""}
          postType={post.postType || ""}
          materials={materials}
          selectedMaterials={selectedMaterials}
          errors={errors}
          onTitleChange={(value) => updateField("title", value)}
          onDescriptionChange={(value) => updateField("description", value)}
          onDifficultyChange={(value) => updateField("postDifficulty", value as PostDifficulty)}
          onTypeChange={(value) => updateField("postType", value as PostType)}
          onMaterialsChange={setSelectedMaterials}
          estimatedTime={parseEstimatedTime()}
          timeUnit={timeUnit}
          onEstimatedTimeChange={handleTimeValueChange}
          onTimeUnitChange={handleTimeUnitChange}
        />

        {post.postType === PostType.IMAGE && (
          <FileUploadSection
            images={allImages}
            thumbnail={thumbnail}
            errors={errors}
            onImagesChange={handleImageChange}
            onThumbnailChange={handleThumbnailChange}
            onRemoveImage={handleRemoveImage}
            onRemoveThumbnail={handleRemoveThumbnail}
            onImageView={handleImageView}
            onThumbnailView={handleThumbnailView}
          />
        )}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => setShowEditPost(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Post"}
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