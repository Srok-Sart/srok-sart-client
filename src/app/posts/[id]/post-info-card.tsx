"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaHeart, FaBookmark, FaShareAlt, FaComment } from "react-icons/fa";
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";

interface Post {
  title: string;
  description?: string;
  viewCount: number;
}
import { markPostAsCompleted } from "@/api/post";

interface PostInfoCardProps {
  post: Post;
  likeCount: number;
  liked: boolean;
  saved: boolean;
  showShareMenu: boolean;
  shareUrl: string;
  handleLikeClick: () => void;
  handleSaveClick: () => void;
  handleShareClick: () => void;
  copyToClipboard: () => void;
  handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  comment: string;
  setComment: (comment: string) => void;
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
  handleCommentSubmit,
  comment,
  setComment,
}) => {
  const [completed, setCompleted] = useState(false);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);

  const handleMarkAsCompleted = async (e) => {
    e.preventDefault();
    if (completed || isMarkingCompleted) return;

    try {
      setIsMarkingCompleted(true);
      const res = await markPostAsCompleted(post.id);
      setCompleted(true);
      // Show success message
      alert(res);
    } catch (error) {
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

  return (
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
            onClick={handleLikeClick}
          >
            <FaHeart size={18} />
            <span>Like</span>
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

        {/* Mark as Completed Button */}
        <button
          onClick={handleMarkAsCompleted}
          disabled={completed || isMarkingCompleted}
          className={`flex items-center px-4 py-2 rounded-md ${
            completed
              ? "bg-green-100 text-green-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <span className='material-icons mr-1'>
            {completed ? "check_circle" : "check_circle_outline"}
          </span>
          <span>{completed ? "Completed" : "Mark as Completed"}</span>
        </button>

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
                disabled={!comment.trim()}
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
  );
};

export default PostInfoCard;
