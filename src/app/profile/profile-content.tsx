"use client";

import { UserProfile } from "@/app/interfaces/user-profile";
import EditProfileModal from "@/app/profile/edit-profile";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileContentProps {
  initialProfile: UserProfile;
}

export default function ProfileContent({ initialProfile }: ProfileContentProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [activeTab, setActiveTab] = useState("created");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const tabs = [
    { id: "created", label: "Created" },
    { id: "saved", label: "Saved" },
    { id: "liked", label: "Liked" },
  ];

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    try {
      const response = await fetch("http://localhost:4000/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const newUser = await response.json();
      setProfile(newUser);
      setIsEditProfileOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center mt-8 border-b">
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

      {/* Dynamic Content Section */}
      <div className="mt-8 text-center">
        {activeTab === "created" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Created Posts</h2>
            <p className="text-gray-600 mb-4">No posts yet? Start creating now.</p>
            <button
              onClick={() => router.push("/upload")}
              className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90"
            >
              Create Post
            </button>
          </>
        )}

        {activeTab === "saved" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Saved Posts</h2>
            <p className="text-gray-600 mb-4">You haven't saved anything yet.</p>
            <button
              onClick={() => router.push("/explore")}
              className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90"
            >
              Explore Posts
            </button>
          </>
        )}

        {activeTab === "liked" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Liked Posts</h2>
            <p className="text-gray-600 mb-4">No liked posts yet.</p>
            <button
              onClick={() => router.push("/explore")}
              className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90"
            >
              Find Posts to Like
            </button>
          </>
        )}
      </div>

      {/* Edit Profile Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </>
  );
}
