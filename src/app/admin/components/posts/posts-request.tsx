"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Post } from "../../../interfaces/post";
import ConfirmationModal from "../posts/subcomponents/confirmation-modal";
import { HeaderSection } from "../posts/subcomponents/header-section";
import PostsTable from "../posts/subcomponents/posts-table";
import ViewPost from "../posts/view-post";

type PostsRequestProps = {
  activeTab: string;
  token: string;
};

const PostsRequest = ({ token }: PostsRequestProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showViewPost, setShowViewPost] = useState(false);
  const [viewPostId, setViewPostId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    id: number;
    status: "PUBLISH" | "REJECTED";
  } | null>(null);
  const [hasPendingPosts, setHasPendingPosts] = useState(false);

  const fetchPendingPosts = useCallback(async () => {
    try {
      console.log("Fetching posts with token:", token?.substring(0, 10) + "...");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);
  
      const data = await res.json();
      console.log("API response:", data);
      
      const postsArray: Post[] = Array.isArray(data) ? data : data.data;
      console.log("Posts array:", postsArray);
      
      if (Array.isArray(postsArray)) {
        const pendingPosts = postsArray
          .filter((post) => {
            console.log(`Post ${post.id} status: ${post.postStatus}`);
            return post.postStatus === "PENDING";
          })
          .map((post) => ({
            ...post,
          }))
          .sort((a, b) => a.id - b.id);
        
        console.log("Filtered pending posts:", pendingPosts);
        setPosts(pendingPosts);
        setHasPendingPosts(pendingPosts.length > 0);
      } else {
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchPendingPosts();

    // Poll for new pending posts every 60 seconds
    const intervalId = setInterval(fetchPendingPosts, 60000);
    return () => clearInterval(intervalId);
  }, [fetchPendingPosts]);

  /**
   * Handles sorting logic based on selected option
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedPosts = [...posts].sort((a, b) =>
      option === "ID Ascending" ? a.id - b.id : b.id - a.id
    );
    setPosts(sortedPosts);
  };

  /**
   * Handles viewing a post
   */
  const handleView = (id: number) => {
    setViewPostId(id);
    setShowViewPost(true);
  };

  /**
   * Opens the confirmation modal for approval/rejection
   */
  const handleApproveOrReject = (
    id: number,
    status: "PUBLISH" | "REJECTED"
  ) => {
    setConfirmationData({ id, status });
    setShowConfirmation(true);
  };

  /**
   * Sends a request to update the post status
   */
  const updatePostStatus = async () => {
    if (!confirmationData) return;

    const { id, status } = confirmationData;
    setShowConfirmation(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postStatus: status }),
        }
      );

      if (!res.ok)
        throw new Error(`Failed to update post status: ${res.statusText}`);

      setPosts((prevPosts) => {
        const updatedPosts = prevPosts.filter((post) => post.id !== id);
        setHasPendingPosts(updatedPosts.length > 0);
        return updatedPosts;
      });
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showViewPost && viewPostId !== null) {
    return (
      <ViewPost
        setShowViewPost={setShowViewPost}
        id={viewPostId}
        token={token}
      />
    );
  }

  return (
    <div className='flex flex-col h-full p-1'>
      {hasPendingPosts && (
        <div className='mb-2 p-2 bg-yellow-100 text-yellow-800 rounded-md'>
          There are pending posts that need your attention.
        </div>
      )}

      <HeaderSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        handleSortChange={handleSortChange}
        hideAddButton={true}
      />

      <PostsTable
        posts={filteredPosts}
        onView={handleView}
        onEdit={() => {}} // Not used in this context
        onDelete={() => {}} // Not used in this context
        onApproveOrReject={handleApproveOrReject}
        isPostsRequestTab={true}
        startIndex={0} // Start count from 1
      />

      {showConfirmation && confirmationData && (
        <ConfirmationModal
          message={`Are you sure you want to ${
            confirmationData.status === "PUBLISH" ? "approve" : "reject"
          } this post?`}
          onConfirm={updatePostStatus}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default PostsRequest;