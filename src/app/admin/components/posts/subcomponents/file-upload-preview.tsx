import { useEffect, useState } from "react";
import { FaFileImage, FaTrashAlt } from "react-icons/fa";
import { FileOrUrl } from "../../../../interfaces/post";

interface FilePreviewProps {
  file: FileOrUrl;
  onRemove: () => void;
  onView: () => void;
}

export const FilePreview = ({ file, onRemove, onView }: FilePreviewProps) => {
  const [fileSize, setFileSize] = useState<string>("Loading size...");
  const fileName =
    file instanceof File ? file.name : file.split("/").pop() || "Unknown";

  useEffect(() => {
    const fetchFileSize = async () => {
      if (file instanceof File) {
        setFileSize(`${(file.size / 1024).toFixed(2)} KB`);
        return;
      }

      try {
        const url = file.startsWith("http")
          ? file
          : `${process.env.NEXT_PUBLIC_API_URL}${file}`;
        const response = await fetch(url, { method: "HEAD" });
        const size = response.headers.get("content-length");
        if (size) {
          const sizeInKB = (parseInt(size) / 1024).toFixed(2);
          setFileSize(`${sizeInKB} KB`);
        } else {
          setFileSize("Size unknown");
        }
      } catch (error) {
        console.error("Error fetching file size:", error);
        setFileSize("Size unavailable");
      }
    };

    fetchFileSize();
  }, [file]);

  return (
    <div className='flex items-center border p-2 rounded-md'>
      <FaFileImage className='text-2xl text-gray-500 mr-2' />
      <div className='flex-1'>
        <div className='font-bold'>{fileName}</div>
        <div className='text-gray-500 text-sm'>{fileSize}</div>
        <button
          type='button'
          onClick={onView}
          className='text-primary hover:text-blue-700 underline'
        >
          View
        </button>
      </div>
      <button
        type='button'
        onClick={onRemove}
        className='text-red-500 hover:text-red-700'
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};
