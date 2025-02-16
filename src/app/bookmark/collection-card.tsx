"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEllipsisV, FaEdit, FaTrash, FaTag } from "react-icons/fa";

interface Collection {
  id: string;
  name: string;
  saved: number;
  isDefault?: boolean;
  thumbnails: string[];
}

interface CollectionCardProps {
  collection: Collection;
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, setCollections }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavigateToSaveList = () => {
    router.push(`/savelist?collectionId=${collection.id}`);
  };

  const handleDeleteCollection = () => {
    setCollections((prev) => prev.filter((col) => col.id !== collection.id));
  };

  const handleEditCollection = () => {
    setCollections((prev) =>
      prev.map((col) => (col.id === collection.id ? { ...col, name: editName } : col))
    );
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl relative">
      <div className="grid grid-cols-2 gap-2" onClick={handleNavigateToSaveList}>
        {collection.thumbnails.slice(0, 4).map((img, index) => (
          <div key={index} className="relative w-full h-24 overflow-hidden rounded-md">
            <Image src={img} alt={collection.name} layout="fill" objectFit="cover" className="hover:scale-105 transition-transform duration-200" />
          </div>
        ))}
      </div>

      {isEditing ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleEditCollection}
          className="border p-2 w-full mt-2 rounded text-[#6437A0]"
          autoFocus
        />
      ) : (
        <h3 className="font-semibold text-lg mt-2 flex items-center">
          {collection.isDefault && <FaTag className="text-[#6437A0] mr-2" />} {collection.name}
        </h3>
      )}

      <p className="text-sm text-black">{collection.saved} Saved</p>

      {!collection.isDefault && (
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="absolute bottom-2 right-2 p-2">
            <FaEllipsisV className="text-gray-500 hover:text-gray-800" />
          </button>
          {menuOpen && (
            <div className="absolute bottom-8 right-2 bg-white shadow-lg p-2 rounded-lg z-10">
              <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 text-[#6437A0] p-2 w-full">
                <FaEdit /> <span>Edit</span>
              </button>
              <button onClick={handleDeleteCollection} className="flex items-center space-x-2 text-red-500 p-2 w-full">
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
