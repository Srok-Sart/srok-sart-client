"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaHeart, FaShareAlt } from "react-icons/fa";
import Navigation from "../components/navigation";
import "../globals.css";
import {
  FacebookShareButton,
  TelegramShareButton,
  FacebookIcon,
  TelegramIcon,
} from "next-share";

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
  const [shareUrl, setShareUrl] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);

      // Retrieve like state and count from localStorage
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
      setIsLiked(!!likedPosts[post.id]);
      setLikeCount(likedPosts[post.id]?.likeCount || post.likeCount || 0);
    }
  }, [post.id, post.likeCount]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLikeLoading(true);

    try {
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;

      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);

      // Update localStorage
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
      if (newLikedState) {
        likedPosts[post.id] = { isLiked: true, likeCount: newLikeCount };
      } else {
        delete likedPosts[post.id];
      }
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="pt-16 max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Image
            src={
              (process.env.NEXT_PUBLIC_API_URL || "localhost:8000") +
              post.imageUrls
            }
            alt={post.title}
            width={600}
            height={800}
            className="w-full rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h5 className="text-gray-900">{post.title}</h5>
          <p className="text-gray-700">{post.description}</p>

          <div className="flex items-center gap-4">
            <button
              className={`text-gray-600 hover:text-red-500 transition flex items-center ${
                isLiked ? "text-red-500" : ""
              }`}
              onClick={handleLikeClick}
              disabled={isLikeLoading}
            >
              <FaHeart size={22} />
              <span className="ml-2">{isLikeLoading ? "..." : likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;
