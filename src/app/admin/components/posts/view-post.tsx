"use client";
import React, { useState, useEffect } from "react";
import { Post } from "@/app/interfaces/post";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

interface ViewPostProps {
  setShowViewPost: (show: boolean) => void;
  id: number;
}

const ViewPost = ({ setShowViewPost, id }: ViewPostProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch post: ${res.statusText}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        setError("Error fetching post. Please try again.");
        console.error("Fetch error:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < post!.imageUrls.length) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="p-4 text-center">Loading post...</div>;
  }

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Top Section with Back Button */}
      <div className="p-4 bg-white shadow-md flex items-center">
        <button
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => setShowViewPost(false)}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {/* Full-Width Image with Navigation */}
      <div className="w-full h-[70vh] flex justify-center items-center bg-gray-200 relative">
        {/* Show the thumbnail first */}
        {post.thumbnailUrl && currentImageIndex === 0 && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${post.thumbnailUrl}`}
            alt="Thumbnail"
            layout="fill"
            objectFit="contain"
            className="absolute top-0 left-0"
          />
        )}

        {/* Show the images after the thumbnail */}
        {post.imageUrls && currentImageIndex > 0 && currentImageIndex <= post.imageUrls.length && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrls[currentImageIndex - 1]}`}
            alt="Post Image"
            layout="fill"
            objectFit="contain"
          />
        )}

        {/* Left navigation button */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          onClick={handlePrevImage}
          disabled={currentImageIndex === 0}
        >
          <FaArrowLeft />
        </button>

        {/* Right navigation button */}
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          onClick={handleNextImage}
          disabled={currentImageIndex === post.imageUrls.length}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Post Details */}
      <div className="w-full p-8 bg-white">
        <h2 className="text-4xl font-bold mb-4">{post.title}</h2>
        <p className="text-gray-600 mb-6 text-lg">{post.description}</p>

        {/* Post Metadata */}
        <div className="flex justify-between text-lg text-gray-700 mb-6">
          <p><strong>Difficulty:</strong> {post.postDifficulty}</p>
          <p><strong>Type:</strong> {post.postType}</p>
          <p><strong>Estimated Time:</strong> {post.estimatedTime}</p>
        </div>

        {/* Post Materials */}
        {post.materials && post.materials.length > 0 && (
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4">Materials</h3>
            <ul className="list-disc list-inside">
              {post.materials.map((material) => (
                <li key={material.id} className="text-lg text-gray-700">
                  {material.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPost;