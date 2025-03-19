"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaBookmark, FaEdit, FaEllipsisV, FaTag, FaTrash } from "react-icons/fa";
import { deleteCollection, fetchPostsInCollection, updateCollection } from "../../api/bookmark";
import useClickOutside from "../../hooks/use-click-outside";
import { Post } from "../interfaces/post";
import { BookmarkCollection } from "../interfaces/collection"; 
import { generateRandomColor } from "@/app/utils/colors";

interface CollectionCardProps {
  collection: BookmarkCollection; // Use BookmarkCollection
  setCollections: React.Dispatch<React.SetStateAction<BookmarkCollection[]>>;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, setCollections }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [posts, setPosts] = useState<Post[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>(generateRandomColor());
  const menuRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

  // Fetch posts in the collection when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await fetchPostsInCollection(collection.id);
        setPosts(posts);

        // Update the saved count in the collection
        setCollections((prev) =>
          prev.map((col) =>
            col.id === collection.id ? { ...col, saved: posts.length } : col
          )
        );
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        if (error instanceof Error && error.message.includes("401")) {
          alert("Your session has expired. Please log in again.");
          router.push("/login");
        }
      }
    };

    fetchPosts();
  }, [collection.id, setCollections]);

  const handleNavigateToCollection = () => {
    router.push(`/bookmark/${collection.id}`);
  };

  const handleDeleteCollection = async () => {
    if (!window.confirm("Are you sure you want to delete this collection?")) {
      return;
    }

    try {
      await deleteCollection(collection.id);
      setCollections((prev) => prev.filter((col) => col.id !== collection.id));
    } catch (error) {
      console.error("Failed to delete collection:", error);
      if (error instanceof Error && error.message.includes("401")) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
      } else {
        alert("Failed to delete collection. Please try again.");
      }
    }
  };

  const handleEditCollection = async () => {
    try {
      const updatedCollection = await updateCollection(collection.id, {
        name: editName,
        isPrivate: true,
      });

      setCollections((prev) =>
        prev.map((col) =>
          col.id === collection.id ? { ...col, name: updatedCollection.name } : col
        )
      );
    } catch (error) {
      console.error("Failed to update collection:", error);
      if (error instanceof Error && error.message.includes("401")) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
      } else {
        alert("Failed to update collection. Please try again.");
      }
    }
    setIsEditing(false);
    setMenuOpen(false);
  };

  // Get the thumbnail URL of the first post (if available)
  const firstPostThumbnail = posts.length > 0 ? posts[0].thumbnailUrl : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl relative">
      <div
        className="relative w-full h-48 overflow-hidden rounded-md cursor-pointer flex items-center justify-center"
        onClick={handleNavigateToCollection}
        style={{
          backgroundColor: firstPostThumbnail ? "transparent" : backgroundColor, // Fallback color
          backgroundImage: firstPostThumbnail
            ? `url(${process.env.NEXT_PUBLIC_API_URL + firstPostThumbnail})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {firstPostThumbnail && (
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        )}
        {!firstPostThumbnail && (
          <FaBookmark className="text-white text-6xl opacity-80" />
        )}
      </div>

      {isEditing ? (
        <div className="mt-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border p-2 w-full rounded text-[#6437A0]"
            autoFocus
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleEditCollection}
              className="bg-[#6437A0] text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      ) : (
        <h3 className="font-semibold text-lg mt-2 flex items-center">
          {collection.isDefault && <FaTag className="text-[#6437A0] mr-2" />}
          {collection.name}
        </h3>
      )}

      <p className="text-sm text-black">{collection.saved ?? 0} Saved</p>
      <p className="text-sm text-gray-500">{collection.description}</p>

      {!collection.isDefault && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute bottom-2 right-2 p-2"
          >
            <FaEllipsisV className="text-gray-500 hover:text-gray-800" />
          </button>
          {menuOpen && (
            <div className="absolute bottom-8 right-2 bg-white shadow-lg p-2 rounded-lg z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-[#6437A0] p-2 w-full"
              >
                <FaEdit /> <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteCollection}
                className="flex items-center space-x-2 text-red-500 p-2 w-full"
              >
                <FaTrash /> <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionCard;