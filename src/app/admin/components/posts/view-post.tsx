"use client";
import React, { useState, useEffect } from "react";
import { Post } from "@/app/interfaces/post";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

interface ViewPostProps {
  setShowViewPost: (show: boolean) => void;
  id: number;
  token: string;
}

const ViewPost = ({ setShowViewPost, id, token}: ViewPostProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Unauthorized: Please log in again');
          }
          throw new Error(`Failed to fetch post: ${res.statusText}`);
        }

        const data = await res.json();
        setPost(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error fetching post";
        setError(errorMessage);
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPost();
    } else {
      setError("Authentication token is missing");
      setLoading(false);
    }
  }, [id, token]);

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (post?.imageUrls && currentImageIndex < post.imageUrls.length) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const formatEstimatedTime = (timeString: string | undefined) => {
    if (!timeString) return "N/A";
    
    // Clean up any duplicated units
    const numericPart = timeString.replace(/[^0-9]/g, '');
    const isHours = timeString.toLowerCase().includes('hour');
    const unit = isHours ? 'hours' : 'minutes';
    
    return numericPart ? `${numericPart} ${unit}` : 'N/A';
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading post details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-4">Error Loading Post</h2>
          <p className="text-gray-600 mb-4">
            {error.includes('Unauthorized') 
              ? 'Your session has expired. Please log in again.'
              : error}
          </p>
          <button
            onClick={() => setShowViewPost(false)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl">Post not found.</p>
          <button
            onClick={() => setShowViewPost(false)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasImages = post.imageUrls && post.imageUrls.length > 0;
  const hasThumbnail = !!post.thumbnailUrl;
  const totalImages = (hasThumbnail ? 1 : 0) + (hasImages ? post.imageUrls.length : 0);

  return (
    <div className="w-full h-screen overflow-auto bg-gray-100">
      {/* Top Section with Back Button */}
      <div className="p-4 bg-white shadow-md sticky top-0 z-10 flex items-center justify-between">
        <button
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => setShowViewPost(false)}
        >
          <FaArrowLeft className="mr-2" /> Back to Posts
        </button>
        <h1 className="text-xl font-semibold truncate max-w-lg">{post.title}</h1>
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      {/* Image Gallery Section */}
      {totalImages > 0 ? (
        <div className="w-full h-[60vh] flex justify-center items-center bg-gray-800 relative">
          {/* Show the thumbnail first */}
          {hasThumbnail && currentImageIndex === 0 && (
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${post.thumbnailUrl}`}
                alt={`${post.title} - Thumbnail`}
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          )}

          {/* Show the images after the thumbnail */}
          {hasImages && currentImageIndex > (hasThumbnail ? 0 : -1) && 
           currentImageIndex <= (hasThumbnail ? post.imageUrls.length : post.imageUrls.length - 1) && (
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrls[hasThumbnail ? currentImageIndex - 1 : currentImageIndex]}`}
                alt={`${post.title} - Image ${currentImageIndex}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}

          {/* Image Navigation Controls */}
          {totalImages > 1 && (
            <>
              {/* Left navigation button */}
              <button
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md transition-opacity ${
                  currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
                }`}
                onClick={handlePrevImage}
                disabled={currentImageIndex === 0}
                aria-label="Previous image"
              >
                <FaArrowLeft className="text-gray-800" />
              </button>

              {/* Right navigation button */}
              <button
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md transition-opacity ${
                  currentImageIndex === totalImages - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
                }`}
                onClick={handleNextImage}
                disabled={currentImageIndex === totalImages - 1}
                aria-label="Next image"
              >
                <FaArrowRight className="text-gray-800" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {totalImages}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full py-16 bg-gray-800 flex justify-center items-center text-white">
          <p>No images available for this post</p>
        </div>
      )}

      {/* Post Details */}
      <div className="w-full p-8 bg-white shadow-md">
        <h2 className="text-3xl font-bold mb-6">{post.title}</h2>
        
        {/* Post Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Difficulty Level</h3>
            <p className="text-xl font-medium">{post.postDifficulty || "Not specified"}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Type</h3>
            <p className="text-xl font-medium">{post.postType || "Not specified"}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Estimated Time</h3>
            <p className="text-xl font-medium">{formatEstimatedTime(post.estimatedTime)}</p>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Description</h3>
          {post.description ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.description}
            </div>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>

        {/* Materials Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Materials Needed</h3>
          {post.postMaterials && post.postMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {post.postMaterials.map((material, index) => {
                // Check all possible property names for quantity
                const quantity = 
                  material.quantityRequired || 
                  material.quantity || 
                  (typeof material.material?.quantity !== 'undefined' ? material.material.quantity : 1);
                
                return (
                  <div 
                    key={index} 
                    className="flex items-center bg-green-50 p-4 rounded-lg border border-green-100"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-baseline">
                        <p className="font-semibold text-gray-800">
                          {material.material?.name || 'Unknown Material'}
                        </p>
                        <p className="ml-2 text-sm font-medium text-gray-600">
                          × {quantity}
                        </p>
                      </div>
                      {material.material?.description && (
                        <p className="text-sm text-gray-600 mt-1">{material.material.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600">No materials required for this post.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPost;