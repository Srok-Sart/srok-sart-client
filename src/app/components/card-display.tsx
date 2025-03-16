"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaBookmark, FaTimes, FaPlay } from "react-icons/fa";
import { Post } from "../interfaces/post";
import {
  fetchCollections,
  savePostToCollection,
  unsavePostFromCollection,
  createCollection,
} from "../../api/bookmark";
import CollectionSelectModal from "../posts/[id]/collection-selection-modal";
import { generateRandomColor } from "@/app/utils/colors";
import { PostType } from "@/enums/post-type.enum";

interface Collection {
  id: string;
  name: string;
  saved?: number;
  isDefault?: boolean;
  thumbnails?: string[];
  description?: string;
  isPrivate?: boolean;
  color?: string;
}

interface CardProps {
  post: Post;
  isInCollection?: boolean;
  collectionId?: string;
  onUnsave?: (postId: number) => void;
}

const CardDisplay = ({
  post,
  isInCollection = false,
  collectionId,
  onUnsave,
}: CardProps) => {
  const [saved, setSaved] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  // Video-specific states (only used for video posts)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string>("0:00");

  // Check if post is a video type
  const isVideoPost = post.postType === PostType.VIDEO;

  // Detect if the device is mobile (only matters for video posts)
  useEffect(() => {
    if (!isVideoPost) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isVideoPost]);

  const handleCreateCollection = (newCollection: Collection) => {
    setCollections((prevCollections) => [...prevCollections, newCollection]);
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop event propagation
    setIsLoading(true); // Set loading state
    try {
      const fetchedCollections = await fetchCollections(); // Fetch collections
      setCollections(fetchedCollections);
      setShowCollections(true); // Show the modal
    } catch (error) {
      console.error("Error fetching collections:", error);
      alert("Failed to fetch collections. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleCollectionSelect = async (
    e: React.MouseEvent,
    collectionId: string
  ) => {
    e.stopPropagation(); // Stop event propagation
    e.preventDefault(); // Prevent default behavior
    setIsLoading(true); // Set loading state
    try {
      await savePostToCollection(collectionId, post.id);
      setSaved(true);
      setShowCollections(false); // Close the modal after saving
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Post already exists in the collection"
      ) {
        alert("This post is already in the collection.");
      } else {
        console.error("Error saving post to collection:", error);
        alert("Failed to save post. Please try again.");
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleUnsaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    e.preventDefault(); // Prevent default behavior

    if (collectionId && onUnsave) {
      setIsLoading(true); // Set loading state
      try {
        await unsavePostFromCollection(collectionId, post.id);
        onUnsave(post.id); // Notify the parent component to remove the post
      } catch (error) {
        console.error("Error unsaving post:", error);
        alert("Failed to unsave post. Please try again.");
      } finally {
        setIsLoading(false); // Reset loading state
      }
    }
  };

  const handleCreateNewCollection = async () => {
    if (!newCollectionName.trim()) {
      alert("Please enter a collection name.");
      return;
    }

    try {
      const newCollection = await createCollection({
        name: newCollectionName,
        isPrivate: true,
      });

      handleCreateCollection({
        id: newCollection.id,
        name: newCollection.name,
        saved: 0,
        thumbnails: [],
        color: generateRandomColor(), // Assign a random color
      });

      setNewCollectionName("");
      setIsCreatingCollection(false);
    } catch (error) {
      console.error("Failed to create collection:", error);
      alert("Failed to create collection. Please try again.");
    }
  };

  // Video-specific handlers (only used for video posts)
  const handleVideoPlay = (e: React.MouseEvent) => {
    if (!isVideoPost || !videoRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoMouseEnter = () => {
    if (!isVideoPost || isMobile || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleVideoMouseLeave = () => {
    if (!isVideoPost || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle video metadata loading to get duration
  const handleVideoMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoDuration(formatDuration(videoRef.current.duration));
    }
  };

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm break-inside-avoid group">
      {/* Image/Video Wrapper */}
      <Link href={`/posts/${post.id}`} passHref>
        <div 
          className="relative overflow-hidden rounded-lg cursor-pointer"
          onMouseEnter={isVideoPost ? handleVideoMouseEnter : undefined}
          onMouseLeave={isVideoPost ? handleVideoMouseLeave : undefined}
        >
          {isVideoPost ? (
            <>
              <video
                ref={videoRef}
                src={post.imageUrls && post.imageUrls.length > 0 ? 
                  `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrls[0]}` : undefined}
                className="w-full object-cover rounded-lg"
                width={300}
                height={400}
                loop
                muted
                playsInline
                poster={process.env.NEXT_PUBLIC_API_URL + post.thumbnailUrl}
                onLoadedMetadata={handleVideoMetadata}
              />
              {(isMobile || !isPlaying) && (
                <div
                  onClick={handleVideoPlay}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="bg-black bg-opacity-40 rounded-full p-3">
                    <FaPlay className="text-white" size={24} />
                  </div>
                </div>
              )}
              
              {/* Video Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
                {videoDuration}
              </div>
            </>
          ) : (
            <Image
              src={process.env.NEXT_PUBLIC_API_URL + post.thumbnailUrl}
              alt={post.title}
              width={300}
              height={400}
              className="w-full object-cover rounded-lg"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-white font-medium">{post.title}</p>
              {!isInCollection && ( // Only show the save button if the post is not in a collection
                <button
                  className={`save-btn transition-transform transform ${
                    saved ? "scale-110" : "scale-100"
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the Link from navigating
                    e.stopPropagation(); // Stop event propagation
                    handleSaveClick(e);
                  }}
                >
                  <FaBookmark
                    className={`save-icon ${
                      saved ? "text-yellow-400" : "text-white"
                    }`}
                    size={16}
                  />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {post.imageUrls?.map((url, index) => {
                // For video posts, skip the first URL as it's the video itself
                if (isVideoPost && index === 0) return null;
                return (
                  <Image
                    key={index}
                    src={process.env.NEXT_PUBLIC_API_URL + url}
                    alt={post.title}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Link>
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-900">{post.title}</h3>
      </div>

      {/* Unsave Button (only shown if the post is in a collection) */}
      {isInCollection && (
        <button
          onClick={handleUnsaveClick}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <FaTimes className="text-red-500" size={16} />
        </button>
      )}

      {/* Collection Selection Modal */}
      {showCollections && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation(); // Stop event propagation
            setShowCollections(false); // Close the modal when clicking outside
          }}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md z-60"
            onClick={(e) => e.stopPropagation()} // Stop propagation inside the modal
          >
            <h2 className="text-xl font-bold mb-4">Save to Collection</h2>
            {collections.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                You don't have any collections yet. Create one to save this
                post.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={(e) => handleCollectionSelect(e, collection.id)}
                    className="p-4 border rounded-lg hover:bg-gray-100 transition flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                      {collection.thumbnails &&
                      collection.thumbnails.length > 0 ? (
                        <Image
                          src={collection.thumbnails[0]}
                          alt={collection.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FaBookmark className="text-gray-400" size={24} />
                      )}
                    </div>
                    <span className="font-medium">{collection.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  setShowCollections(false); // Close the modal
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  setIsCreatingCollection(true); // Open the create collection form
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create New Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreatingCollection && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" // Higher z-index
          onClick={(e) => {
            e.stopPropagation(); // Stop event propagation
            setIsCreatingCollection(false); // Close the form when clicking outside
          }}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative z-[110] w-full max-w-md" // Higher z-index
            onClick={(e) => e.stopPropagation()} // Stop propagation inside the form
          >
            <h2 className="text-xl font-semibold mb-4">
              Create New Collection
            </h2>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter collection name"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  setIsCreatingCollection(false); // Close the form
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewCollection}
                className="bg-[#6437A0] text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDisplay;