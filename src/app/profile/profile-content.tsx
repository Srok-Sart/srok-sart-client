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
    // Send a PATCH request to your NestJS API endpoint
    const response = await fetch("http://localhost:4000/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
      credentials: "include", // Include cookies if using cookie-based auth
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status}`);
    }

    // Parse the updated user data returned from the API
    const newUser = await response.json();

    // Update local state with the new profile data and close the modal
    setProfile(newUser);
    setIsEditProfileOpen(false);
    router.refresh(); // Optional: refresh the page to load any server-side changes
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

      {/* Content Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Nothing to show...yet! Start creating now.
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90"
        >
          Create Post
        </button>
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
