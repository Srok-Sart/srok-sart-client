"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { createCollection } from "../../../api/bookmark";
import { generateRandomColor } from "@/app/utils/colors";

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

interface CollectionSelectModalProps {
  showCollections: boolean;
  setShowCollections: React.Dispatch<React.SetStateAction<boolean>>;
  collections: Collection[];
  handleCollectionSelect: (
    e: React.MouseEvent,
    collectionId: string
  ) => Promise<void>;
  onCreateCollection: (newCollection: Collection) => void; // Add this prop
  isLoading: boolean;
}

const CollectionSelectModal: React.FC<CollectionSelectModalProps> = ({
  showCollections,
  setShowCollections,
  collections,
  handleCollectionSelect,
  onCreateCollection,
  isLoading,
}) => {
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCollections) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset body overflow
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCollections]);

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      setNotification({
        message: "Please enter a collection name.",
        type: "error",
      });
      return;
    }

    try {
      console.log("Creating collection..."); // Debugging
      const newCollection = await createCollection({
        name: newCollectionName,
        isPrivate: true,
      });

      console.log("New collection created:", newCollection); // Debugging

      const updatedCollection = {
        id: newCollection.id,
        name: newCollection.name,
        saved: 0,
        thumbnails: [],
        color: generateRandomColor(),
      };

      // Update the global state using the callback
      onCreateCollection(updatedCollection);

      setNotification({
        message: "Collection created successfully!",
        type: "success",
      });

      setNewCollectionName("");
      setIsCreatingCollection(false);
    } catch (error) {
      console.error("Failed to create collection:", error);
      setNotification({
        message: "Failed to create collection. Please try again.",
        type: "error",
      });
    }
  };

  if (!showCollections) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        e.stopPropagation(); // Stop event propagation
        if (!isCreatingCollection) {
          setShowCollections(false);
        }
      }}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md z-60"
        onClick={(e) => e.stopPropagation()} // Stop propagation inside the modal
      >
        <h2 className="text-xl font-bold mb-4">Save to Collection</h2>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-3 rounded-md ${
              notification.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {notification.message}
          </div>
        )}

        {collections.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            You don't have any collections yet. Create one to save this post.
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
                  {collection.thumbnails && collection.thumbnails.length > 0 ? (
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
            onClick={() => setShowCollections(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => setIsCreatingCollection(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Create New Collection
          </button>
        </div>

        {/* Create Collection Form */}
        {isCreatingCollection && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-70"
            onClick={(e) => e.stopPropagation()} // Prevent clicks on the inner modal's backdrop
          >
            <div className="bg-white p-6 rounded-lg shadow-lg relative z-80 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Enter collection name"
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setIsCreatingCollection(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="bg-[#6437A0] text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSelectModal;