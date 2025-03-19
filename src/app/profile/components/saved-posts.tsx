"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookmarkCollection } from "@/app/interfaces/collection";
import CollectionCard from "../../bookmark/collection-card"; // Import the CollectionCard component

interface SavedPostsTabProps {
  userId: number;
  token: string; // Token prop for authentication
}

export default function SavedPostsTab({ userId, token }: SavedPostsTabProps) {
  const router = useRouter();
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch collections created by the user
  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch collections: ${response.status}`);
        }

        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        setCollections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [userId, token]);

  return (
    <div className="py-4">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
          <p className="mt-2 text-gray-600">Loading your collections...</p>
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              setCollections={setCollections}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Your Collections</h2>
          <p className="text-gray-500 mb-6">You haven't created any collections yet.</p>
          <button
            onClick={() => router.push("/bookmark")}
            className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90 shadow-sm flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Collection
          </button>
        </div>
      )}
    </div>
  );
}