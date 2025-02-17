"use client";

import React from "react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-8 border-b">
      <div className="flex justify-center space-x-6">
        {["created", "bookmark"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-4 font-semibold ${
              activeTab === tab ? "border-b-2" : "text-gray-500"
            }`}
            style={{
              borderColor: activeTab === tab ? "var(--primary-color)" : "transparent",
              color: activeTab === tab ? "var(--primary-color)" : "#6b7280",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
