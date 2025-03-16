import { getUserProfile } from "@/api/get-user-profile";
import Image from "next/image";
import Navigation from "../components/navigation";
import ProfileContent from "./profile-content";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  return (
    <div className='min-h-screen bg-white'>
      <Navigation />
      <div className='max-w-4xl mx-auto px-4 py-8 mt-7'>
        {/* Profile Header */}
        <div className='flex flex-col items-center space-y-4'>
          <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--primary-color)]'>
            <Image
              src={profile.profileImageUrl ?? "/placeholder-avatar.png"}
              alt='Profile'
              width={100}
              height={100}
              className='w-full h-full object-cover rounded-full'
            />
          </div>
          <h1 className='text-3xl font-bold'>@{profile.username}</h1>
          {profile.bio && (
            <p className='text-gray-600 text-center max-w-md'>{profile.bio}</p>
          )}
          <div className='flex gap-2'>
            <button className='px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold'>
              Share
            </button>
            {/* You can remove this button if editing is handled in ProfileContent */}
          </div>
        </div>

        {/* Profile Content (with tabs, create post, and edit profile modal) */}
        <ProfileContent initialProfile={profile} />
      </div>
    </div>
  );
}
