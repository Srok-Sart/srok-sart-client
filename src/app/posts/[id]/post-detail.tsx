"use client";

import { fetchCollections, savePostToCollection } from "@/api/bookmark";
import { checkIfLiked, toggleLike } from "@/api/like";
import Navigation from "@/app/components/navigation";
import { Post } from "@/app/interfaces/post";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
} from "next-share";
import Image from "next/image";
import { useRouter } from 'next/navigation'; 
import React, { useEffect, useState } from "react";
import {
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaComment,
  FaExpand,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";

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
  isAuthenticated?: boolean; // Added from page.tsx
  token?: string; // Added from page.tsx
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ post, isAuthenticated = false, token }) => {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comment, setComment] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
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

  const handleCollectionSelect = async (
    e: React.MouseEvent,
    collectionId: string
  ) => {
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Please sign in to comment");
      setIsUserAuthenticated(false);
      return;
    }
    
    if (comment.trim()) {
      // Here you would typically send the comment to your API
      console.log("Submitting comment:", comment);
      setComment("");
      // You could add the comment to a local state array to display it immediately
    }
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === post.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? post.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Check if current media is a video
  const isCurrentMediaVideo = (url: string) => {
    return (
      url.endsWith(".webm") || url.endsWith(".mp4") || url.endsWith(".mov")
    );
  };

  // Get the base API URL
  const getApiBaseUrl = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <>
      <Navigation />
      <div className='pt-16 pb-16 max-w-5xl mx-auto px-4'>
        {/* Post Type Badge */}
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.postType === "IMAGE"
                  ? "bg-blue-100 text-blue-800"
                  : post.postType === "VIDEO"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {post.postType}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.postDifficulty === "EASY"
                  ? "bg-green-100 text-green-800"
                  : post.postDifficulty === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-800"
                  : post.postDifficulty === "HARD"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {post.postDifficulty}
            </span>
          </div>

          <div className='text-sm text-gray-500 flex items-center gap-2'>
            <FaClock className='inline' />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-8'>
          {/* Left: Image/Video Section */}
          {/* Left: Media Gallery Section */}
          <div
            className={`${
              isFullscreen
                ? "fixed inset-0 z-50 bg-black flex items-center justify-center"
                : "flex-1"
            }`}
          >
            <div
              className={`relative ${
                isFullscreen
                  ? "w-full h-full"
                  : "bg-white rounded-xl overflow-hidden shadow-lg"
              }`}
            >
              {/* Main Media Display */}
              <div className='relative w-full h-full'>
                {isCurrentMediaVideo(post.imageUrls[currentMediaIndex]) ? (
                  <video
                    src={getApiBaseUrl() + post.imageUrls[currentMediaIndex]}
                    controls
                    autoPlay={isFullscreen}
                    className={`${
                      isFullscreen
                        ? "max-h-screen w-auto max-w-full mx-auto"
                        : "w-full h-auto max-h-[600px] object-contain"
                    }`}
                  />
                ) : (
                  <div
                    className={`relative ${
                      isFullscreen
                        ? "h-screen flex items-center justify-center"
                        : "h-[500px]"
                    }`}
                  >
                    <Image
                      src={getApiBaseUrl() + post.imageUrls[currentMediaIndex]}
                      alt={`${post.title || "Post media"} ${
                        currentMediaIndex + 1
                      }`}
                      fill={!isFullscreen}
                      width={isFullscreen ? 1200 : undefined}
                      height={isFullscreen ? 800 : undefined}
                      className={`${
                        isFullscreen
                          ? "max-h-screen max-w-full h-auto w-auto object-contain"
                          : "object-contain"
                      }`}
                      priority
                    />
                  </div>
                )}

                {/* Navigation Controls */}
                {post.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevMedia}
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition focus:outline-none'
                      aria-label='Previous image'
                    >
                      <FaChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextMedia}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition focus:outline-none'
                      aria-label='Next image'
                    >
                      <FaChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className='absolute top-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition focus:outline-none'
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  <FaExpand size={18} />
                </button>

                {/* Media Counter */}
                {post.imageUrls.length > 1 && (
                  <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'>
                    {currentMediaIndex + 1} / {post.imageUrls.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {!isFullscreen && post.imageUrls.length > 1 && (
                <div className='flex overflow-x-auto gap-2 p-3 bg-gray-100'>
                  {post.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        currentMediaIndex === index
                          ? "border-blue-500 ring-2 ring-blue-300"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      {isCurrentMediaVideo(url) ? (
                        <div className='w-full h-full bg-gray-800 flex items-center justify-center text-white'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='white'
                          >
                            <path d='M8 5v14l11-7z' />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={getApiBaseUrl() + url}
                          alt={`Thumbnail ${index + 1}`}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Close Button */}
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className='absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full z-50'
                aria-label='Close fullscreen'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='white'
                >
                  <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
                </svg>
              </button>
            )}
          </div>

          {/* Right: Post Details */}
          <div className='flex-1 space-y-6'>
            {/* Creator Info */}
            <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm'>
              <Image
                src='/grid/img1.png'
                alt='Creator'
                width={40}
                height={40}
                className='w-10 h-10 rounded-full object-cover border-2 border-gray-200'
              />
              <div>
                <p className='text-lg font-semibold'>Mr. Cat</p>
                <p className='text-sm text-gray-500'>Content Creator</p>
              </div>
            </div>

            {/* Post Title and Description */}
            <div className='bg-white p-4 rounded-lg shadow-sm'>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                {post.title}
              </h1>
              {post.description && (
                <p className='text-gray-700'>{post.description}</p>
              )}
              {!post.description && (
                <p className='text-gray-500 italic'>No description provided</p>
              )}
            </div>

            {/* Engagement Stats */}
            <div className='bg-white p-4 rounded-lg shadow-sm'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-500'>
                  <span className='font-medium'>{post.viewCount}</span> views
                </div>
                <div className='text-sm text-gray-500'>
                  <span className='font-medium'>{likeCount}</span> likes
                </div>
              </div>
            </div>

            {/* Error message display */}
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

            {/* Action Buttons */}
            <div className='bg-white p-4 rounded-lg shadow-sm'>
              <div className='flex items-center justify-between'>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    liked
                      ? "text-red-500 bg-red-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={handleLikeClick}
                  disabled={isLikeLoading}
                >
                  <FaHeart size={18} />
                  <span>{isLikeLoading ? "..." : "Like"}</span>
                </button>

                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    saved
                      ? "text-yellow-500 bg-yellow-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={handleSaveClick}
                >
                  <FaBookmark size={18} />
                  <span>Save</span>
                </button>

                <div className='relative'>
                  <button
                    className='flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition'
                    onClick={handleShareClick}
                  >
                    <FaShareAlt size={18} />
                    <span>Share</span>
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className='absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 flex gap-2 z-50'>
                      <FacebookShareButton
                        url={shareUrl}
                        quote={post.title}
                        hashtag='#SrokSart'
                        className='hover:opacity-80 transition'
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>

                      <TelegramShareButton
                        url={shareUrl}
                        title={post.title}
                        className='hover:opacity-80 transition'
                      >
                        <TelegramIcon size={32} round />
                      </TelegramShareButton>

                      <button
                        onClick={copyToClipboard}
                        className='bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full w-8 h-8 flex items-center justify-center hover:opacity-80 transition'
                        title='Copy link to clipboard'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          fill='white'
                          viewBox='0 0 16 16'
                        >
                          <path d='M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z' />
                          <path d='M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z' />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className='bg-white p-4 rounded-lg shadow-sm'>
              <div className='flex items-center gap-2 mb-4'>
                <FaComment size={18} className='text-gray-600' />
                <h3 className='text-lg font-semibold'>Comments</h3>
              </div>

              <form onSubmit={handleCommentSubmit} className='mb-4'>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='Add a comment...'
                    className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50'
                    disabled={!comment.trim() || !token}
                  >
                    Post
                  </button>
                </div>
              </form>

              <div className='text-gray-500 text-center py-4'>
                No comments yet. Be the first to comment!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Selection Modal */}
      {showCollections && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={() => setShowCollections(false)}
        >
          <div
            className='bg-white p-6 rounded-lg w-full max-w-md'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-xl font-bold mb-4'>Save to Collection</h2>

            {collections.length === 0 ? (
              <p className='text-gray-500 text-center py-4'>
                You dont have any collections yet. Create one to save this post.
              </p>
            ) : (
              <div className='grid grid-cols-2 gap-4 max-h-80 overflow-y-auto'>
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={(e) => handleCollectionSelect(e, collection.id)}
                    className='p-4 border rounded-lg hover:bg-gray-100 transition flex flex-col items-center text-center'
                  >
                    <div className='w-16 h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center'>
                      {collection.thumbnails &&
                      collection.thumbnails.length > 0 ? (
                        <Image
                          src={collection.thumbnails[0]}
                          alt={collection.name}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover rounded-lg'
                        />
                      ) : (
                        <FaBookmark className='text-gray-400' size={24} />
                      )}
                    </div>
                    <span className='font-medium'>{collection.name}</span>
                    {collection.saved && (
                      <span className='text-xs text-gray-500'>
                        {collection.saved} items
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className='mt-6 flex justify-between'>
              <button
                onClick={() => setShowCollections(false)}
                className='px-4 py-2 border rounded-lg hover:bg-gray-100 transition'
              >
                Cancel
              </button>

              <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'>
                Create New Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailPage;