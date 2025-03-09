"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { createCollection } from "../../api/bookmark";
import { generateRandomColor } from "@/app/utils/colors"; // Import the utility function

interface Collection {
  id: string;
  name: string;
  saved?: number;
  isDefault?: boolean;
  thumbnails?: string[];
  description?: string;
  isPrivate?: boolean;
  color: string; // Add this property
}

interface AddCollectionProps {
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
}

const AddCollection: React.FC<AddCollectionProps> = ({ setCollections }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) return;

    const newCollection = await createCollection({
      name: newCollectionName,
      isPrivate: true, // or false, depending on your logic
    });

    setCollections((prev) => [
      ...prev,
      {
        id: newCollection.id,
        name: newCollection.name,
        saved: 0,
        thumbnails: [], // No thumbnails initially
        color: generateRandomColor(), // Assign a random color
      },
    ]);

    setNewCollectionName("");
    setIsAdding(false);
  };

  return (
    <>
      <div
        className="bg-gray-200 text-gray-700 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl"
        onClick={() => setIsAdding(true)}
      >
        <FaPlus className="text-3xl text-[#6437A0]" />
        <p className="mt-2 text-sm">Create New Collection</p>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-50 w-full max-w-md">
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
                onClick={() => setIsAdding(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCollection}
                className="bg-[#6437A0] text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCollection;