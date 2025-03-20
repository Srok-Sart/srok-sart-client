"use client";

import {
  Comment,
  createComment,
  getAllComments,
  updateComment,
} from "@/api/comments";
import { markPostAsCompleted } from "@/api/post";
import ProfileImage from "@/app/components/profile-image";
import { Post } from "@/app/interfaces/post";
import { useDebounce } from "@/hooks/use-debounce";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaComment, FaHeart, FaShareAlt } from "react-icons/fa";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
} from "react-share";

interface PostInfoCardProps {
  post: Post;
  likeCount: number;
  liked: boolean;
  saved: boolean;
  showShareMenu: boolean;
  shareUrl: string;
  handleLikeClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSaveClick: (e: any) => void;
  handleShareClick: () => void;
  copyToClipboard: () => void;
  comment: string;
  setComment: (comment: string) => void;
  token?: string;
  isUserAuthenticated?: boolean;
  isSaveLoading: boolean;
}

const PostInfoCard: React.FC<PostInfoCardProps> = ({
  post,
  likeCount,
  liked,
  saved,
  showShareMenu,
  shareUrl,
  handleLikeClick,
  handleSaveClick,
  handleShareClick,
  copyToClipboard,
  comment,
  setComment,
  token,
}) => {
  const [completed, setCompleted] = useState(false);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const debouncedHandleLikeClick = useDebounce(handleLikeClick, 500); // Debounce the like click

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
        // Don't log the error to console to avoid cluttering the console
        // console.error("Error fetching comments:", error);

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

  const handleMarkAsCompleted = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (completed || isMarkingCompleted) return;

    try {
      setIsMarkingCompleted(true);
      const res = await markPostAsCompleted(post.id);
      setCompleted(true);
      // Show success message
      alert(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error marking post as completed:", error);
      if (error.message === "You have already completed this post") {
        alert("You have already completed this post");
        setCompleted(true);
      } else {
        alert("Failed to mark post as completed. Please try again.");
      }
    } finally {
      setIsMarkingCompleted(false);
    }
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
    <div className='flex-1 space-y-6'>
      {/* Creator info */}
      <div className='flex items-center'>
        <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
          <ProfileImage
            src={post.user?.profileImageUrl}
            alt={post.user?.username || "User"}
            size={40}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='ml-3'>
          <p className='text-sm font-medium text-gray-900'>
            {post.user?.username}
          </p>
          {/* <p className='text-xs text-gray-500'>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p> */}
        </div>
      </div>

      {/* Post Title and Description */}
      <div className='bg-white p-4 rounded-lg shadow-sm'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>{post.title}</h1>
        {post.description ? (
          <p className='text-gray-700'>{post.description}</p>
        ) : (
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

      {/* Action Buttons */}
      <div className='bg-white p-4 rounded-lg shadow-sm'>
        <div className='flex items-center justify-between'>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              liked
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={debouncedHandleLikeClick}
            title={token ? "Like this post" : "Sign in to like this post"}
          >
            <FaHeart size={18} />
            <span>{token ? "Like" : "Sign in to like"}</span>
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

        {/* Mark as Completed Button */}
        <button
          onClick={handleMarkAsCompleted}
          disabled={completed || isMarkingCompleted}
          className={`mt-4 flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
            completed
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
          } ${isMarkingCompleted ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <span className='mr-2'>
            {completed ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                <polyline points='22 4 12 14.01 9 11.01'></polyline>
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <polyline points='12 6 12 12 16 14'></polyline>
              </svg>
            )}
          </span>
          <span className='font-medium'>
            {isMarkingCompleted
              ? "Processing..."
              : completed
              ? "Completed"
              : "Mark as Completed"}
          </span>
        </button>

        {/* Comments Section */}
        <div className='bg-white p-4 rounded-lg shadow-sm mt-6'>
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
  );
};

export default PostInfoCard;