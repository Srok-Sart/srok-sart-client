"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBookmark, FaTimes } from "react-icons/fa";
import { Post } from "../interfaces/post";
import { fetchCollections, savePostToCollection, unsavePostFromCollection } from "../../api/bookmark";
import CollectionSelectModal from "../posts/[id]/collection-selection-modal";

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
  isInCollection?: boolean;
  collectionId?: string;
  onUnsave?: (postId: number) => void;
}

const CardDisplay = ({ post, isInCollection = false, collectionId, onUnsave }: CardProps) => {
  const [saved, setSaved] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    try {
      const fetchedCollections = await fetchCollections(); // Fetch collections
      setCollections(fetchedCollections);
      setShowCollections(true); // Show the modal
    } catch (error) {
      console.error("Error fetching collections:", error);
      alert("Failed to fetch collections. Please try again.");
    }
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
    <Link href={`/posts/${post.id}`}>
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
      <CollectionSelectModal
        showCollections={showCollections}
        setShowCollections={setShowCollections}
        collections={collections}
        handleCollectionSelect={handleCollectionSelect}
      />
    </Link>
  );
};

export default CardDisplay;