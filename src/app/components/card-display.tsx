"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBookmark, FaTimes } from "react-icons/fa";
import { Post } from "../interfaces/post";
import { fetchCollections, savePostToCollection, unsavePostFromCollection } from "../../api/bookmark";

interface Collection {
  id: string;
  name: string;
  saved?: number;
  isDefault?: boolean;
  thumbnails?: string[];
  description?: string;
  isPrivate?: boolean;
}

interface CardProps {
  post: Post;
  isInCollection?: boolean; // Add this prop to determine if the post is in a collection
  collectionId?: string; // Add this prop to pass the collection ID
  onUnsave?: (postId: number) => void; // Add this prop to handle unsave functionality
}

const CardDisplay = ({ post, isInCollection = false, collectionId, onUnsave }: CardProps) => {
  const [saved, setSaved] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    const collections = await fetchCollections();
    setCollections(collections);
    setShowCollections(true); // Show the modal for this post
  };

  const handleCollectionSelect = async (e: React.MouseEvent, collectionId: string) => {
    e.stopPropagation(); // Stop event propagation
    e.preventDefault(); // Prevent default behavior
  
    try {
      await savePostToCollection(collectionId, post.id);
      setSaved(true);
      setShowCollections(false); // Close the modal after saving
    } catch (error) {
      if (error instanceof Error && error.message === "Post already exists in the collection") {
        alert("This post is already in the collection.");
      } else {
        console.error("Error saving post to collection:", error);
        alert("Failed to save post. Please try again.");
      }
    }
  };

  const handleUnsaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    e.preventDefault(); // Prevent default behavior

    if (collectionId && onUnsave) {
      try {
        await unsavePostFromCollection(collectionId, post.id);
        onUnsave(post.id); // Notify the parent component to remove the post
      } catch (error) {
        console.error("Error unsaving post:", error);
        alert("Failed to unsave post. Please try again.");
      }
    }
  };

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
              {!isInCollection && ( // Only show the save button if the post is not in a collection
                <button
                  className={`save-btn transition-transform transform ${
                    saved ? "scale-110" : "scale-100"
                  }`}
                  onClick={handleSaveClick}
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

        {/* Unsave Button (only shown if the post is in a collection) */}
        {isInCollection && (
          <button
            onClick={handleUnsaveClick}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <FaTimes className="text-red-500" size={16} />
          </button>
        )}
      </div>

      {/* Collection Selection Modal */}
      {showCollections && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Choose a Collection</h2>
            <div className="grid grid-cols-2 gap-4">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={(e) => handleCollectionSelect(e, collection.id)}
                  className="p-4 border rounded-lg hover:bg-gray-100"
                >
                  {collection.name}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowCollections(false);
              }}
              className="mt-4 text-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Link>
  );
};

export default CardDisplay;