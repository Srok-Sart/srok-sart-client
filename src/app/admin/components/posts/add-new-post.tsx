import { Post } from '@/app/interfaces/post';
import { PostType } from '@/enums/post-type.enum';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostFormFields } from './subcomponents/post-form';
import { FileUploadSection } from './subcomponents/file-upload-section';
import { VideoUploadSection } from './subcomponents/video-upload-section';
import { ImagePreview } from './subcomponents/image-preview';
import { useFileUpload } from '@/hooks/use-file-upload';
import { usePostSubmission } from '@/hooks/use-post-submission';
import { Material, PostMaterial } from '@/app/interfaces/material';
import React, { useEffect, useState } from 'react';
import VideoPreview from './subcomponents/video-Preview';

type AddNewPostProps = {
  setShowAddNewPost: (show: boolean) => void;
  onAddNewPost: (post: Post) => void;
  token: string;
};

const AddNewPost = ({ setShowAddNewPost, onAddNewPost, token }: AddNewPostProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<PostMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [token]);

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
    handleVideoChange: originalHandleVideoChange,
    handleRemoveVideo,
    handleVideoView,
  } = useFileUpload();

  // Override the video change handler to only allow one video
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Only allow one video - clear previous videos and set the new one
      setVideos([e.target.files[0]]);
    }
  };

  const resetFileUploads = () => {
    setImages([]);
    setVideos([]);
    setThumbnail(null);
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  const {
    formState: { title, description, difficultyLevel, type, estimatedTime, timeUnit },
    updateField,
    handleSubmit,
    isLoading: isSubmitting,
    error,
    errors,     // These errors come from useFormValidation via usePostSubmission
    submitted,
    isFormValid,
  } = usePostSubmission({
    images,
    videos,
    thumbnail,
    onAddNewPost,
    setShowAddNewPost,
    resetFileUploads,
    selectedMaterials,
    defaultStatus: "PUBLISH",
    token,
  });

  // Log errors when they change for debugging
  useEffect(() => {
    console.log('Current validation errors:', errors);
  }, [errors]);

  // Extract only the numeric part of estimated time
  const parseEstimatedTime = () => {
    if (!estimatedTime) return "";
    // Extract just the numeric part by removing any non-numeric characters
    return estimatedTime.replace(/[^0-9]/g, '');
  };

  // Handle time value change - store only the numeric value
  const handleTimeValueChange = (value: string) => {
    // Keep only numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    updateField("estimatedTime", numericValue);
  };

  // Handle time unit change
  const handleTimeUnitChange = (unit: 'minutes' | 'hours') => {
    updateField("timeUnit", unit);
  };

  // Log the current state whenever it changes
  useEffect(() => {
    console.log('Current form type:', type);
    console.log('Images count:', images.length);
    console.log('Videos count:', videos.length);
    console.log('Has thumbnail:', thumbnail ? 'Yes' : 'No');
  }, [type, images, videos, thumbnail]);

  // Handle type change with proper type casting
  const handleTypeChange = (value: PostType | string) => {
    // Cast the value to PostType if it's a valid enum value
    if (Object.values(PostType).includes(value as PostType)) {
      updateField("type", value as PostType);
      console.log('Type changed to:', value);
      
      // Clear thumbnail if switching to video type
      if (value === PostType.VIDEO && thumbnail) {
        setThumbnail(null);
      }
      // Also clear videos if switching to image type
      if (value === PostType.IMAGE && videos.length > 0) {
        setVideos([]);
      }
    } else {
      // If it's not a valid enum value, update with empty string
      updateField("type", "");
    }
  };

  // Handle difficulty level change with proper type casting
  const handleDifficultyChange = (value: PostDifficulty | string) => {
    // Check if the value is a valid enum value
    if (Object.values(PostDifficulty).includes(value as PostDifficulty)) {
      updateField("difficultyLevel", value as PostDifficulty);
    } else {
      // If it's not a valid enum value, update with empty string
      updateField("difficultyLevel", "");
    }
  };

  // Validate form before submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // First validate with useFormValidation (via isFormValid function)
    if (!isFormValid()) {
      console.log('Form validation failed with errors:', errors);
      return;
    }
    
    console.log('Form validated successfully, submitting...');
    console.log('Submitting form with type:', type);
    console.log('Form data:', {
      title,
      description,
      difficultyLevel,
      type,
      estimatedTime: estimatedTime ? `${estimatedTime} ${timeUnit}` : '',
      materials: selectedMaterials.length,
      images: images.length,
      videos: videos.length,
      thumbnail: !!thumbnail
    });
    
    handleSubmit(e);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading materials...</div>;
  }

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Add New Post</h2>
      {error && <div className='text-red-500 mb-4 p-3 bg-red-50 rounded'>{error}</div>}

      <form onSubmit={handleFormSubmit}>
        <PostFormFields
          title={title}
          description={description}
          postDifficulty={difficultyLevel}
          postType={type}
          materials={materials}
          selectedMaterials={selectedMaterials}
          errors={errors}
          onTitleChange={(value) => updateField("title", value)}
          onDescriptionChange={(value) => updateField("description", value)}
          onDifficultyChange={handleDifficultyChange}
          onTypeChange={handleTypeChange}
          onMaterialsChange={setSelectedMaterials}
          estimatedTime={parseEstimatedTime()}
          timeUnit={timeUnit || 'minutes'}
          onEstimatedTimeChange={handleTimeValueChange}
          onTimeUnitChange={handleTimeUnitChange}
        />

        {type === PostType.IMAGE && (
          <FileUploadSection
            images={images}
            thumbnail={thumbnail}
            errors={errors}  // Pass errors to FileUploadSection
            onImagesChange={handleImageChange}
            onThumbnailChange={handleThumbnailChange}
            onRemoveImage={handleRemoveImage}
            onRemoveThumbnail={handleRemoveThumbnail}
            onImageView={handleImageView}
            onThumbnailView={handleThumbnailView}
          />
        )}

        {type === PostType.VIDEO && (
          <VideoUploadSection
            videos={videos}
            errors={errors}  // Pass errors to VideoUploadSection
            onVideosChange={handleVideoChange}
            onRemoveVideo={handleRemoveVideo}
            onVideoView={handleVideoView}
          />
        )}

        <div className='flex justify-end mt-6'>
          <button
            type='button'
            onClick={() => setShowAddNewPost(false)}
            className='px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light disabled:bg-gray-400 disabled:cursor-not-allowed'
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Post"}
          </button>
        </div>
      </form>

      {selectedImage && (
        <ImagePreview
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {selectedVideo && (
        <VideoPreview
          src={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default AddNewPost;