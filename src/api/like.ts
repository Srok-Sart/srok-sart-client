import { fetcher } from "./use-fetcher";

export interface PostLikeResponse {
  success: boolean;
  likeCount: number;
}

/**
 * Handles API requests for liking/unliking posts
 */
const postLikeRequest = async (
  postId: number,
  method: "POST" | "DELETE",
  token: string
): Promise<PostLikeResponse> => {
  if (!token) {
    console.error("Authentication token missing.");
    throw new Error("Authentication required");
  }

  return fetcher<PostLikeResponse>(`/posts/${postId}/like`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
};

/**
 * Likes a post
 */
export const likePost = (postId: number, token: string) => 
  postLikeRequest(postId, "POST", token);

/**
 * Unlikes a post
 */
export const unlikePost = (postId: number, token: string) => 
  postLikeRequest(postId, "DELETE", token);

/**
 * Checks if the current user has liked a post
 */
export const checkIfLiked = async (postId: number, token: string): Promise<boolean> => {
  if (!token) return false;

  try {
    const data = await fetcher<{ isLiked: boolean }>(`/posts/${postId}/liked`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include"
    });

    return data.isLiked;
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    return false;
  }
};

/**
 * Gets all posts liked by the current user
 */
export const getLikedPosts = async (token: string): Promise<number[]> => {
  if (!token) return [];

  try {
    return await fetcher<number[]>(`/posts/liked`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include"
    });
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return [];
  }
};

/**
 * Toggles the like status of a post
 */
export const toggleLike = async (
  postId: number, 
  isCurrentlyLiked: boolean,
  token: string
): Promise<PostLikeResponse> => {
  return isCurrentlyLiked ? unlikePost(postId, token) : likePost(postId, token);
};