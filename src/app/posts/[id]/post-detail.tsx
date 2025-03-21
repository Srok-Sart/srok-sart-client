"use client";

import { fetchCollections, savePostToCollection } from "@/api/bookmark";
import {
  Comment,
  createComment,
  getAllComments,
  updateComment,
} from "@/api/comments";
import { checkIfLiked, toggleLike } from "@/api/like";
import ProfileImage from "@/app/components/profile-image";
import { Post } from "@/app/interfaces/post";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaComment } from "react-icons/fa";
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
  
  // Comments related states
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      if (!post.id) return;

      setCommentsLoading(true);
      try {
        // Only attempt to fetch comments if the user has a token
        if (!token) {
          // Instead of throwing an error, just set a specific state
          setCommentError("authentication_required");
          setCommentsLoading(false);
          return;
        }

        // Filter comments by post ID on the client side
        const allComments = await getAllComments(token);
        const postComments = allComments.filter(
          (comment) => comment.postId === post.id
        );
        setComments(postComments);
        setCommentError(null);
      } catch (error) {
        // Check if the error is related to authentication
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        if (
          errorMessage.includes("Unauthorized") ||
          errorMessage.includes("Authentication required") ||
          errorMessage.includes("Forbidden")
        ) {
          setCommentError("authentication_required");
        } else {
          setCommentError("Failed to load comments");
        }
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [post.id, token]);

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

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setCommentError("Please sign in to comment");
      return;
    }

    if (!comment.trim()) return;

    setIsSubmittingComment(true);

    try {
      const newComment = await createComment(
        {
          content: comment,
          postId: post.id,
        },
        token
      );

      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
      setCommentError(null);
    } catch (error) {
      console.error("Error posting comment:", error);
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editCommentContent.trim() || !token) return;

    try {
      const updatedComment = await updateComment(
        commentId,
        { content: editCommentContent },
        token
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: updatedComment.content,
                updatedAt: updatedComment.updatedAt,
              }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      setCommentError("Failed to update comment");
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12)
      return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
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
          {/* Left column (2/3 width on desktop) */}
          <div className='w-full lg:w-2/3'>
            {/* Media gallery with fullscreen toggle */}
            <div className='relative bg-gray-100 rounded-lg overflow-hidden'>
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

            {/* Comments Section - Only visible on desktop */}
            <div className='mt-6 bg-white p-6 rounded-lg shadow-sm hidden lg:block'>
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
                    disabled={!comment.trim() || !token || isSubmittingComment}
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>

              {commentError && commentError !== "authentication_required" && (
                <div className='mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm'>
                  {commentError}
                </div>
              )}

              {/* Comments List */}
              {commentsLoading ? (
                <div className='py-4 text-center'>
                  <div className='inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
                  <p className='mt-2 text-sm text-gray-500'>Loading comments...</p>
                </div>
              ) : commentError === "authentication_required" ? (
                <div className='py-8 text-center bg-blue-50 rounded-lg'>
                  <div className='mx-auto w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-3'>
                    <FaComment size={20} className='text-blue-500' />
                  </div>
                  <h4 className='text-lg font-medium text-gray-900 mb-2'>
                    Sign in to view comments
                  </h4>
                  <p className='text-gray-600 mb-4 max-w-md mx-auto'>
                    Please log in to view and participate in the discussion.
                  </p>
                  <a
                    href='/login'
                    className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
                  >
                    Sign in
                  </a>
                </div>
              ) : comments.length > 0 ? (
                <div className='space-y-4'>
                  {comments.map((comment) => (
                    <div key={comment.id} className='border rounded-lg p-3'>
                      {editingCommentId === comment.id ? (
                        <div className='space-y-2'>
                          <textarea
                            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                          />
                          <div className='flex justify-end gap-2'>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700'
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(comment.id)}
                              className='px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className='flex justify-between items-start'>
                            <div className='flex items-center gap-2'>
                              <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                                <ProfileImage
                                  src={comment.user?.profileImageUrl}
                                  alt={comment.user?.username || "User"}
                                  size={32}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                              <div>
                                <p className='font-medium text-sm'>
                                  {comment.user?.username || "Anonymous User"}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {formatRelativeTime(comment.createdAt)}
                                  {comment.updatedAt !== comment.createdAt &&
                                    " (edited)"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className='mt-2 text-gray-700'>{comment.content}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-gray-500 text-center py-4'>
                  No comments yet. Be the first to comment!
                </div>
              )}
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

          {/* Right column (1/3 width on desktop) */}
          <div className='w-full lg:w-1/3 space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='mb-6'>
                <PostInfoCard
                  post={post}
                  saved={saved}
                  liked={liked}
                  likeCount={likeCount}
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
            
            {/* Comments Section - Only visible on mobile */}
            <div className='mt-6 bg-white p-6 rounded-lg shadow-sm lg:hidden'>
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
                    disabled={!comment.trim() || !token || isSubmittingComment}
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>

              {commentError && commentError !== "authentication_required" && (
                <div className='mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm'>
                  {commentError}
                </div>
              )}

              {/* Comments List */}
              {commentsLoading ? (
                <div className='py-4 text-center'>
                  <div className='inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
                  <p className='mt-2 text-sm text-gray-500'>Loading comments...</p>
                </div>
              ) : commentError === "authentication_required" ? (
                <div className='py-8 text-center bg-blue-50 rounded-lg'>
                  <div className='mx-auto w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-3'>
                    <FaComment size={20} className='text-blue-500' />
                  </div>
                  <h4 className='text-lg font-medium text-gray-900 mb-2'>
                    Sign in to view comments
                  </h4>
                  <p className='text-gray-600 mb-4 max-w-md mx-auto'>
                    Please log in to view and participate in the discussion.
                  </p>
                  <a
                    href='/login'
                    className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
                  >
                    Sign in
                  </a>
                </div>
              ) : comments.length > 0 ? (
                <div className='space-y-4'>
                  {comments.map((comment) => (
                    <div key={comment.id} className='border rounded-lg p-3'>
                      {editingCommentId === comment.id ? (
                        <div className='space-y-2'>
                          <textarea
                            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                          />
                          <div className='flex justify-end gap-2'>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700'
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(comment.id)}
                              className='px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className='flex justify-between items-start'>
                            <div className='flex items-center gap-2'>
                              <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                                <ProfileImage
                                  src={comment.user?.profileImageUrl}
                                  alt={comment.user?.username || "User"}
                                  size={32}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                              <div>
                                <p className='font-medium text-sm'>
                                  {comment.user?.username || "Anonymous User"}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {formatRelativeTime(comment.createdAt)}
                                  {comment.updatedAt !== comment.createdAt &&
                                    " (edited)"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className='mt-2 text-gray-700'>{comment.content}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-gray-500 text-center py-4'>
                  No comments yet. Be the first to comment!
                </div>
              )}
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
              <img
                src={post.thumbnailUrl || post.imageUrls?.[0] || ""}
                alt={post.title}
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