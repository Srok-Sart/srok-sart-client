"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import CardDisplay from "../components/card-display";
import { FaArrowLeft } from "react-icons/fa";

interface DIYItem {
  src: string;
  title: string;
  creator: string;
}

const PLACEHOLDER_DIY: DIYItem[] = [
  { src: "/grid/img1.png", title: "DIY Project 1", creator: "John Doe" },
  { src: "/grid/img2.png", title: "DIY Project 2", creator: "Jane Smith" },
  { src: "/grid/img1.png", title: "DIY Project 3", creator: "Mike Johnson" },
];

const COLLECTIONS = [
  { id: "1", name: "Saved (Default)" },
  { id: "2", name: "Future DIY" },
  { id: "3", name: "I want to do this" },
];

export default function SaveListPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const collectionId = searchParams.get("collectionId"); // this is the title of the bookmark name(please change)
  const [diyList, setDiyList] = useState<DIYItem[]>(PLACEHOLDER_DIY);
  const [collectionName, setCollectionName] = useState<string | null>(null);

  useEffect(() => {
    if (collectionId) {
      const collection = COLLECTIONS.find((col) => col.id === collectionId);
      setCollectionName(collection ? collection.name : "Unknown Collection");
    }
  }, [collectionId]);

  return (
    <div className="p-6 max-w-7xl mx-auto mt-8">
      <button 
        onClick={() => router.push("/bookmark")} 
        className="flex items-center text-gray-750 font-semibold mb-4"
      >
        <FaArrowLeft size={15} className="mr-6" /> 
        <h2 className="text-xl text-gray-700">{collectionName ? `Back to ${collectionName}` : "Back to collection"}</h2>
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-11">
        {diyList.map((diy, index) => (
          <CardDisplay key={index} src={diy.src} title={diy.title} creator={diy.creator} />
        ))}
      </div>
    </div>
  );
}
