"use client";

import { useState } from "react";

interface ProfileTabsProps {
  initialActiveTab?: string;
}

export default function ProfileTabs({
  initialActiveTab = "created",
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const tabs = [
    { id: "created", label: "Created" },
    { id: "saved", label: "Saved" },
    { id: "liked", label: "Liked" },
  ];

  return (
    <div className='flex justify-center mt-8 border-b'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 font-medium ${
            activeTab === tab.id
              ? "text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
