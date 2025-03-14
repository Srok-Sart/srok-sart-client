"use client";
import React, { useEffect, useState } from "react";
import { Post } from "../../../interfaces/post";
import AddNewPost from "./add-new-post";
import EditPost from "./edit-post";
import { HeaderSection } from "./subcomponents/header-section";
import { PostsTable } from "./subcomponents/posts-table";
import ViewPost from "./view-post";

type PostsProps = {
  activeTab: string;
  token: string;
};

type PostStatus = "PUBLISH" | "REJECTED" | "PENDING";

type SortOption = "ID Ascending" | "ID Descending";

const Posts = ({ activeTab, token }: PostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("ID Ascending");
  const [showAddNewPost, setShowAddNewPost] = useState<boolean>(false);
  const [showEditPost, setShowEditPost] = useState<boolean>(false);
  const [showViewPost, setShowViewPost] = useState<boolean>(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [viewPostId, setViewPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);

        const result = await res.json();
        if (result && Array.isArray(result.data)) {
          const sortedPosts = result.data.sort((a: Post, b: Post) => a.id - b.id);
          setPosts(sortedPosts);
        } else {
          console.error("Unexpected response structure", result);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (token) {
      fetchPosts();
    }
  }, [token]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const option = e.target.value as SortOption;
    setSortOption(option);
    const sortedPosts = [...posts].sort((a, b) => {
      return option === "ID Ascending" ? a.id - b.id : b.id - a.id;
    });
    setPosts(sortedPosts);
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
      setPosts(posts.filter((post) => post.id !== id));
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
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const handleUpdatePost = (updatedPost: Post): void => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
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
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, postStatus: status } : post
        )
      );
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const filteredPosts = posts
    .filter((post) => {
      if (activeTab === "posts") {
        return post.postStatus === "PUBLISH";
      } else if (activeTab === "postsRequest") {
        return post.postStatus === "PENDING";
      }
      return false;
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
      />
      {filteredPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
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
      )}
    </div>
  );
};

export default Posts;