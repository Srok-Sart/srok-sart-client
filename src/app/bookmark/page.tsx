"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CollectionCard from "./collection-card";
import AddCollection from "./add-collection";
import Navigation from "@/app/components/navigation"; 

interface Collection {
  id: string;
  name: string;
  saved: number;
  isDefault?: boolean;
  thumbnails: string[];
}

const PLACEHOLDER_IMAGES = [
  "/grid/img1.png",
  "/grid/img2.png",
  "/grid/img1.png",
  "/grid/img2.png",
];

export default function BookmarkPage() {
  const [collections, setCollections] = useState<Collection[]>([
    { id: "1", name: "Saved (Default)", saved: 16, isDefault: true, thumbnails: PLACEHOLDER_IMAGES },
    { id: "2", name: "Future DIY", saved: 24, thumbnails: PLACEHOLDER_IMAGES },
    { id: "3", name: "I want to do this", saved: 241, thumbnails: PLACEHOLDER_IMAGES },
  ]);

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
