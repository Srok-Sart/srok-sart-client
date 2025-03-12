"use client";
import React, { useEffect, useState } from "react";
import { Post } from "../../../interfaces/post";
import ConfirmationModal from "../posts/subcomponents/confirmation-modal";
import { HeaderSection } from "../posts/subcomponents/header-section";
import PostsTable from "../posts/subcomponents/posts-table";
import ViewPost from "../posts/view-post";

const PostsRequest = () => {
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

  const fetchPendingPosts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);

      const data = await res.json();
      let posts: Post[] = Array.isArray(data) ? data : data.data;

      if (Array.isArray(posts)) {
        // Make sure materials exists for each post
        posts = posts.map((post) => ({
          ...post,
          materials: post.materials || [],
        }));

        const pendingPosts = posts.filter(
          (post) => post.postStatus === "PENDING"
        );
        const sortedPosts = pendingPosts.sort((a, b) => a.id - b.id);
        setPosts(sortedPosts);
        setHasPendingPosts(pendingPosts.length > 0);
      }
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    }
  };

  useEffect(() => {
    fetchPendingPosts();

    // Poll for new pending posts every minute
    const intervalId = setInterval(fetchPendingPosts, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedPosts = [...posts].sort((a, b) => {
      return option === "ID Ascending" ? a.id - b.id : b.id - a.id;
    });
    setPosts(sortedPosts);
  };

  const handleView = (id: number) => {
    setViewPostId(id);
    setShowViewPost(true);
  };

  const handleApproveOrReject = (
    id: number,
    status: "PUBLISH" | "REJECTED"
  ) => {
    setConfirmationData({ id, status });
    setShowConfirmation(true);
  };

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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postStatus: status }),
        }
      );

      if (!res.ok)
        throw new Error(`Failed to update post status: ${res.statusText}`);

      // Remove the approved/rejected post from the list
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setHasPendingPosts(posts.length > 1);
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showViewPost && viewPostId !== null) {
    return <ViewPost setShowViewPost={setShowViewPost} id={viewPostId} />;
  }

  return (
    <div className='p-4'>
      {hasPendingPosts && (
        <div className='mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md'>
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
