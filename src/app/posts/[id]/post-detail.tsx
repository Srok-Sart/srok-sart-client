/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchCollections, savePostToCollection } from "@/api/bookmark";
import { checkIfLiked, toggleLike } from "@/api/like";
import Navigation from "@/app/components/navigation";
import { Post } from "@/app/interfaces/post";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CollectionSelectModal from "./collection-selection-modal";
import MediaGallery from "./media-gallery";
import PostHeader from "./post-header";
import PostInfoCard from "./post-info-card";

interface Collection {
  id: string;
  name: string;
  saved?: number;
  isDefault?: boolean;
  thumbnails?: string[];
  description?: string;
  isPrivate?: boolean;
}

interface PostDetailPageProps {
  post: Post;
  isAuthenticated?: boolean;
  token?: string;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({
  post,
  isAuthenticated = false,
  token,
}) => {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comment, setComment] = useState("");
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const handleCreateCollection = (newCollection: Collection) => {
    setCollections((prevCollections) => [...prevCollections, newCollection]);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);

      const checkLikeStatus = async () => {
        try {
          if (token) {
            const isLiked = await checkIfLiked(post.id, token);
            setLiked(isLiked);
          }
        } catch (error) {
          console.error("Error checking like status:", error);
          const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
          setLiked(!!likedPosts[post.id]);
          setLikeCount(likedPosts[post.id]?.likeCount || post.likeCount || 0);
        }
      };

      checkLikeStatus();
    }
  }, [post.id, post.likeCount, token]);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
  
    if (!token) {
      setError("Please sign in to save this post to your collections");
      setIsUserAuthenticated(false);
      setTimeout(() => {
        router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname));
      }, 3000);
      return;
    }
  
    setError(null);
    setIsSaveLoading(true);

    try {
      
      const fetchedCollections = await fetchCollections();
      setCollections(fetchedCollections);
      setShowCollections(true);
    } catch (error) {
      console.error("Error fetching collections:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("Unauthorized") || 
          errorMessage.includes("Authentication") ||
          errorMessage.includes("Forbidden")) {
        setIsUserAuthenticated(false);
        setNotification({
          message: "Your session has expired. Please sign in again.",
          type: "error"
        });
        setTimeout(() => {
          router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname));
        }, 3000);
      } else {
        setNotification({
          message: "Failed to load your collections. Please try again.",
          type: "error"
        });
      }
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleLikeClick = async () => {
    if (!token) {
      setIsUserAuthenticated(false);
      router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname));
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
  
      if (
        error instanceof Error &&
        (error.message.includes("Authentication") ||
          error.message.includes("Unauthorized") ||
          error.message.includes("Forbidden"))
      ) {
        setIsUserAuthenticated(false);
        router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname));
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCollectionSelect = async (e: React.MouseEvent, collectionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsSaveLoading(true);

    try {
      await savePostToCollection(collectionId, post.id);
      setSaved(true);
      setShowCollections(false);
      setNotification({
        message: "Post saved to collection successfully!",
        type: "success"
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Post already exists in the collection"
      ) {
        setNotification({
          message: "This post is already in the selected collection.",
          type: "error"
        });
      } else if (
        error instanceof Error &&
        (error.message.includes("Authentication") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("Forbidden"))
      ) {
        setIsUserAuthenticated(false);
        setShowCollections(false);
        setNotification({
          message: "Your session has expired. Please sign in again.",
          type: "error"
        });
        setTimeout(() => {
          router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname));
        }, 3000);
      } else {
        console.error("Error saving post to collection:", error);
        setNotification({
          message: "Failed to save post to collection. Please try again.",
          type: "error"
        });
      }
    } finally {
      setIsSaveLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setNotification({
          message: "Link copied to clipboard!",
          type: "success"
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        setNotification({
          message: "Failed to copy link. Please try again.",
          type: "error"
        });
      });
  };

  return (
    <>
      <Navigation />
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 p-4 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out animate-fadeIn ${
          notification.type === "success" 
            ? "bg-green-50 border-l-4 border-green-500 text-green-700" 
            : "bg-red-50 border-l-4 border-red-500 text-red-700"
        }`}>
          <div className="flex items-center">
            {notification.type === "success" ? (
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className='pt-16 pb-16 max-w-5xl mx-auto px-4'>
        <PostHeader post={post} />

        <div className='flex flex-col md:flex-row gap-8'>
          <MediaGallery post={post} />

          {error && (
            <div className='bg-white p-3 rounded-lg shadow-sm text-red-500 text-sm'>
              {error}
              {!isUserAuthenticated && (
                <button
                  onClick={handleLoginRedirect}
                  className='ml-2 text-blue-500 underline'
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
            copyToClipboard={copyToClipboard}
            showShareMenu={showShareMenu}
            shareUrl={shareUrl}
            token={token}
            isUserAuthenticated={isUserAuthenticated}
            isSaveLoading={isSaveLoading}
          />
        </div>
      </div>

      <CollectionSelectModal
        showCollections={showCollections}
        setShowCollections={setShowCollections}
        collections={collections}
        handleCollectionSelect={handleCollectionSelect}
        onCreateCollection={handleCreateCollection}
        isLoading={isSaveLoading}
      />
    </>
  );
};

export default PostDetailPage;