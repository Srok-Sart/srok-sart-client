import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEllipsisV, FaEdit, FaTrash, FaTag, FaTimes } from "react-icons/fa";
import { updateCollection, deleteCollection, fetchPostsInCollection, unsavePostFromCollection } from "../../api/bookmark";
import useClickOutside from "../../hooks/use-click-outside";
import { Post } from "../interfaces/post";

interface Collection {
  id: string;
  name: string;
  saved?: number;
  isDefault?: boolean;
  thumbnails?: string[];
  description?: string;
  isPrivate?: boolean;
  color: string;
}

interface CollectionCardProps {
  collection: Collection;
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  setCollections,
}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [posts, setPosts] = useState<Post[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

  const handleNavigateToCollection = () => {
    router.push(`/bookmark/${collection.id}`); 
  };

  const handleDeleteCollection = async () => {
    try {
      // Fetch the collection to check if it has posts
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${collection.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch collection");
      }
  
      const collectionData = await response.json();
      console.log("Collection data:", collectionData); // Debugging
  
      // Check if the collection has posts
      if (collectionData.posts && collectionData.posts.length > 0) {
        alert("Cannot delete collection because it contains posts.");
        return; // Exit the function without deleting
      }
  
      // Confirm deletion if the collection is empty
      if (window.confirm("Are you sure you want to delete this collection?")) {
        await deleteCollection(collection.id);
        setCollections((prev) => prev.filter((col) => col.id !== collection.id));
      }
    } catch (error) {
      console.error("Failed to delete collection:", error);
      if (error instanceof Error) {
        alert(error.message); // Display the error message to the user
      } else {
        alert("Failed to delete collection. Please try again.");
      }
    }
    setMenuOpen(false);
  };

  const handleEditCollection = async () => {
    try {
      const updatedCollection = await updateCollection(collection.id, {
        name: editName,
        isPrivate: true,
      });

      setCollections((prev) =>
        prev.map((col) =>
          col.id === collection.id
            ? { ...col, name: updatedCollection.name }
            : col
        )
      );
    } catch (error) {
      console.error("Failed to update collection:", error);
      alert("Failed to update collection. Please try again.");
    }
    setIsEditing(false);
    setMenuOpen(false);
  };

  const handleUnsavePost = async (postId: number) => {
    try {
      await unsavePostFromCollection(collection.id, postId);
      setPosts((prev) => prev.filter((post) => post.id !== Number(postId)));
    } catch (error) {
      console.error("Error unsaving post:", error);
      alert("Failed to unsave post. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl relative">
      <div
        className="relative w-full h-48 overflow-hidden rounded-md cursor-pointer"
        onClick={handleNavigateToCollection}
        style={{ backgroundColor: collection.color }}
      >
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
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button onClick={handleEditCollection} className="bg-[#6437A0] text-white px-4 py-2 rounded">OK</button>
          </div>
        </div>
      ) : (
        <h3 className="font-semibold text-lg mt-2 flex items-center">
          {collection.isDefault && <FaTag className="text-[#6437A0] mr-2" />}{" "}
          {collection.name}
        </h3>
      )}

      <p className="text-sm text-black">{collection.saved} Saved</p>
      <p className="text-sm text-gray-500">{collection.description}</p>
      <p className="text-sm text-gray-500">
        {collection.isPrivate ? "Private" : "Public"}
      </p>

      {posts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Saved Posts</h4>
          <div className="grid grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                <Image
                  src={process.env.NEXT_PUBLIC_API_URL + post.thumbnailUrl}
                  alt={post.title}
                  width={150}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleUnsavePost(post.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full"
                >
                  <FaTimes className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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