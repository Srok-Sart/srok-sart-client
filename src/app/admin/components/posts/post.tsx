"use client";
import React, { useEffect, useState } from "react";
import { Post } from "../../../interfaces/post";
import AddNewPost from "./add-new-post";
import EditPost from "./edit-post";
import { HeaderSection } from "./subcomponents/header-section";
import { PostsTable } from "./subcomponents/posts-table";
import ViewPost from "./view-post";
import Pagination from "./subcomponents/pagination";

type PostsProps = {
  activeTab: string;
  token: string;
};

type PostStatus = "PUBLISH" | "REJECTED" | "PENDING" | "ALL";

type SortOption = "ID Ascending" | "ID Descending";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

const Posts = ({ activeTab, token }: PostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("ID Ascending"); // Default sort by ID ascending
  const [showAddNewPost, setShowAddNewPost] = useState<boolean>(false);
  const [showEditPost, setShowEditPost] = useState<boolean>(false);
  const [showViewPost, setShowViewPost] = useState<boolean>(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [viewPostId, setViewPostId] = useState<number | null>(null);
  const [postStatus, setPostStatus] = useState<PostStatus>("ALL");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);

      const result = await res.json();
      if (result && Array.isArray(result.data)) {
        const sortedPosts = [...result.data].sort((a: Post, b: Post) => {
          return sortOption === "ID Ascending" ? a.id - b.id : b.id - a.id;
        });
        
        setPosts(sortedPosts);
        
        setPagination({
          total: result.total || 0,
          page: result.page || 1,
          limit: result.limit || 10
        });
      } else {
        console.error("Unexpected response structure", result);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts(1);
    }
  }, [token]);

  useEffect(() => {
    const sortedPosts = [...posts].sort((a: Post, b: Post) => {
      return sortOption === "ID Ascending" ? a.id - b.id : b.id - a.id;
    });
    setPosts(sortedPosts);
  }, [sortOption]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const option = e.target.value as SortOption;
    setSortOption(option);
  };

  const handlePostStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setPostStatus(e.target.value as PostStatus);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchPosts(newPage);
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Failed to delete post: ${res.statusText}`);
      fetchPosts(pagination.page);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (id: number): void => {
    setEditPostId(id);
    setShowEditPost(true);
  };

  const handleView = (id: number): void => {
    setViewPostId(id);
    setShowViewPost(true);
  };

  const handleAddNewPost = (newPost: Post): void => {
    fetchPosts(1);
  };

  const handleUpdatePost = (updatedPost: Post): void => {
    fetchPosts(pagination.page);
  };

  const handleApproveOrReject = async (id: number, status: PostStatus): Promise<void> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ postStatus: status }),
      });
      if (!res.ok) throw new Error(`Failed to update post status: ${res.statusText}`);
      fetchPosts(pagination.page);
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const filteredPosts = posts
    .filter((post) => {
      if (postStatus === "ALL") {
        return true;
      }
      return post.postStatus === postStatus;
    })
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (showAddNewPost) {
    return (
      <AddNewPost
        setShowAddNewPost={setShowAddNewPost}
        onAddNewPost={handleAddNewPost}
        token={token}
      />
    );
  }

  if (showEditPost && editPostId !== null) {
    return (
      <EditPost
        setShowEditPost={setShowEditPost}
        onUpdatePost={handleUpdatePost}
        id={editPostId}
        token={token}
      />
    );
  }

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
      <HeaderSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        handleSortChange={handleSortChange}
        setShowAddNewPost={setShowAddNewPost}
        postStatus={postStatus}
        handlePostStatusChange={handlePostStatusChange}
        showPostStatusFilter={true}
      />
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <>
          <PostsTable
            posts={filteredPosts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onApproveOrReject={
              activeTab === "postsRequest" ? handleApproveOrReject : undefined
            }
            isPostsRequestTab={activeTab === "postsRequest"}
          />
          
          <Pagination 
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.limit)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Posts;