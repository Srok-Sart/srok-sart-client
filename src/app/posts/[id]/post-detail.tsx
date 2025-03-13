"use client";

import { fetchCollections, savePostToCollection } from "@/api/bookmark";
import Navigation from "@/app/components/navigation";
import { Post } from "@/app/interfaces/post";
import React, { useEffect, useState } from "react";
import CollectionSelectionModal from "./collection-selection-modal";
import PostInfoCard from "./post-info-card";
import MediaGallery from "./media-gallery";
import PostHeader from "./post-header";
import { useRouter } from 'next/navigation'; 
import { checkIfLiked, toggleLike } from "@/api/like";

interface PostDetailPageProps {
  post: Post;
  isAuthenticated?: boolean;
  token?: string;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ 
  post, 
  isAuthenticated = false,
  token 
}) => {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comment, setComment] = useState("");
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
      
      // Check like status from API using the passed token
      const checkLikeStatus = async () => {
        try {
          if (token) {
            const isLiked = await checkIfLiked(post.id, token);
            setLiked(isLiked);
          }
        } catch (error) {
          console.error("Error checking like status:", error);
          
          // Fallback to localStorage if API call fails
          const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
          setLiked(!!likedPosts[post.id]);
          setLikeCount(likedPosts[post.id]?.likeCount || post.likeCount || 0);
        }
      };
      
      checkLikeStatus();
    }
  }, [post.id, post.likeCount, token]);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError("Please sign in to save this post");
      setIsUserAuthenticated(false);
      return;
    }
    
    setError(null);
    const collections = await fetchCollections();
    setCollections(collections);
    setShowCollections(true);
  };

  const handleLikeClick = async () => {
    if (!token) {
      setError("Please sign in to like this post");
      setIsUserAuthenticated(false);
      return;
    }

    setError(null);
    setIsLikeLoading(true);

    try {
      const response = await toggleLike(post.id, liked, token);
      
      setLiked(!liked);
      setLikeCount(response.likeCount);
      
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
      if (!liked) {
        likedPosts[post.id] = { isLiked: true, likeCount: response.likeCount };
      } else {
        delete likedPosts[post.id];
      }
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      
    } catch (error) {
      console.error("Error handling like:", error);
      
      if (error instanceof Error && 
         (error.message.includes("Authentication") || 
          error.message.includes("Unauthorized") || 
          error.message.includes("Forbidden"))) {
        setError("Please sign in to like this post");
        setIsUserAuthenticated(false);
      } else {
        setError("Failed to like post. Please try again.");
      }
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCollectionSelect = async (e, collectionId) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await savePostToCollection(collectionId, post.id);
      setSaved(true);
      setShowCollections(false);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Post already exists in the collection"
      ) {
        alert("This post is already in the collection.");
      } else {
        console.error("Error saving post to collection:", error);
        alert("Failed to save post. Please try again.");
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Link copied! You can now paste it anywhere.");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <Navigation />
      <div className='pt-16 pb-16 max-w-5xl mx-auto px-4'>
        <PostHeader post={post} />

        <div className='flex flex-col md:flex-row gap-8'>
          <MediaGallery post={post} />

          {error && (
            <div className="bg-white p-3 rounded-lg shadow-sm text-red-500 text-sm">
              {error} 
              {!isUserAuthenticated && (
                <button 
                  onClick={handleLoginRedirect}
                  className="ml-2 text-blue-500 underline"
                >
                  Sign in
                </button>
              )}
            </div>
          )}

          <PostInfoCard
            post={post}
            saved={saved}
            liked={liked}
            likeCount={likeCount}
            comment={comment}
            setComment={setComment}
            handleLikeClick={handleLikeClick}
            handleSaveClick={handleSaveClick}
            handleShareClick={handleShareClick}
            handleCommentSubmit={() => {}}  // This will be handled inside PostInfoCard now
            copyToClipboard={copyToClipboard}
            showShareMenu={showShareMenu}
            shareUrl={shareUrl}
            token={token}
            isUserAuthenticated={isUserAuthenticated}
          />
        </div>
      </div>

      <CollectionSelectionModal
        showCollections={showCollections}
        setShowCollections={setShowCollections}
        collections={collections}
        handleCollectionSelect={handleCollectionSelect}
      />
    </>
  );
};

export default PostDetailPage;