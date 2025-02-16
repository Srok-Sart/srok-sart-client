import Image from "next/image";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa";

interface CardProps {
  src: string;
  title: string;
  creator: string;
}

const CardDisplay = ({ src, title, creator }: CardProps) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className='relative bg-white rounded-lg overflow-hidden shadow-sm break-inside-avoid group'>
      {/* Image Wrapper */}
      <div className='relative overflow-hidden rounded-lg'>
        <Image
          src={src}
          alt={title}
          width={300}
          height={400}
          className='w-full object-cover rounded-lg'
        />
        {/* Overlay with Creator Info & Save Button */}
        <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 rounded-lg'>
          <div className='flex justify-between items-center'>
            <p className='text-white font-medium'>{creator}</p>
            <button
              className={`save-btn transition-transform transform ${
                saved ? "scale-110" : "scale-100"
              }`}
              onClick={() => setSaved(!saved)}
            >
              <FaBookmark
                className={`save-icon ${
                  saved ? "text-yellow-400" : "text-white"
                }`}
                size={16}
              />
            </button>
          </div>
          <div className='flex gap-2'>
            <button className='round-button'>
              <Image
                src='https://cdn-icons-png.flaticon.com/512/3580/3580382.png'
                width={16}
                height={16}
                alt='Share'
              />
            </button>
            <button className='round-button'>
              <Image
                src='https://cdn-icons-png.flaticon.com/512/512/512142.png'
                alt='More'
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Image Title */}
      <div className='p-2'>
        <h3 className='text-sm font-semibold text-gray-900'>{title}</h3>
      </div>
    </div>
  );
};

export default CardDisplay;
