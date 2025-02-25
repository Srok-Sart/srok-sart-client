"use client";
import React, { useState } from "react";
import Posts from "./components/posts/post";
import Image from "next/image";
import Materials from "./components/materials/materials";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "postsRequest", label: "Posts Request" },
    { id: "materials", label: "Materials" }
  ];

  return (
    <div className="min-h-screen w-60 bg-white shadow-lg flex flex-col fixed">
      <div className="p-4 flex items-center">
        <Image src="/logo.png" alt="Logo" width={48} height={48} className="mr-2" />
        <h1 className="text-lg text-black font-bold">Srok Sart</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200
                  ${activeTab === tab.id ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-purple-200"}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="flex h-full">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-grow bg-white p-4 ml-60 min-h-screen">
        <section className="mt-4">
          {activeTab === "posts" && <Posts activeTab={activeTab} />}
          {activeTab === "postsRequest" && <Posts activeTab={activeTab} />}
          {activeTab === "materials" && <Materials activeTab={activeTab} />}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;