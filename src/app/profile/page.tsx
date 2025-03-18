import { getUserProfile } from "@/api/get-user-profile";
import Navigation from "../components/navigation";
import ProfileImage from "../components/profile-image";
import ProfileActions from "./profile-actions";
import ProfileContent from "./profile-content";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <div className='max-w-4xl mx-auto px-4 py-10'>
        {/* Profile Header Card */}
        <div className='bg-white rounded-xl shadow-md p-8 mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center'>
            {/* Profile Image Section */}
            <div className='flex justify-center sm:justify-start mb-6 sm:mb-0'>
              <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--primary-color)] flex items-center justify-center'>
                <ProfileImage
                  src={profile.profileImageUrl}
                  alt={profile.username}
                  size={128}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            {/* Profile Info Section */}
            <div className='sm:ml-10 flex-1'>
              <h1 className='text-3xl font-bold text-center sm:text-left text-gray-800'>
                @{profile.username}
              </h1>
              {profile.bio && (
                <p className='text-gray-600 mt-3 text-center sm:text-left max-w-md leading-relaxed'>
                  {profile.bio}
                </p>
              )}

              {/* Action Buttons - Now in a separate client component */}
              <div className='mt-6'>
                <ProfileActions />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content (with tabs, create post, and edit profile modal) */}
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <ProfileContent initialProfile={profile} />
        </div>
      </div>
    </div>
  );
}
