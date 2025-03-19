import { Post } from "@/app/interfaces/post";

/**
 * Fetch all posts created by the authenticated user.
 * @returns {Promise<Post[]>} A list of posts created by the user.
 */
export const fetchUserCreatedPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/my-posts`, {
    credentials: "include", // Include credentials for authenticated requests
  });

  if (!response.ok) {
    throw new Error("Failed to fetch created posts");
  }

  const data = await response.json();
  return Array.isArray(data.data) ? data.data : [];
};

/**
 * Fetch all posts liked by the authenticated user.
 * @returns {Promise<Post[]>} A list of posts liked by the user.
 */
export const fetchUserLikedPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/my-liked-posts`, {
    credentials: "include", // Include credentials for authenticated requests
  });

  if (!response.ok) {
    throw new Error("Failed to fetch liked posts");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

/**
 * Fetch a single post by its ID.
 * @param {number} postId - The ID of the post to fetch.
 * @returns {Promise<Post>} The post details.
 */
export const fetchPostById = async (postId: number): Promise<Post> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
};

/**
 * Like a post.
 * @param {number} postId - The ID of the post to like.
 * @param {number} userId - The ID of the user liking the post.
 * @returns {Promise<{ success: boolean, likeCount: number }>} The result of the like operation.
 */
export const likePost = async (
  postId: number,
  userId: number,
): Promise<{ success: boolean; likeCount: number }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to like post");
  }

  return response.json();
};

/**
 * Unlike a post.
 * @param {number} postId - The ID of the post to unlike.
 * @param {number} userId - The ID of the user unliking the post.
 * @returns {Promise<{ success: boolean, likeCount: number }>} The result of the unlike operation.
 */
export const unlikePost = async (
  postId: number,
  userId: number,
): Promise<{ success: boolean; likeCount: number }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to unlike post");
  }

  return response.json();
};

/**
 * Check if the authenticated user has liked a post.
 * @param {number} postId - The ID of the post to check.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<boolean>} Whether the user has liked the post.
 */
export const checkIfUserLikedPost = async (
  postId: number,
  userId: number,
): Promise<boolean> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/liked`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to check if user liked post");
  }

  const data = await response.json();
  return data.isLiked;
};