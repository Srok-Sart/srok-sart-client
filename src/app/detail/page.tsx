"use client";

import React from "react";
import Image from "next/image";
import { FaHeart, FaBookmark, FaShareAlt } from "react-icons/fa";
import Navigation from "../components/navigation";
import "../globals.css";

interface Post {
  title: string;
  postType?: string;
  description?: string;
  imageUrls: string[];
  thumbnailUrl: string;
}

interface DetailPageProps {
  post: Post;
}

const DetailPage: React.FC<DetailPageProps> = ({ post }) => {
  return (
    <>
      <Navigation />
      <div className="pt-16 max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Left: Image Section */}
        <div className="flex-1">
          <Image
            src={process.env.NEXT_PUBLIC_API_URL + post.imageUrls} 
            alt={post.title}
            width={600}
            height={800}
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Right: Post Details */}
        <div className="flex-1 space-y-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3">
            <Image
              src="/grid/img1.png" // Replace with actual creator image URL if available
              alt="Creator"
              width={30}
              height={30}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-lg font-semibold">Mr. Cat</p>
          </div>

          <h5 className="text-gray-900">{post.title}</h5>

          {/* Post Description */}
          <p className="text-gray-700">{post.description}</p>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-red-500 transition">
              <FaHeart size={22} />
            </button>
            <button className="save-btn">
              <FaBookmark className="save-icon" size={22} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition">
              <FaShareAlt size={22} />
            </button>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-lg font-semibold mt-4">Comments</h3>
            <div className="mt-2 border rounded-lg p-2 flex items-center">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;