"use client";
import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import AddNewPost from "./AddNewPost";
import EditPost from "./EditPost";
import ViewPost from "./ViewPost";
import { Post } from "../../../interfaces/post";
import { fetcher } from "@/api/base";

const Posts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("ID Ascending");
    const [showAddNewPost, setShowAddNewPost] = useState(false);
    const [showEditPost, setShowEditPost] = useState(false);
    const [showViewPost, setShowViewPost] = useState(false);
    const [editPostId, setEditPostId] = useState<number | null>(null);
    const [viewPostId, setViewPostId] = useState<number | null>(null);

    useEffect(() => {
        // Fetch posts from the API
        const fetchPosts = async () => {
            try {
                const data = await fetcher<Post[]>("/posts");
                console.log("Fetched posts:", data); // Debugging log
                if (Array.isArray(data)) {
                    const sortedPosts = data.sort((a: Post, b: Post) => a.id - b.id);
                    setPosts(sortedPosts);
                } else {
                    console.error("Invalid data structure:", data);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const option = e.target.value;
        setSortOption(option);
        const sortedPosts = [...posts].sort((a: Post, b: Post) => {
            if (option === "ID Ascending") {
                return a.id - b.id;
            } else if (option === "ID Descending") {
                return b.id - a.id;
            }
            return 0; // Default return value
        });
        setPosts(sortedPosts);
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8000/posts/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error(`Failed to delete post: ${res.statusText}`);
            }
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEdit = (id: number) => {
        setEditPostId(id);
        setShowEditPost(true);
    };

    const handleView = (id: number) => {
        setViewPostId(id);
        setShowViewPost(true);
    };

    const handleAddNewPost = (newPost: Post) => {
        setPosts((prevPosts) => [...prevPosts, newPost]);
    };

    const handleUpdatePost = (updatedPost: Post) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === updatedPost.id ? updatedPost : post
            )
        );
    };

    const filteredPosts = posts.filter((post) => {
        return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <div className="p-4">
            {showAddNewPost ? (
                <AddNewPost setShowAddNewPost={setShowAddNewPost} onAddNewPost={handleAddNewPost} />
            ) : showEditPost && editPostId !== null ? (
                <EditPost setShowEditPost={setShowEditPost} onUpdatePost={handleUpdatePost} id={editPostId} />
            ) : showViewPost && viewPostId !== null ? (
                <ViewPost setShowViewPost={setShowViewPost} id={viewPostId} />
            ) : (
                <>
                    {/* Header Section */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">Post Management</h1>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-black">All Posts</h2>
                            <div className="flex items-center space-x-4">
                                {/* Search Bar */}
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {/* Sort Dropdown */}
                                <div>
                                    <select
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        className="border rounded-md px-3 py-2"
                                    >
                                        <option value="ID Ascending">Sort by: ID Ascending</option>
                                        <option value="ID Descending">Sort by: ID Descending</option>
                                    </select>
                                </div>
                                {/* Add New Post Button */}
                                <button
                                    onClick={() => setShowAddNewPost(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Add New Post
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    {posts.length === 0 ? (
                        <p>No posts available.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">Title</th>
                                    <th className="p-2 border">Description</th>
                                    <th className="p-2 border">Difficulty Level</th>
                                    <th className="p-2 border">Type</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.map((post) => (
                                    <tr key={post.id}>
                                        <td className="p-2 border">{post.id}</td>
                                        <td className="p-2 border">{post.title}</td>
                                        <td className="p-2 border">{truncateText(post.description ?? "", 50)}</td>
                                        <td className="p-2 border">{post.postDifficulty}</td>
                                        <td className="p-2 border">{post.postType}</td>
                                        <td className="p-2 border">
                                            <div className="flex justify-center space-x-2">
                                                {/* View Button */}
                                                <button
                                                    onClick={() => handleView(post.id)}
                                                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors p-2 rounded-full shadow-md"
                                                    title="View Post"
                                                >
                                                    <FaEye className="text-lg" />
                                                </button>

                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleEdit(post.id)}
                                                    className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors p-2 rounded-full shadow-md"
                                                    title="Edit Post"
                                                >
                                                    <FaEdit className="text-lg" />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="bg-red-100 text-red-600 hover:bg-red-200 transition-colors p-2 rounded-full shadow-md"
                                                    title="Delete Post"
                                                >
                                                    <FaTrashAlt className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default Posts;