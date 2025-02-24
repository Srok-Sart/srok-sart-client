"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { Post } from "../interfaces/post";

interface CardProps {
  post: Post;
}

const CardDisplay = ({ post }: CardProps) => {
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`posts/${post.id}`}>
      <div className='relative bg-white rounded-lg overflow-hidden shadow-sm break-inside-avoid group'>
        {/* Image Wrapper */}
        <div className='relative overflow-hidden rounded-lg'>
          <Image
            src={process.env.NEXT_PUBLIC_API_URL + post.thumbnailUrl}
            alt={post.title}
            width={300}
            height={400}
            className='w-full object-cover rounded-lg'
          />
          <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 rounded-lg'>
            <div className='flex justify-between items-center'>
              <p className='text-white font-medium'>{post.title}</p>
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
              {post.imageUrls.map((url, index) => (
                <Image
                  key={index}
                  src={process.env.NEXT_PUBLIC_API_URL + url}
                  alt={post.title}
                  width={40}
                  height={40}
                  className='rounded-full'
                />
              ))}
            </div>
          </div>
        </div>
        <div className='p-2'>
          <h3 className='text-sm font-semibold text-gray-900'>{post.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CardDisplay;
