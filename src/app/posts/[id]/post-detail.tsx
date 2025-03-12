"use client";

import { fetchCollections, savePostToCollection } from "@/api/bookmark";
import Navigation from "@/app/components/navigation";
import { Post } from "@/app/interfaces/post";
import React, { useEffect, useState } from "react";
import CollectionSelectionModal from "./collection-selection-modal";
import PostInfoCard from "./post-info-card";
import MediaGallery from "./media-gallery";
import PostHeader from "./post-header";

interface PostDetailPageProps {
  post: Post;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ post }) => {
  const [shareUrl, setShareUrl] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const collections = await fetchCollections();
    setCollections(collections);
    setShowCollections(true);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log("Submitting comment:", comment);
      setComment("");
    }
  };

  return (
    <>
      <Navigation />
      <div className='pt-16 pb-16 max-w-5xl mx-auto px-4'>
        <PostHeader post={post} />

        <div className='flex flex-col md:flex-row gap-8'>
          <MediaGallery post={post} />

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
            handleCommentSubmit={handleCommentSubmit}
            copyToClipboard={copyToClipboard}
            showShareMenu={showShareMenu}
            shareUrl={shareUrl}
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
