"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Post } from "../../../interfaces/post";
import ConfirmationModal from "../posts/subcomponents/confirmation-modal";
import { HeaderSection } from "../posts/subcomponents/header-section";
import PostsTable from "../posts/subcomponents/posts-table";
import ViewPost from "../posts/view-post";
import Pagination from "./subcomponents/pagination";

type PostsRequestProps = {
  activeTab: string;
  token: string;
};

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

const PostsRequest = ({ token }: PostsRequestProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending"); // Default to ascending order
  const [showViewPost, setShowViewPost] = useState(false);
  const [viewPostId, setViewPostId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    id: number;
    status: "PUBLISH" | "REJECTED";
  } | null>(null);
  const [hasPendingPosts, setHasPendingPosts] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPendingPosts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}&limit=${pagination.limit}&status=PENDING`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);

      const data = await res.json();
      const postsArray: Post[] = Array.isArray(data) ? data : data.data;

      if (Array.isArray(postsArray)) {
        let pendingPosts = postsArray
          .filter((post) => post.postStatus === "PENDING")
          .map((post) => ({
            ...post,
          }));
        
        // Sort by ID (ascending by default)
        pendingPosts = pendingPosts.sort((a, b) => 
          sortOption === "ID Ascending" ? a.id - b.id : b.id - a.id
        );

        setPosts(pendingPosts);
        setHasPendingPosts(pendingPosts.length > 0);
        
        // Update pagination info
        setPagination({
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 10
        });
      } else {
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    } finally {
      setLoading(false);
    }
  }, [token, pagination.limit]);

  useEffect(() => {
    fetchPendingPosts(1);

    // Poll for new pending posts every 60 seconds
    const intervalId = setInterval(() => fetchPendingPosts(pagination.page), 60000);
    return () => clearInterval(intervalId);
  }, [fetchPendingPosts]);

  // When sort option changes, sort the current posts without refetching
  useEffect(() => {
    setPosts(prevPosts => 
      [...prevPosts].sort((a, b) => 
        sortOption === "ID Ascending" ? a.id - b.id : b.id - a.id
      )
    );
  }, [sortOption]);

  /**
   * Handles sorting logic based on selected option
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    // Sorting will happen in the useEffect that depends on sortOption
  };

  /**
   * Handles viewing a post
   */
  const handleView = (id: number) => {
    setViewPostId(id);
    setShowViewPost(true);
  };

  /**
   * Handles page change
   */
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchPendingPosts(newPage);
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

      // Refresh the current page after approval/rejection
      fetchPendingPosts(pagination.page);
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

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <p>No pending posts available.</p>
      ) : (
        <>
          <PostsTable
            posts={filteredPosts}
            onView={handleView}
            onEdit={() => {}} // Not used in this context
            onDelete={() => {}} // Not used in this context
            onApproveOrReject={handleApproveOrReject}
            isPostsRequestTab={true}
          />
          
          <Pagination 
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.limit)}
            onPageChange={handlePageChange}
          />
        </>
      )}

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