import Image from "next/image";

interface ImagePreviewProps {
  src: string;
  onClose: () => void;
}

export const ImagePreview = ({ src, onClose }: ImagePreviewProps) => {
  const isBlob = src.startsWith("blob:") || src.startsWith("data:");

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-3xl h-[80vh] bg-white rounded-lg overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        {isBlob ? (
          <Image
            src={src}
            alt='Preview'
            className='object-contain w-full h-full'
          />
        ) : (
          <Image
            src={src}
            alt='Preview'
            className='object-contain'
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw'
            priority
          />
        )}
        <button
          className='absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100'
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
