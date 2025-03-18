import Image from "next/image";
import React from "react";

interface ProfileImageProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ 
  src, 
  alt, 
  size = 40,
  className = ""
}) => {
  const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // If no src or it's null, show a default avatar icon
  if (!src) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="text-gray-400"
          style={{ width: `${size * 0.7}px`, height: `${size * 0.7}px` }}
        >
          <path 
            fillRule="evenodd" 
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    );
  }
  
  // If src doesn't start with http, prepend API base URL
  const imageSrc = src.startsWith('http') ? src : getApiBaseUrl() + src;
  
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className={`object-cover ${className}`}
    />
  );
};

export default ProfileImage;