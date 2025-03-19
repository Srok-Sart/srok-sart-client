"use client";

import Navigation from "@/app/components/navigation";
import { generateRandomColor } from "@/app/utils/colors";
import { useEffect, useState } from "react";
import { fetchCollections } from "../../api/bookmark";
import AddCollection from "./add-collection";
import CollectionCard from "./collection-card";
import { BookmarkCollection } from "../interfaces/collection"; // Import BookmarkCollection
import { useRouter } from "next/navigation"; // Import useRouter

export default function BookmarkPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<BookmarkCollection[]>([]); // Use BookmarkCollection
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        if (error instanceof Error && error.message.includes("401")) {
          alert("Your session has expired. Please log in again.");
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
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
            <CollectionCard
              key={col.id}
              collection={col}
              setCollections={setCollections}
            />
          ))}
        </div>
      </div>
    </div>
  );
}