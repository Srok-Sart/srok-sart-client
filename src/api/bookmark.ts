import { Post } from "@/app/interfaces/post";

export const createCollection = async (collection: { name: string; isPrivate: boolean }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collection),
  });
  return response.json();
};

export const fetchCollections = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections`);
  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const fetchACollections = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }
  const data = await response.json();
  return data;
};

export const updateCollection = async (id: string, collection: { name: string; isPrivate: boolean }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collection),
  });
  return response.json();
};

// export const deleteCollection = async (id: string) => {
//   try {
//     // Fetch the collection to check if it has posts
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${id}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch collection");
//     }

//     const collection = await response.json();
//     console.log("Collection:", collection); // Debugging

//     // Check if the collection has posts
//     if (collection.posts && collection.posts.length > 0) {
//       throw new Error("Cannot delete collection because it contains posts");
//     }

//     // Delete the collection
//     const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${id}`, {
//       method: "DELETE",
//     });

//     if (!deleteResponse.ok) {
//       const errorText = await deleteResponse.text(); // Log the error response
//       console.error("Delete response error:", errorText); // Debugging
//       throw new Error(`Failed to delete collection: ${errorText}`);
//     }

//     return deleteResponse.json();
//   } catch (error) {
//     console.error("Error in deleteCollection:", error);
//     throw error;
//   }
// };

export const deleteCollection = async (id: string) => {
  try {
    console.log("Fetching collection to check for posts..."); // Debugging
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${id}`);
    if (!response.ok) {
      const errorText = await response.text(); // Log the error response
      console.error("Fetch collection error:", errorText); // Debugging
      throw new Error(`Failed to fetch collection: ${errorText}`);
    }

    const collection = await response.json();
    console.log("Collection fetched:", collection); // Debugging

    // Check if the collection has posts
    if (collection.posts && collection.posts.length > 0) {
      throw new Error("Cannot delete collection because it contains posts");
    }

    console.log("Deleting collection..."); // Debugging
    const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${id}`, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text(); // Log the error response
      console.error("Delete collection error:", errorText); // Debugging
      throw new Error(`Failed to delete collection: ${errorText}`);
    }

    // Ensure the response is JSON
    const deleteResponseText = await deleteResponse.text();
    const deleteResponseData = deleteResponseText ? JSON.parse(deleteResponseText) : {};
    console.log("Delete response:", deleteResponseData); // Debugging

    return deleteResponseData;
  } catch (error) {
    console.error("Error in deleteCollection:", error);
    throw error;
  }
};

export const fetchPostsInCollection = async (collectionId: string): Promise<Post[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${collectionId}/posts`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts in collection");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};


export const unsavePostFromCollection = async (collectionId: string, postId: number): Promise<void> => {
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
    throw new Error("Failed to unsave post from collection");
  }
};

export const savePostToCollection = async (collectionId: string, postId: number) => {
  // Fetch the current posts in the collection
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/collections/${collectionId}/posts`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts in collection");
  }

  const postsInCollection = await response.json();
  console.log("Posts in collection:", postsInCollection); // Debugging

  // Check if the post already exists in the collection
  if (postsInCollection.some((post: Post) => post.id === postId)) {
    throw new Error("Post already exists in the collection");
  }

  // Save the post to the collection
  const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/post-bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collectionId,
      postId,
    }),
  });

  if (!saveResponse.ok) {
    throw new Error("Failed to save post to collection");
  }

  return saveResponse.json();
};

export const movePostToCollection = async (postId: string, fromCollectionId: string, toCollectionId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${fromCollectionId}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toCollectionId }),
  });
  return response.json();
};

export const deletePostFromCollection = async (collectionId: string, postId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}/posts/${postId}`, {
    method: "DELETE",
  });
  return response.json();
};
