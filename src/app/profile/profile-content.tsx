"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/app/interfaces/user-profile";
import EditProfileModal from "@/app/profile/edit-profile";
import { useRouter } from "next/navigation";

// Import tab components
import CreatedPostsTab from "./components/created-posts";
import SavedPostsTab from "./components/saved-posts";
import LikedPostsTab from "./components/liked-posts";

interface ProfileContentProps {
  initialProfile: UserProfile;
  token: string; // Change to required prop
}

export default function ProfileContent({
  initialProfile,
  token,
}: ProfileContentProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [activeTab, setActiveTab] = useState("created");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const tabs = [
    { id: "created", label: "Created", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ) },
    { id: "saved", label: "Saved", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    ) },
    { id: "liked", label: "Liked", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ) },
  ];

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    try {
      // We'll let the EditProfileModal component handle the API call
      // Just update our local state with the result
      setProfile(updatedProfile);
      setIsEditProfileOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // Render the active tab component
  const renderTabContent = () => {
    switch (activeTab) {
      case "created":
        return <CreatedPostsTab userId={profile.id} token={token} />;
      case "saved":
        return <SavedPostsTab userId={profile.id} token={token} />;
      case "liked":
        return <LikedPostsTab userId={profile.id} token={token} />;
      default:
        return <CreatedPostsTab userId={profile.id} token={token} />;
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? "text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className={activeTab === tab.id ? "text-[var(--primary-color)]" : "text-gray-400"}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Section */}
      <div className="p-8">
        {renderTabContent()}
      </div>

      {/* Hidden button to trigger Edit Profile Modal */}
      <button
        id="edit-profile-btn"
        onClick={() => setIsEditProfileOpen(true)}
        className="hidden"
      >
        Edit Profile
      </button>
      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleProfileUpdate}
          token={token}
        />
      )}
    </>
  );
}