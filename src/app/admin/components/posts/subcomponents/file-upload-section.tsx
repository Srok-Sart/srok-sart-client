import { FileOrUrl } from "@/interfaces/post";
import { FilePreview } from "./file-upload-preview";

interface FileUploadSectionProps {
  images: FileOrUrl[];
  thumbnail: FileOrUrl | null;
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
  onImagesChange,
  onThumbnailChange,
  onRemoveImage,
  onRemoveThumbnail,
  onImageView,
  onThumbnailView,
}: FileUploadSectionProps) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-700">Upload Images</label>
      <input
        type="file"
        multiple
        onChange={onImagesChange}
        className="w-full px-3 py-2 border rounded-md"
      />
      <div className="mt-2 space-y-2">
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
    <div className="mb-4">
      <label className="block text-gray-700">Upload Thumbnail</label>
      <input
        type="file"
        onChange={onThumbnailChange}
        className="w-full px-3 py-2 border rounded-md"
      />
      {thumbnail && (
        <FilePreview
          file={thumbnail}
          onRemove={onRemoveThumbnail}
          onView={onThumbnailView}
        />
      )}
    </div>
  </>
);