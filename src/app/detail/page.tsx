"use client";

import Image from "next/image";
import React from "react";
import { FaBookmark, FaHeart, FaShareAlt } from "react-icons/fa";
import Navigation from "../components/navigation";
import "../globals.css";
import {
  FacebookShareButton,
  TelegramShareButton,
  FacebookIcon,
  TelegramIcon,
} from 'next-share';
import { useLikeContext } from "../context/like-context";

import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  postType?: string;
  description?: string;
  imageUrls: string[];
  thumbnailUrl: string;
  likeCount?: number;
}

interface DetailPageProps {
  post: Post;
}

const DetailPage: React.FC<DetailPageProps> = ({ post }) => {
  const { isPostLiked, toggleLike, getLikeCount, isAuthenticated } = useLikeContext();
  const [shareUrl, setShareUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }

    setIsLiked(isPostLiked(post.id));
    setLikeCount(getLikeCount(post.id, post.likeCount || 0));
  }, [post.id, isPostLiked, getLikeCount, post.likeCount]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      // Don't proceed further - we'll need to implement a login modal
      return;
    }
  
    try {
      const result = await toggleLike(post.id, likeCount);
      
      if (result.success) {
        setIsLiked(!isLiked);
        setLikeCount(result.newCount);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Handle error - maybe show a toast notification
    }
  };

  // Instagram doesn't have a direct share API, so we use copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Link copied! You can now paste it on Instagram.');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <>
      <Navigation />
      <div className='pt-16 max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8'>
        {/* Left: Image Section */}
        <div className='flex-1'>
          <Image
            src={
              (process.env.NEXT_PUBLIC_API_URL || "localhost:8000") +
              post.imageUrls
            }
            alt={post.title}
            width={600}
            height={800}
            className='w-full rounded-lg object-cover'
          />
        </div>

        {/* Right: Post Details */}
        <div className='flex-1 space-y-4'>
          {/* Creator Info */}
          <div className='flex items-center gap-3'>
            <Image
              src='/grid/img1.png' // Replace with actual creator image URL if available
              alt='Creator'
              width={30}
              height={30}
              className='w-10 h-10 rounded-full object-cover'
            />
            <p className='text-lg font-semibold'>Mr. Cat</p>
          </div>

          <h5 className='text-gray-900'>{post.title}</h5>

          {/* Post Description */}
          <p className='text-gray-700'>{post.description}</p>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-1.5 transition"
              onClick={handleLike}
            >
              <FaHeart 
                size={22} 
                className={isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"} 
              />
              <span className="text-sm">{likeCount}</span>
            </button>
            <button className='text-gray-600 hover:text-gray-900 transition'>
              <FaShareAlt size={22} />
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-3 flex gap-2 z-50">
                <FacebookShareButton
                  url={shareUrl}
                  quote={post.title}
                  hashtag="#SrokSart"
                  className="hover:opacity-80 transition"
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>

                <TelegramShareButton
                  url={shareUrl}
                  title={post.title}
                  className="hover:opacity-80 transition"
                >
                  <TelegramIcon size={32} round />
                </TelegramShareButton>

                <button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full w-8 h-8 flex items-center justify-center hover:opacity-80 transition"
                  title="Copy link for Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

          {/* Comments Section */}
          <div>
            <h3 className='text-lg font-semibold mt-4'>Comments</h3>
            <div className='mt-2 border rounded-lg p-2 flex items-center'>
              <input
                type='text'
                placeholder='Add a comment...'
                className='w-full bg-transparent outline-none'
              />
            </div>
          </div>
        </div>
    </>
  );
};

export default DetailPage;
