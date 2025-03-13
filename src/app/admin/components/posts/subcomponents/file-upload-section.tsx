import React from 'react';
import { FileOrUrl } from "@/app/interfaces/post";
import { FilePreview } from "./file-upload-preview";
import { FaUpload, FaImage } from 'react-icons/fa';

interface FileUploadSectionProps {
  images: FileOrUrl[];
  thumbnail: FileOrUrl | null;
  errors?: Record<string, string>;
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveThumbnail: () => void;
  onImageView: (image: FileOrUrl) => void;
  onThumbnailView: () => void;
}

export const FileUploadSection = ({
  images,
  thumbnail,
  errors = {},
  onImagesChange,
  onThumbnailChange,
  onRemoveImage,
  onRemoveThumbnail,
  onImageView,
  onThumbnailView,
}: FileUploadSectionProps) => {
  return (
    <div className='mb-6 space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>
          Thumbnail <span className='text-red-500'>*</span>
        </h3>
        <div
          className={`border-2 border-dashed ${
            errors.thumbnail ? "border-red-500" : "border-gray-300"
          } p-6 rounded-lg text-center`}
        >
          <input
            type='file'
            id='thumbnail-upload'
            className='hidden'
            onChange={onThumbnailChange}
            accept='image/*'
          />
          <label
            htmlFor='thumbnail-upload'
            className='cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded inline-flex items-center justify-center transition duration-200'
          >
            <FaUpload className="mr-2" /> Upload Thumbnail
          </label>
          <p className='mt-2 text-gray-500'>
            This image will be shown as the preview of your post
          </p>
          {errors.thumbnail && (
            <p className='text-red-500 text-sm mt-1'>{errors.thumbnail}</p>
          )}
        </div>

        {thumbnail && (
          <div className='mt-4'>
            <h4 className='font-medium mb-2'>Thumbnail:</h4>
            <div className="w-48">
              <FilePreview 
                file={thumbnail} 
                onRemove={onRemoveThumbnail} 
                onView={onThumbnailView} 
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2'>
          Images <span className='text-red-500'>*</span>
        </h3>
        <div
          className={`border-2 border-dashed ${
            errors.images ? "border-red-500" : "border-gray-300"
          } p-6 rounded-lg text-center`}
        >
          <input
            type='file'
            id='images-upload'
            className='hidden'
            onChange={onImagesChange}
            accept='image/*'
            multiple
          />
          <label
            htmlFor='images-upload'
            className='cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded inline-flex items-center justify-center transition duration-200'
          >
            <FaImage className="mr-2" /> Upload Images
          </label>
          <p className='mt-2 text-gray-500'>
            You can upload multiple images to showcase your project
          </p>
          {errors.images && (
            <p className='text-red-500 text-sm mt-1'>{errors.images}</p>
          )}
        </div>

        {images.length > 0 && (
          <div className='mt-4'>
            <h4 className='font-medium mb-2'>Uploaded Images:</h4>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
              {images.map((image, index) => (
                <FilePreview
                  key={index}
                  file={image}
                  onRemove={() => onRemoveImage(index)}
                  onView={() => onImageView(image)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};