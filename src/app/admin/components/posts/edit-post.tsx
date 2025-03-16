"use client";
import React, { useEffect, useState, useRef } from "react";
import { Post } from "../../../interfaces/post";
import { PostDifficulty } from "@/enums/post-difficulty.enum";
import { PostType } from "@/enums/post-type.enum";
import { PostFormFields } from "./subcomponents/post-form";
import { FileUploadSection } from "./subcomponents/file-upload-section";
import { VideoUploadSection } from "./subcomponents/video-upload-section";
import { ImagePreview } from "./subcomponents/image-preview";
import { useFileUpload } from "@/hooks/use-file-upload";
import { usePostUpdate } from "@/hooks/use-post-update";
import { Material, PostMaterial } from "@/app/interfaces/material";
import { FileOrUrl } from "@/app/interfaces/post";
import VideoPreview from "./subcomponents/video-Preview";

interface EditPostProps {
  setShowEditPost: (show: boolean) => void;
  onUpdatePost: (post: Post) => void;
  id: number;
  token: string;
}

const EditPost = ({ setShowEditPost, onUpdatePost, id, token }: EditPostProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<PostMaterial[]>([]);
  const [newImagesFiles, setNewImagesFiles] = useState<File[]>([]);
  const [newVideosFiles, setNewVideosFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);

  // Use file upload functionality
  const {
    // Image-related props
    images,
    setImages,
    thumbnail,
    setThumbnail,
    selectedImage,
    setSelectedImage,
    handleImageChange,
    handleThumbnailChange,
    handleRemoveImage,
    handleRemoveThumbnail,
    handleImageView,
    handleThumbnailView,
    // Video-related props
    videos,
    setVideos,
    selectedVideo,
    setSelectedVideo,
    handleVideoView,
  } = useFileUpload();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
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
        
        // Initialize videos - only keep the first video if multiple exist
        if (data.postType === PostType.VIDEO && data.imageUrls && Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
          // For video posts, the first image URL is the video
          const videoPath = data.imageUrls[0];
          setVideos([videoPath]);
          
          // Store the full video URL for player
          setExistingVideoUrl(`${process.env.NEXT_PUBLIC_API_URL}${videoPath}`);
          
          console.log('Loaded video path:', videoPath);
          console.log('Full video URL:', `${process.env.NEXT_PUBLIC_API_URL}${videoPath}`);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`Failed to fetch materials: ${res.statusText}`);
        const data: Material[] = await res.json();
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchPost();
    fetchMaterials();
  }, [id, token, setImages, setThumbnail, setVideos]);

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

  // Video handling functions - only allow one video
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Only allow one video - clear previous videos and set the new one
      const newVideo = e.target.files[0];
      
      // Clear existing videos
      setExistingVideoUrl(null);
      setVideos([]);
      setNewVideosFiles([newVideo]);
      
      console.log('New video uploaded:', newVideo.name);
    }
  };

  const handleRemoveVideo = (index: number) => {
    // If we have new videos, remove them
    if (newVideosFiles.length > 0) {
      setNewVideosFiles([]);
      console.log('Removed new video');
    } else {
      // Otherwise remove the existing video
      setExistingVideoUrl(null);
      setVideos([]);
      console.log('Removed existing video');
    }
  };

  // Check if we have any videos (new or existing)
  const hasVideos = () => {
    return newVideosFiles.length > 0 || videos.length > 0;
  }

  // Use post update hook
  const { 
    isLoading: isUpdating, 
    error: updateError,
    errors,
    handlePostUpdate 
  } = usePostUpdate({
    onUpdatePost: (updatedPost) => {
      const fetchUpdatedPost = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          if (res.ok) {
            const completePost = await res.json();
            onUpdatePost(completePost);
            setShowEditPost(false);
          } else {
            onUpdatePost(updatedPost);
            setShowEditPost(false);
          }
        } catch (error) {
          console.error("Error fetching updated post:", error);
          onUpdatePost(updatedPost);
          setShowEditPost(false);
        }
      };
      
      fetchUpdatedPost();
    },
    setShowEditPost: () => {}, // Handled in success callback
    images,
    videos,
    newImages: newImagesFiles,
    newVideos: newVideosFiles,
    thumbnail,
    selectedMaterials,
    token,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    // Log the state of videos before validation
    console.log("Video validation check:");
    console.log("- New videos:", newVideosFiles.length);
    console.log("- Existing videos:", videos.length);
    console.log("- Has videos function result:", hasVideos());
    
    // Form validation checks
    if (post.postType === PostType.VIDEO && !hasVideos()) {
      console.error("Video validation failed: No videos found");
      alert('Please upload a video');
      return;
    }
    
    if (post.postType === PostType.IMAGE) {
      if (images.length === 0 && newImagesFiles.length === 0) {
        alert('Please upload at least one image');
        return;
      }
      
      if (!thumbnail) {
        alert('Please upload a thumbnail for image post');
        return;
      }
    }
    
    // Log what we're submitting
    console.log("Submitting post with:", {
      newVideos: newVideosFiles.length,
      existingVideos: videos.length,
      postType: post.postType
    });
    
    await handlePostUpdate(post, id);
  };

  if (isLoading) return <div className="p-4">Loading post...</div>;
  if (loadError) return <div className="p-4 text-red-500">Error: {loadError}</div>;
  if (!post) return <div className="p-4">Post not found</div>;

  // Combine existing images/videos and new files for display
  const allImages: FileOrUrl[] = [...images, ...newImagesFiles];
  
  // Updated: Make sure we're passing the correct video array based on priority
  // If we have new videos, use those, otherwise use existing videos
  const allVideos: FileOrUrl[] = newVideosFiles.length > 0 ? newVideosFiles : videos;

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
          onTypeChange={(value) => {
            updateField("postType", value as PostType);
            console.log('Type changed to:', value);
            // Clear thumbnail if switching to video type
            if (value === PostType.VIDEO && thumbnail) {
              setThumbnail(null);
            }
            // Clear videos if switching to image type
            if (value === PostType.IMAGE) {
              setExistingVideoUrl(null);
              setVideos([]);
              setNewVideosFiles([]);
            }
          }}
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

        {post.postType === PostType.VIDEO && (
          <VideoUploadSection
            videos={allVideos}
            errors={errors}
            onVideosChange={handleVideoChange}
            onRemoveVideo={handleRemoveVideo}
            onVideoView={handleVideoView}
            existingVideoUrl={existingVideoUrl}
            newVideos={newVideosFiles}
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
            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>

      {selectedImage && (
        <ImagePreview src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
      
      {selectedVideo && (
        <VideoPreview src={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default EditPost;