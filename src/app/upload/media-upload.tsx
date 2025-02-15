import React from "react";
import { FaUpload, FaTrash } from "react-icons/fa";

interface MediaUploadProps {
  uploadType: "video" | "photo";
  setUploadType: React.Dispatch<React.SetStateAction<"video" | "photo">>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleThumbnailUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFiles: File[];
  thumbnail: File | null;
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setThumbnail: React.Dispatch<React.SetStateAction<File | null>>;
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
}) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-800 font-medium">
        Upload Type <span className="text-red-500">*</span>
      </label>
    </div>
    <div className="flex gap-3 bg-gray-100 p-1 rounded-full w-fit mb-4">
      {["video", "photo"].map((type) => (
        <button
          key={type}
          className={`px-6 py-2 rounded-full font-semibold ${
            uploadType === type ? "bg-[var(--primary-color)] text-white" : "text-gray-700"
          }`}
          onClick={() => {
            setUploadType(type as "video" | "photo");
            setUploadedFiles([]);
            if (type === "video") setThumbnail(null);
          }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
    <div className="border-2 border-dashed p-6 text-center bg-purple-50 rounded-lg mt-4 relative">
      <label className="cursor-pointer flex flex-col items-center gap-2">
        <FaUpload className="text-gray-600" size={20} />
        <input
          type="file"
          multiple={uploadType === "photo"}
          accept={uploadType === "video" ? "video/*" : "image/*"}
          className="hidden"
          onChange={handleFileUpload}
        />
        <span className="text-gray-600">Drop file or browse</span>
      </label>
    </div>
    {uploadType === "photo" && (
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900">Upload Thumbnail</h3>
        <p className="text-sm text-gray-600">
          Please upload a file in jpeg or png format and ensure the file size is under 25 MB.
        </p>
        <div className="border-2 border-dashed p-6 text-center bg-gray-50 rounded-lg">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <FaUpload className="text-gray-600" size={20} />
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
            <span className="text-gray-600">Drop file or browse</span>
          </label>
        </div>
        {thumbnail && (
          <div className="relative mt-4">
            <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="w-full h-auto rounded-lg" />
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded-md shadow-md"
              onClick={() => setThumbnail(null)}
            >
              <FaTrash size={16} className="text-red-500" />
            </button>
          </div>
        )}
      </div>
    )}
  </>
);

export default MediaUpload;
