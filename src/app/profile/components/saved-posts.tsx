"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SavedPostsTabProps {
  userId: number;
  token: string; // Token prop for authentication
}

export default function SavedPostsTab({ userId, token }: SavedPostsTabProps) {
  const router = useRouter();

  return (
    <div className="py-8">
      <div className="mb-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Saved Posts</h2>
        <p className="text-gray-500 mb-6">You haven't saved anything yet.</p>
        <button
          onClick={() => router.push("/explore")}
          className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90 shadow-sm flex items-center gap-2 mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Explore Posts
        </button>
      </div>
    </div>
  );
}