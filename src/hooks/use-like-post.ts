"use client";

import { useState, useEffect } from "react";
import { Post } from "@/app/interfaces/post";

/**
 * Custom hook to fetch all posts that have been liked by the current user
 * @param userId - ID of the user whose profile is being viewed
 * @param token - Authentication token for the current user
 * @returns Object containing liked posts, loading state, and error state
 */
export const useLikedPosts = (userId: number, token?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Don't attempt to fetch if no userId or token
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    const fetchLikedPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        // Prepare headers with authorization token
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        // 1. Get the IDs of posts liked by the current user
        const likedPostsUrl = `${apiBaseUrl}/posts/liked`;
        const likedPostsResponse = await fetch(likedPostsUrl, {
          credentials: "include",
          headers
        });
        
        if (!likedPostsResponse.ok) {
          throw new Error(`Failed to fetch liked posts: ${likedPostsResponse.status}`);
        }
        
        const likedPostsData = await likedPostsResponse.json();
        console.log('Liked posts data:', likedPostsData); // Debug
        
        // Handle different possible formats of liked posts data
        let likedPostIds: number[] = [];
        if (Array.isArray(likedPostsData)) {
          // If it's a simple array of IDs
          if (likedPostsData.length > 0 && typeof likedPostsData[0] === 'number') {
            likedPostIds = likedPostsData;
          } 
          // If it's an array of objects with id property
          else if (likedPostsData.length > 0 && typeof likedPostsData[0] === 'object') {
            likedPostIds = likedPostsData.map((item: any) => item.id || item.postId);
          }
        }
        
        // If no liked posts, return empty array
        if (likedPostIds.length === 0) {
          setPosts([]);
          setIsLoading(false);
          return;
        }
        
        // 2. Get all posts to filter by the liked IDs
        const postsUrl = `${apiBaseUrl}/posts?limit=100`;
        const postsResponse = await fetch(postsUrl, {
          credentials: "include",
          headers
        });
        
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }
        
        const postsResult = await postsResponse.json();
        console.log('Posts result:', postsResult); // Debug
        
        if (!postsResult || !Array.isArray(postsResult.data)) {
          setPosts([]);
          setIsLoading(false);
          return;
        }
        
        // 3. Filter to only include posts that were liked
        // Using a reverse for loop to ensure most recent likes are first
        // (assuming the API returns liked posts in chronological order)
        const likedPosts: Post[] = [];
        for (let i = likedPostIds.length - 1; i >= 0; i--) {
          const post = postsResult.data.find((p: Post) => p.id === likedPostIds[i]);
          if (post) {
            likedPosts.push(post);
          }
        }
        
        console.log('Final liked posts:', likedPosts); // Debug
        setPosts(likedPosts);
      } catch (err) {
        console.error("Error in useLikedPosts hook:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedPosts();
  }, [userId, token]);

  return { posts, isLoading, error };
};