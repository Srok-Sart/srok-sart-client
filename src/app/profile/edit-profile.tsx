"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/app/interfaces/user-profile";
import Image from "next/image";

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
  token?: string;
}

export default function EditProfileModal({
  profile,
  onClose,
  onSave,
  token,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    username: profile.username || "",
    bio: profile.bio || "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.profileImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      username: profile.username || "",
      bio: profile.bio || "",
    });
    
    if (!isImageRemoved) {
      setPreviewUrl(profile.profileImageUrl);
    }
  }, [profile, isImageRemoved]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setIsImageRemoved(false);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous error
      setUploadError(null);
    }
  };

  // Handle remove image button click
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setIsImageRemoved(true);
    console.log("Profile image removal requested");
  };

  // Custom profile image component to avoid URL constructor issues
  const ProfileImageDisplay = ({ 
    src, 
    alt,
    className = ""
  }: { 
    src: string | null, 
    alt: string,
    className?: string
  }) => {
    if (!src) {
      // Show default avatar SVG
      return (
        <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="text-gray-400 w-12 h-12"
          >
            <path 
              fillRule="evenodd" 
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      );
    }

    // Check if it's a data URL (from local file preview)
    if (src.startsWith('data:')) {
      return (
        <img
          src={src}
          alt={alt}
          className={`object-cover ${className}`}
        />
      );
    }

    // If src doesn't start with http, prepend API base URL
    const imageSrc = src.startsWith('http') 
      ? src 
      : `http://localhost:8000${src}`;
    
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={80}
        height={80}
        className={`object-cover ${className}`}
      />
    );
  };

  const uploadProfileImage = async (file: File, userId: number): Promise<string> => {
    try {
      console.log(`Starting profile image upload for user ${userId}`);
      const formData = new FormData();
      formData.append('profileImage', file);
    
      const response = await fetch(`http://localhost:8000/users/${userId}/profile-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('accessToken') || ''}`
        },
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to upload profile image';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If error response is not valid JSON, use default message
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Image upload successful:", data);
      return data.profileImageUrl;
    } catch (error) {
      console.error("Error in uploadProfileImage:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);
    
    try {
      let updatedProfile = {
        ...profile,
        ...formData,
      };
      
      // If a new image was selected, upload it first
      if (imageFile) {
        try {
          const imageUrl = await uploadProfileImage(imageFile, profile.id);
          updatedProfile.profileImageUrl = imageUrl;
        } catch (error: any) {
          setUploadError(error.message || "Failed to upload profile image");
          setIsUploading(false);
          return; // Don't proceed if image upload failed
        }
      }
      
      // Call the update API directly
      try {
        interface UpdatePayload {
          username: string;
          bio: string;
          profileImageUrl?: string | null;
        }
        
        const updatePayload: UpdatePayload = {
          username: formData.username,
          bio: formData.bio,
        };

        // If we have a new image URL
        if (imageFile) {
          updatePayload.profileImageUrl = updatedProfile.profileImageUrl;
        } 
        // If we explicitly removed the image
        else if (isImageRemoved) {
          console.log("Setting profileImageUrl to null in update payload");
          updatePayload.profileImageUrl = null;
        }

        console.log("Update payload:", updatePayload);

        const response = await fetch(`http://localhost:8000/users/${profile.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`,
          },
          body: JSON.stringify(updatePayload),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update profile: ${response.status}`);
        }
        
        const updatedData = await response.json();
        console.log("Profile updated successfully:", updatedData);
        
        // Call onSave with the updated data from the server
        onSave(updatedData);
      } catch (error: any) {
        console.error("Error updating profile:", error);
        setUploadError("Failed to update profile data");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setUploadError("Failed to update profile");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center mb-4">
            {/* Profile image */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 mb-2">
              {isUploading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                </div>
              ) : (
                <ProfileImageDisplay
                  src={isImageRemoved ? null : previewUrl}
                  alt={profile.username || "Profile"}
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {(previewUrl || profile.profileImageUrl) && !isImageRemoved && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Remove Photo
                </button>
              )}
            </div>
            {uploadError && (
              <p className="text-red-500 text-xs mt-1">{uploadError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white hover:opacity-90 disabled:opacity-50"
              disabled={isUploading}
            >
              {isUploading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}