"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Post } from "@/app/interfaces/post";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { PostType } from "@/enums/post-type.enum";

interface CreatedPostsTabProps {
  userId: number;
  token: string; // Add token to props
}

export default function CreatedPostsTab({ userId, token }: CreatedPostsTabProps) {
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's posts when the component mounts
  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  // Function to fetch posts created by the current user
  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/posts`;
      
      const response = await fetch(apiUrl, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add token to request
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const result = await response.json();
      
      if (result && Array.isArray(result.data)) {
        // Filter posts to include only those created by the current user
        const userPosts = result.data.filter((post: Post) => 
          post.user?.id === userId
        );
        setUserPosts(userPosts);
      } else {
        setUserPosts([]);
        console.error("Unexpected response structure", result);
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      setUserPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // The rest of your component remains the same
  // ...

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to add event listeners to videos after render
  useEffect(() => {
    if (!isLoading && userPosts.length > 0) {
      // Find all video elements and set up event listeners
      const videoElements = document.querySelectorAll('video');
      
      videoElements.forEach(video => {
        // Update duration display when metadata is loaded
        if (!video.getAttribute('data-listeners-attached')) {
          video.addEventListener('loadedmetadata', function() {
            const duration = formatDuration(video.duration);
            const durationBadge = video.parentElement?.querySelector('.absolute.bottom-2.right-2');
            if (durationBadge) {
              durationBadge.textContent = duration;
            }
          });
          
          // Handle mouseenter for desktop devices - auto play
          video.parentElement?.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Only for desktop
              video.play().catch(() => {});
              video.setAttribute('data-is-playing', 'true');
              
              // Hide play button while hovering
              const playButton = video.parentElement?.querySelector('.play-button-container');
              if (playButton) {
                playButton.classList.add('opacity-0');
              }
            }
          });
          
          // Handle mouseleave - pause and reset
          video.parentElement?.addEventListener('mouseleave', function() {
            video.pause();
            video.currentTime = 0;
            video.setAttribute('data-is-playing', 'false');
            
            // Show play button when not hovering
            const playButton = video.parentElement?.querySelector('.play-button-container');
            if (playButton) {
              playButton.classList.remove('opacity-0');
            }
          });
          
          // Mark this video as having listeners attached
          video.setAttribute('data-listeners-attached', 'true');
        }
      });
    }
  }, [isLoading, userPosts, router]);

  // Function to render post thumbnail card
  const renderPostThumbnailCard = (post: Post) => {
    // Check if post is a video type
    const isVideoPost = post.postType === PostType.VIDEO;
    
    return (
      <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group flex flex-col h-full max-h-[520px]">
        {/* Post Thumbnail */}
        <div 
          className="relative overflow-hidden cursor-pointer aspect-[4/3]"
          onClick={() => router.push(`/posts/${post.id}`)}
          data-post-id={post.id}
        >
          {isVideoPost ? (
            <>
              <video
                className="w-full h-full object-contain rounded-lg bg-gray-100"
                src={post.imageUrls && post.imageUrls.length > 0 ? 
                  `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrls[0]}` : undefined}
                loop
                muted
                playsInline
                poster={post.thumbnailUrl ? process.env.NEXT_PUBLIC_API_URL + post.thumbnailUrl : undefined}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  if (video && video.duration) {
                    // Set duration attribute in the data attribute
                    video.setAttribute('data-duration', formatDuration(video.duration));
                  }
                }}
                data-is-playing="false"
              />
              <div className="absolute inset-0 flex items-center justify-center z-10 play-button-container">
                <div className="bg-black bg-opacity-40 rounded-full p-3">
                  <FaPlay className="text-white" size={24} />
                </div>
              </div>
              
              {/* Video Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
                0:00
              </div>
            </>
          ) : (
            <>
              {post.thumbnailUrl ? (
                <Image 
                  src={process.env.NEXT_PUBLIC_API_URL + post.thumbnailUrl}
                  alt={post.title} 
                  className="w-full h-full object-contain bg-gray-100 transition-transform duration-300 group-hover:scale-105"
                  width={300}
                  height={200}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          {/* Title and Status Badge */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800 line-clamp-1">{post.title}</h3>
            {post.postStatus && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                post.postStatus === 'PUBLISH' 
                  ? 'bg-green-100 text-green-700' 
                  : post.postStatus === 'PENDING' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-red-100 text-red-700'
              }`}>
                {post.postStatus}
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {post.description || "No description available"}
          </p>
          
          {/* Tags and metadata */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.postType && (
              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                {post.postType}
              </span>
            )}
            {post.postDifficulty && (
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                {post.postDifficulty}
              </span>
            )}
          </div>
          
          {/* Date and View Button */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
              })}
            </span>
            <button 
              onClick={() => router.push(`/posts/${post.id}`)}
              className="px-4 py-2 text-sm rounded-full bg-[var(--primary-color)] text-white hover:opacity-90 transition-opacity"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-4">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
          <p className="mt-2 text-gray-600">Loading your posts...</p>
        </div>
      ) : userPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.map(post => renderPostThumbnailCard(post))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Your Created Posts</h2>
          <p className="text-gray-500 mb-6">No posts yet? Start creating now.</p>
          <button
            onClick={() => router.push("/upload")}
            className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90 shadow-sm flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Post
          </button>
        </div>
      )}
    </div>
  );
}