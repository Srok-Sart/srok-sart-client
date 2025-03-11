import { fetcher } from "./use-fetcher";

/**
 * Response from like/unlike operations
 */
export interface PostLikeResponse {
  success: boolean;
  likeCount: number;
}

/**
 * Gets auth token depending on environment
 * @returns The bearer token or undefined
 */
const getAuthToken = async (): Promise<string | undefined> => {
  // Client-side: Get from document.cookie
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('Token='));
    return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : undefined;
  } else {
    // Server-side: Use dynamic import to avoid initial parsing errors
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get("accessToken")?.value;
    } catch (error) {
      console.error("Error accessing server cookies:", error);
      return undefined;
    }
  }
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

    console.log("Using token for liking:", token.substring(0, 15) + "...");
    
    // Using exactly the same pattern as get-user-profile.ts
    return await fetcher<PostLikeResponse>(`/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

    console.log("Using token for unliking:", token.substring(0, 15) + "...");

    return await fetcher<PostLikeResponse>(`/posts/${postId}/like`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
      return false; // Not authenticated, so can't be liked
    }

    console.log("Using token for checking if liked:", token.substring(0, 15) + "...");

    const data = await fetcher<{isLiked: boolean}>(`/posts/${postId}/liked`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
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

    console.log("Using token for getting liked posts:", token.substring(0, 15) + "...");

    return await fetcher<number[]>(`/posts/liked`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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