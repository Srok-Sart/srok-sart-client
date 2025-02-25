import Image from "next/image";
import React from "react";

interface MediaUploadProps {
  uploadType: "video" | "photo";
  setUploadType: (type: "video" | "photo") => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleThumbnailUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFiles: File[];
  thumbnail: File | null;
  setUploadedFiles: (files: File[]) => void;
  setThumbnail: (file: File | null) => void;
  errors?: {
    thumbnail?: string;
    contents?: string;
  };
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  uploadType,
  setUploadType,
  handleFileUpload,
  handleThumbnailUpload,
  uploadedFiles,
  thumbnail,
  setUploadedFiles,
  setThumbnail,
  errors,
}) => {
  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  return (
    <div className='mb-6'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Upload Type</h3>
        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={() => setUploadType("photo")}
            className={`px-4 py-2 rounded ${
              uploadType === "photo"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Photo
          </button>
          <button
            type='button'
            onClick={() => setUploadType("video")}
            className={`px-4 py-2 rounded ${
              uploadType === "video"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Video
          </button>
        </div>
      </div>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>
          Thumbnail <span className='text-red-500'>*</span>
        </h3>
        <div
          className={`border-2 border-dashed ${
            errors?.thumbnail ? "border-red-500" : "border-gray-300"
          } p-6 rounded-lg text-center`}
        >
          <input
            type='file'
            id='thumbnail-upload'
            className='hidden'
            onChange={handleThumbnailUpload}
            accept='image/*'
          />
          <label
            htmlFor='thumbnail-upload'
            className='cursor-pointer bg-primary hover:bg-primary text-white px-4 py-2 rounded inline-block'
          >
            Upload Thumbnail
          </label>
          <p className='mt-2 text-gray-500'>
            This image will be shown as the preview of your post
          </p>
          {errors?.thumbnail && (
            <p className='text-red-500 text-sm mt-1'>{errors.thumbnail}</p>
          )}
        </div>

        {thumbnail && (
          <div className='mt-4'>
            <h4 className='font-medium mb-2'>Thumbnail:</h4>
            <div className='relative w-48 h-32'>
              <Image
                src={URL.createObjectURL(thumbnail)}
                alt='Thumbnail'
                fill
                className='object-cover'
              />
              <button
                type='button'
                onClick={removeThumbnail}
                className='absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>
          Content <span className='text-red-500'>*</span>
        </h3>
        <div
          className={`border-2 border-dashed ${
            errors?.contents ? "border-red-500" : "border-gray-300"
          } p-6 rounded-lg text-center`}
        >
          <input
            type='file'
            id='file-upload'
            className='hidden'
            onChange={handleFileUpload}
            accept={uploadType === "photo" ? "image/*" : "video/*"}
            multiple={uploadType === "photo"}
          />
          <label
            htmlFor='file-upload'
            className='cursor-pointer bg-primary hover:bg-primary text-white px-4 py-2 rounded inline-block'
          >
            {uploadType === "photo" ? "Upload Photos" : "Upload Video"}
          </label>
          <p className='mt-2 text-gray-500'>
            {uploadType === "photo"
              ? "You can upload multiple photos"
              : "Upload a single video file"}
          </p>
          {errors?.contents && (
            <p className='text-red-500 text-sm mt-1'>{errors.contents}</p>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className='mt-4'>
            <h4 className='font-medium mb-2'>
              Uploaded {uploadType === "photo" ? "Photos" : "Video"}:
            </h4>
            <div className='flex flex-wrap gap-2'>
              {uploadedFiles.map((file, index) => (
                <div key={index} className='relative'>
                  {uploadType === "photo" ? (
                    <div className='w-24 h-24 bg-gray-100 relative'>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ) : (
                    <div className='w-48 h-24 bg-gray-100 flex items-center justify-center'>
                      <p className='text-sm text-gray-700'>{file.name}</p>
                    </div>
                  )}
                  <button
                    type='button'
                    onClick={() => removeFile(index)}
                    className='absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
