"use client";

import {
  fetchACollections,
  fetchPostsInCollection,
  unsavePostFromCollection,
} from "@/api/bookmark";
import CardDisplay from "@/app/components/card-display";
import Navigation from "@/app/components/navigation";
import { Post } from "@/app/interfaces/post";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const BookmarkPage = () => {
  const params = useParams();
  const collectionId = params.id as string; // Get collectionId from route params
  const [posts, setPosts] = useState<Post[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts for the collection
  useEffect(() => {
    if (collectionId) {
      const loadPosts = async () => {
        try {
          const collection = await fetchACollections(collectionId);
          setCollectionName(collection.name);
          const posts = await fetchPostsInCollection(collectionId);
          setPosts(posts);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadPosts();
    }
  }, [collectionId]);

  // Handle unsaving a post
  const handleUnsavePost = async (postId: number) => {
    try {
      await unsavePostFromCollection(collectionId, postId); // Unsave the post
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // Remove the post from the list
    } catch (error) {
      console.error("Failed to unsave post:", error);
    }
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <>
      <Navigation />

      <div className='pt-16 max-w-7xl mx-auto px-4'>
        <h1 className='text-2xl font-semibold mb-6'>
          {collectionName} Collection
        </h1>
        <div className='columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4'>
          {posts.map((post) => (
            <CardDisplay
              key={post.id}
              post={post}
              isInCollection={true} // Indicate that the post is in a collection
              collectionId={collectionId} // Pass the collection ID
              onUnsave={handleUnsavePost} // Pass the unsave handler
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookmarkPage;
