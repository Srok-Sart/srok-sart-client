"use client";
import React, { useState } from "react";
import Posts from "./components/posts/post";
import PostsRequest from "./components/posts/posts-request";
import Materials from "./components/materials/materials";
import Sidebar from "./sidebar";

interface AdminContentProps {
  token: string;
}

const AdminContent = ({ token }: AdminContentProps) => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="flex h-full">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-grow bg-white p-4 ml-60 min-h-screen">
        <section className="mt-4">
          {activeTab === "posts" && <Posts activeTab={activeTab} token={token} />}
          {activeTab === "postsRequest" && <PostsRequest activeTab={activeTab} token={token} />}
          {activeTab === "materials" && <Materials activeTab={activeTab} token={token} />}
        </section>
      </main>
    </div>
  );
};

export default AdminContent;