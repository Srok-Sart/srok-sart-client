"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCollections } from "../../api/bookmark";
import { BookmarkCollection } from "../interfaces/collection";
import AddCollection from "./add-collection";
import CollectionCard from "./collection-card";

export default function BookmarkContent() {
  const router = useRouter();
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
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
  }, [router]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen pt-16'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='p-6 pt-16 max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
          <AddCollection setCollections={setCollections} />
          {collections.length === 0 ? (
            <div className='col-span-full text-center py-10'>
              <p className='text-gray-500'>
                No collections found. Create your first collection!
              </p>
            </div>
          ) : (
            collections.map((col) => (
              <CollectionCard
                key={col.id}
                collection={col}
                setCollections={setCollections}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
