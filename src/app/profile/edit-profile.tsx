"use client";

import Image from "next/image";
import { useState } from "react";
import { UserProfile } from "../interfaces/user-profile";

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

export default function EditProfileModal({
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: (profile.firstName || "") + (profile.lastName || "") || "",
    username: profile.username || "",
    bio: profile.bio || "",
    profileImageUrl: profile.profileImageUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      ...formData,
    });
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Edit Profile</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex items-center justify-center mb-4'>
            <div className='w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300'>
              <Image
                src={formData.profileImageUrl || "/placeholder-avatar.png"}
                alt='Profile'
                width={80}
                height={80}
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Username
            </label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Bio
            </label>
            <textarea
              name='bio'
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <div className='flex justify-end space-x-3 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded-md bg-[var(--primary-color)] text-white hover:opacity-90'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
