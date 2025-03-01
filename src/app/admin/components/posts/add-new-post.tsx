import { Post } from '@/app/interfaces/post';
import { PostType } from '@/enums/post-type.enum';
import { PostFormFields } from './subcomponents/post-form';
import { FileUploadSection } from './subcomponents/file-upload-section';
import { ImagePreview } from './subcomponents/image-preview';
import { useFileUpload } from '@/hooks/use-file-upload';
import { usePostSubmission } from '@/hooks/use-post-submission';
import { Material } from '@/app/interfaces/material';
import React, { useEffect, useState } from 'react';

type AddNewPostProps = {
  setShowAddNewPost: (show: boolean) => void;
  onAddNewPost: (post: Post) => void;
};

const AddNewPost = ({ setShowAddNewPost, onAddNewPost }: AddNewPostProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  useEffect(() => {
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
    fetchMaterials();
  }, []);

  const {
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
  } = useFileUpload();

  const resetFileUploads = () => {
    setImages([]);
    setThumbnail(null);
  };

  const {
    formState: { title, description, difficultyLevel, type, estimatedTime },
    updateField,
    handleSubmit,
    isLoading,
    error,
    isFormValid,
  } = usePostSubmission({
    images,
    thumbnail,
    onAddNewPost,
    setShowAddNewPost,
    resetFileUploads,
    selectedMaterials,
    defaultStatus: "PUBLISH" 
  });

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Add New Post</h2>
      {error && <div className='text-red-500 mb-4'>{error}</div>}

      <form onSubmit={handleSubmit}>
        <PostFormFields
          title={title}
          description={description}
          postDifficulty={difficultyLevel}
          postType={type}
          materials={materials}
          selectedMaterials={selectedMaterials}
          onTitleChange={(value) => updateField("title", value)}
          onDescriptionChange={(value) => updateField("description", value)}
          onDifficultyChange={(value) => updateField("difficultyLevel", value)}
          onTypeChange={(value) => updateField("type", value)}
          onMaterialsChange={setSelectedMaterials}
          estimatedTime={estimatedTime}
          onEstimatedTimeChange={(value) => updateField("estimatedTime", value)}
        />

        {type === PostType.IMAGE && (
          <FileUploadSection
            images={images}
            thumbnail={thumbnail}
            onImagesChange={handleImageChange}
            onThumbnailChange={handleThumbnailChange}
            onRemoveImage={handleRemoveImage}
            onRemoveThumbnail={handleRemoveThumbnail}
            onImageView={handleImageView}
            onThumbnailView={handleThumbnailView}
          />
        )}

        <div className='flex justify-end'>
          <button
            type='button'
            onClick={() => setShowAddNewPost(false)}
            className='px-4 py-2 bg-gray-500 text-white rounded-md mr-2'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-primary text-white rounded-md'
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Submitting..." : "Add Post"}
          </button>
        </div>
      </form>

      {selectedImage && (
        <ImagePreview
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default AddNewPost;