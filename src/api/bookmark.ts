import { Post } from "@/app/interfaces/post";
import { BookmarkCollection } from "@/app/interfaces/collection"; // Import the BookmarkCollection interface
import { fetcher } from "./use-fetcher"; // Adjust the import path

export const createCollection = async (collection: { name: string; isPrivate: boolean }): Promise<BookmarkCollection> => {
  try {
    return await fetcher<BookmarkCollection>("/bookmarks/collections", {
      method: "POST",
      body: JSON.stringify(collection),
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const fetchCollections = async (): Promise<BookmarkCollection[]> => {
  try {
    const data = await fetcher<BookmarkCollection[]>("/bookmarks/collections");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

export const fetchACollections = async (id: string): Promise<BookmarkCollection> => {
  try {
    return await fetcher<BookmarkCollection>(`/bookmarks/collections/${id}`);
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw error;
  }
};

export const updateCollection = async (id: string, collection: { name: string; isPrivate: boolean }): Promise<BookmarkCollection> => {
  try {
    return await fetcher<BookmarkCollection>(`/bookmarks/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(collection),
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

export const deleteCollection = async (id: string): Promise<{}> => {
  try {
    const response = await fetcher<{ status: number }>(`/bookmarks/collections/${id}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      return {}; // Handle empty response
    }

    return response;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

export const fetchPostsInCollection = async (collectionId: string): Promise<Post[]> => {
  try {
    const data = await fetcher<Post[]>(`/bookmarks/collections/${collectionId}/posts`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching posts in collection:", error);
    throw error;
  }
};

export const unsavePostFromCollection = async (collectionId: string, postId: number): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/post-bookmarks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collectionId,
        postId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to unsave post from collection: ${errorText}`);
    }

    // Handle empty response (e.g., 204 No Content)
    if (response.status === 204) {
      return; // No content to parse
    }

    // Parse JSON only if the response is not empty
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error unsaving post from collection:", error);
    throw error;
  }
};

export const savePostToCollection = async (collectionId: string, postId: number): Promise<Post> => {
  try {
    const postsInCollection = await fetcher<Post[]>(
      `/bookmarks/collections/${collectionId}/posts`
    );

    if (postsInCollection.some((post) => post.id === postId)) {
      throw new Error("Post already exists in the collection");
    }

    return await fetcher<Post>("/bookmarks/post-bookmarks", {
      method: "POST",
      body: JSON.stringify({ collectionId, postId }),
    });
  } catch (error) {
    console.error("Error saving post to collection:", error);
    throw error;
  }
};

export const movePostToCollection = async (postId: string, fromCollectionId: string, toCollectionId: string): Promise<Post> => {
  try {
    return await fetcher<Post>(
      `/collections/${fromCollectionId}/posts/${postId}`,
      {
        method: "PUT",
        body: JSON.stringify({ toCollectionId }),
      }
    );
  } catch (error) {
    console.error("Error moving post to collection:", error);
    throw error;
  }
};

export const deletePostFromCollection = async (collectionId: string, postId: string): Promise<{}> => {
  try {
    return await fetcher<{}>(
      `/collections/${collectionId}/posts/${postId}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error deleting post from collection:", error);
    throw error;
  }
};