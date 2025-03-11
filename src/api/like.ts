import { PostLike } from "@/app/interfaces/post-like";
import { fetcher } from "./use-fetcher";

/**
 * Response from like/unlike operations
 */
export interface PostLikeResponse {
  success: boolean;
  likeCount: number;
}

// TEMPORARY: Hard-coded token for testing
const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTc0MTY5OTY3MSwiZXhwIjoxNzQxNzAwNTcxfQ.myhEIQpG67FyPnMNXfwUO9PxIGHZqPbTaN6_aOVSM1E";

/**
 * Gets auth token depending on environment
 * @returns The bearer token or undefined
 */
const getAuthToken = async (): Promise<string | undefined> => {
  // TEMPORARY: Return hard-coded token for testing
  return TEST_TOKEN;
  
  // Original implementation commented out for testing
  /*
  // Check if we're running on client side
  if (typeof window !== 'undefined') {
    // Client-side: Get from document.cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('accessToken='));
    return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : undefined;
  } else {
    // Server-side: Use dynamic import to avoid initial parsing errors
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      return cookieStore.get("accessToken")?.value;
    } catch (error) {
      console.error("Error accessing server cookies:", error);
      return undefined;
    }
  }
  */
};

/**
 * Likes a post
 * @param postId The ID of the post to like
 * @returns A promise resolving to the updated like count
 */
export const likePost = async (postId: number): Promise<PostLikeResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("Using token for like API:", token.substring(0, 20) + "...");

    // For testing, use direct fetch to see raw response
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    console.log("Like API Response Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

/**
 * Unlikes a post
 * @param postId The ID of the post to unlike
 * @returns A promise resolving to the updated like count
 */
export const unlikePost = async (postId: number): Promise<PostLikeResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("Using token for unlike API:", token.substring(0, 20) + "...");

    // For testing, use direct fetch to see raw response
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    console.log("Unlike API Response Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};

/**
 * Checks if the current user has liked a post
 * @param postId The ID of the post to check
 * @returns A promise resolving to a boolean indicating if the post is liked
 */
export const checkIfLiked = async (postId: number): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return false;
    }

    console.log("Using token for checkIfLiked API:", token.substring(0, 20) + "...");

    // For testing, use direct fetch to see raw response
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/liked`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    console.log("checkIfLiked API Response Status:", response.status);
    
    if (!response.ok) {
      console.log("Error in checkIfLiked - returning false");
      return false;
    }

    const data = await response.json();
    return data.isLiked;
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    return false;
  }
};

/**
 * Gets all posts that the current user has liked
 * @returns A promise resolving to an array of post IDs
 */
export const getLikedPosts = async (): Promise<number[]> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return [];
    }

    console.log("Using token for getLikedPosts API:", token.substring(0, 20) + "...");

    // For testing, use direct fetch to see raw response
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/liked`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    console.log("getLikedPosts API Response Status:", response.status);
    
    if (!response.ok) {
      console.log("Error in getLikedPosts - returning empty array");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return [];
  }
};

/**
 * Toggle like status of a post
 * @param postId The ID of the post to toggle like status
 * @param isCurrentlyLiked Whether the post is currently liked
 * @returns A promise resolving to the updated like response
 */
export const toggleLike = async (
  postId: number, 
  isCurrentlyLiked: boolean
): Promise<PostLikeResponse> => {
  console.log("Toggling like status:", { postId, isCurrentlyLiked });
  return isCurrentlyLiked 
    ? unlikePost(postId) 
    : likePost(postId);
};