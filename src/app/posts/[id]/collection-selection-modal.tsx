"use client";

import Image from "next/image";
import React from "react";
import { FaBookmark } from "react-icons/fa";

interface Collection {
  id: string;
  name: string;
  saved?: number;
  isDefault?: boolean;
  thumbnails?: string[];
  description?: string;
  isPrivate?: boolean;
}

interface CollectionSelectModalProps {
  showCollections: boolean;
  setShowCollections: React.Dispatch<React.SetStateAction<boolean>>;
  collections: Collection[];
  handleCollectionSelect: (
    e: React.MouseEvent,
    collectionId: string
  ) => Promise<void>;
}

const CollectionSelectModal: React.FC<CollectionSelectModalProps> = ({
  showCollections,
  setShowCollections,
  collections,
  handleCollectionSelect,
}) => {
  if (!showCollections) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      onClick={() => setShowCollections(false)}
    >
      <div
        className='bg-white p-6 rounded-lg w-full max-w-md'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-bold mb-4'>Save to Collection</h2>

        {collections.length === 0 ? (
          <p className='text-gray-500 text-center py-4'>
            You don't have any collections yet. Create one to save this post.
          </p>
        ) : (
          <div className='grid grid-cols-2 gap-4 max-h-80 overflow-y-auto'>
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={(e) => handleCollectionSelect(e, collection.id)}
                className='p-4 border rounded-lg hover:bg-gray-100 transition flex flex-col items-center text-center'
              >
                <div className='w-16 h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center'>
                  {collection.thumbnails && collection.thumbnails.length > 0 ? (
                    <Image
                      src={collection.thumbnails[0]}
                      alt={collection.name}
                      width={64}
                      height={64}
                      className='w-full h-full object-cover rounded-lg'
                    />
                  ) : (
                    <FaBookmark className='text-gray-400' size={24} />
                  )}
                </div>
                <span className='font-medium'>{collection.name}</span>
                {collection.saved && (
                  <span className='text-xs text-gray-500'>
                    {collection.saved} items
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className='mt-6 flex justify-between'>
          <button
            onClick={() => setShowCollections(false)}
            className='px-4 py-2 border rounded-lg hover:bg-gray-100 transition'
          >
            Cancel
          </button>

          <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'>
            Create New Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionSelectModal;