"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface Collection {
  id: string;
  name: string;
  saved: number;
  thumbnails: string[];
}

const PLACEHOLDER_IMAGES = [
  "/grid/img1.png",
  "/grid/img2.png",
  "/grid/img1.png",
  "/grid/img2.png",
];

interface AddCollectionProps {
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
}

const AddCollection: React.FC<AddCollectionProps> = ({ setCollections }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleAddCollection = () => {
    if (!newCollectionName.trim()) return;
    setCollections((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newCollectionName, saved: 0, thumbnails: PLACEHOLDER_IMAGES },
    ]);
    setNewCollectionName("");
    setIsAdding(false);
  };

  return (
    <>
      <div className="bg-gray-200 text-gray-700 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl" onClick={() => setIsAdding(true)}>
        <FaPlus className="text-3xl text-[#6437A0]" />
        <p className="mt-2 text-sm">Create New Collection</p>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-50 w-full max-w-md"> {/* ✅ Added max-width to keep it centered */}
            <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
            <input type="text" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} className="border p-2 w-full rounded" placeholder="Enter collection name" />
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setIsAdding(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddCollection} className="bg-[#6437A0] text-white px-4 py-2 rounded">Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCollection;
