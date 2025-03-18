"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LikedPostsTabProps {
  userId: number; // Changed from string to number to match profile.id type
}

export default function LikedPostsTab({ userId }: LikedPostsTabProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // In the future, you can implement fetchLikedPosts here
  // For now, we're showing the empty state

  return (
    <div className="py-8">
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Liked Posts</h2>
        <p className="text-gray-500 mb-6">No liked posts yet.</p>
      </div>
      <button
        onClick={() => router.push("/explore")}
        className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90 shadow-sm flex items-center gap-2 mx-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        Find Posts to Like
      </button>
    </div>
  );
}