"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import CollectionCard from "./collection-card";
import AddCollection from "./add-collection";
import Navigation from "@/app/components/navigation";
import { fetchCollections } from "../../api/bookmark";
import { generateRandomColor } from "@/app/utils/colors";

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

export default function BookmarkPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const response = await fetchCollections();
        console.log("API Response:", response); // Debugging
  
        // Ensure the response is an array
        if (!Array.isArray(response)) {
          throw new Error("API response is not an array");
        }
  
        // Transform the API response to match the Collection interface
        const formattedCollections = response.map((collection: any) => ({
          id: collection.id.toString(), // Ensure ID is a string
          name: collection.name,
          saved: 0, // Default value for saved
          isDefault: false, // Default value for isDefault
          thumbnails: [], // Only one default image
          description: collection.description, // Include description from API
          isPrivate: collection.isPrivate, // Include isPrivate from API
          color: generateRandomColor(), // Assign a random color
        }));
  
        setCollections(formattedCollections);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        setCollections([]); // Fallback to an empty array in case of error
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };
  
    loadCollections();
  }, []);

  if (isLoading) {
    return <div>Loading collections...</div>;
  }

  return (
    <div className="min-h-screen mt-10">
      <Navigation />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <AddCollection setCollections={setCollections} />
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} setCollections={setCollections} />
          ))}
        </div>
      </div>
    </div>
  );
}