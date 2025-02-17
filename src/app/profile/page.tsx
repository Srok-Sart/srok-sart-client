"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navigation";
import ProfileTabs from "./profile-tab";
import EditProfileModal from "./edit-profile";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "Headangelly Huy",
    username: "headangelly",
    avatar: "/grid/img1.png", // Use image instead of letter avatar
  });
  const [activeTab, setActiveTab] = useState("created");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 mt-7">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--primary-color)]">
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
          </div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <span className="text-gray-600">@{profile.username}</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold">
              Share
            </button>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Nothing to show...yet! Start creating now.</p>
          <button
            onClick={() => router.push("/upload")}
            className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90"
          >
            Create Post
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            setIsEditProfileOpen(false);
          }}
        />
      )}
    </div>
  );
}
