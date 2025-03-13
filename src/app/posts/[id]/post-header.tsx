import React from "react";
import { FaClock } from "react-icons/fa";
import { Post } from "@/app/interfaces/post";

interface PostHeaderProps {
  post: Post;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
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
  );
};

export default PostHeader;
