"use client";

import { fetchCollections, savePostToCollection } from "@/api/bookmark";
import { checkIfLiked, toggleLike } from "@/api/like";
import { Post } from "@/app/interfaces/post";
import Image from "next/image";
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
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState(isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

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
          const likedPosts = JSON.parse(
            localStorage.getItem("likedPosts") || "{}"
          );
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
        router.push(
          "/login?returnUrl=" + encodeURIComponent(window.location.pathname)
        );
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("Authentication") ||
        errorMessage.includes("Forbidden")
      ) {
        setIsUserAuthenticated(false);
        setNotification({
          message: "Your session has expired. Please sign in again.",
          type: "error",
        });
        setTimeout(() => {
          router.push(
            "/login?returnUrl=" + encodeURIComponent(window.location.pathname)
          );
        }, 3000);
      } else {
        setNotification({
          message: "Failed to load your collections. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleLikeClick = async () => {
    if (!token) {
      setIsUserAuthenticated(false);
      router.push(
        "/login?returnUrl=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    setError(null);

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
        router.push(
          "/login?returnUrl=" + encodeURIComponent(window.location.pathname)
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCollectionSelect = async (
    e: React.MouseEvent,
    collectionId: string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    setIsSaveLoading(true);

    try {
      await savePostToCollection(collectionId, post.id);
      setSaved(true);
      setShowCollections(false);
      setNotification({
        message: "Post saved to collection successfully!",
        type: "success",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Post already exists in the collection"
      ) {
        setNotification({
          message: "This post is already in the selected collection.",
          type: "error",
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
          type: "error",
        });
        setTimeout(() => {
          router.push(
            "/login?returnUrl=" + encodeURIComponent(window.location.pathname)
          );
        }, 3000);
      } else {
        console.error("Error saving post to collection:", error);
        setNotification({
          message: "Failed to save post to collection. Please try again.",
          type: "error",
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
          type: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        setNotification({
          message: "Failed to copy link. Please try again.",
          type: "error",
        });
      });
  };

  const handleFullscreenToggle = () => {
    setShowFullscreen(!showFullscreen);
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 p-4 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-500 text-green-700"
              : "bg-red-50 border-l-4 border-red-500 text-red-700"
          }`}
        >
          <div className='flex items-center'>
            {notification.type === "success" ? (
              <svg
                className='w-5 h-5 mr-3'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                className='w-5 h-5 mr-3'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className='ml-auto text-gray-500 hover:text-gray-700'
            >
              <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className='pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <PostHeader post={post} />
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-2/3'>
            {/* Media gallery with fullscreen toggle */}
            <div className='relative bg-gray-100 rounded-lg overflow-hidden'>
              {/* <button
                onClick={handleFullscreenToggle}
                className='absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full z-10 shadow-md hover:bg-opacity-100 transition-all duration-200'
                aria-label='Toggle fullscreen'
              >
                {showFullscreen ? (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5'
                    />
                  </svg>
                )}
              </button> */}
              <MediaGallery post={post} />
            </div>

            <div className='mt-6 block'>
              <button
                onClick={() => setShowMaterialsModal(true)}
                className='w-full bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 px-4 py-3 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-200'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
                View Materials List
              </button>
            </div>
            {error && (
              <div className='mt-6 bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500 text-red-700'>
                {error}
                {!isUserAuthenticated && (
                  <button
                    onClick={handleLoginRedirect}
                    className='ml-2 text-blue-600 hover:text-blue-800 font-medium'
                  >
                    Sign in
                  </button>
                )}
              </div>
            )}
          </div>

          <div className='w-full lg:w-1/3 space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              {/* <div className='flex justify-between items-center mb-4'>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  {post.postDifficulty}
                </span>
              </div> */}

              <div className='mb-6'>
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

            {/* Stats card */}
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Project Stats
              </h2>
              <div className='grid grid-cols-3 gap-4'>
                <div className='text-center p-3 bg-gray-50 rounded-lg'>
                  <div className='text-2xl font-bold text-gray-800'>
                    {post.viewCount}
                  </div>
                  <div className='text-sm text-gray-500'>Views</div>
                </div>
                <div className='text-center p-3 bg-gray-50 rounded-lg'>
                  <div className='text-2xl font-bold text-gray-800'>
                    {post.completionCount}
                  </div>
                  <div className='text-sm text-gray-500'>Completions</div>
                </div>
                <div className='text-center p-3 bg-gray-50 rounded-lg'>
                  <div className='text-2xl font-bold text-gray-800'>
                    {likeCount}
                  </div>
                  <div className='text-sm text-gray-500'>Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Modal */}
      <CollectionSelectModal
        showCollections={showCollections}
        setShowCollections={setShowCollections}
        collections={collections}
        handleCollectionSelect={handleCollectionSelect}
        onCreateCollection={handleCreateCollection}
        isLoading={isSaveLoading}
      />

      {/* Materials Modal */}
      {showMaterialsModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 max-w-lg w-full'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Materials Needed
              </h2>
              <button
                onClick={() => setShowMaterialsModal(false)}
                className='text-gray-500 hover:text-gray-700'
                aria-label='Close'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='mb-6'>
              <div className='space-y-3'>
                {post.postMaterials &&
                  post.postMaterials.map((item, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'
                    >
                      <div>
                        <span className='font-medium text-gray-800'>
                          {item.material.name}
                        </span>
                        <span className='text-gray-500 text-sm block'>
                          {item.material.category}
                        </span>
                      </div>
                      <div className='text-right'>
                        <span className='font-medium text-blue-600'>
                          {item.quantity}x
                        </span>
                        <span className='text-gray-500 text-sm block'>
                          {item.material.weightPerUnit} {item.material.unit}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                onClick={() => setShowMaterialsModal(false)}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className='fixed inset-0 bg-black z-50 flex items-center justify-center'>
          <button
            onClick={handleFullscreenToggle}
            className='absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-100 transition-colors duration-200'
            aria-label='Exit fullscreen'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
          <div className='w-full h-full flex items-center justify-center'>
            {post.imageUrls?.some((url) => url.endsWith(".webm")) ? (
              <video
                controls
                className='max-h-screen max-w-full'
                src={post.imageUrls.find((url) => url.endsWith(".webm"))}
              />
            ) : (
              <Image
                src={post.thumbnailUrl || post.imageUrls?.[0] || ""}
                alt={post.title}
                layout='fill'
                objectFit='contain'
                className='max-h-screen max-w-full'
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailPage;
