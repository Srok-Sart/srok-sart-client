"use client";
import React, { useState } from "react";
import Posts from "./components/posts/Posts";
import Image from "next/image";

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "posts", label: "Posts" },
        { id: "postsRequest", label: "Posts Request" }
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

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("posts");

    return (
        <div className="flex h-full">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-grow bg-white p-4 ml-60 min-h-screen">
                <header className="bg-white shadow p-4 mb-4">
                    <h1 className="text-2xl font-bold capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h1>
                </header>
                <section className="mt-4">
                    {activeTab === "posts" && <Posts />}
                    {activeTab === "postsRequest" && <h1>Posts Request</h1>}
                </section>
            </main>
        </div>
    );
}