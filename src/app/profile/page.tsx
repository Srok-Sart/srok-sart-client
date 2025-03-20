import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/api/get-user-profile";
import ProfileImage from "../components/profile-image";
import ProfileActions from "./profile-actions";
import ProfileContent from "./profile-content";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import NavigationWrapper from "../components/navigation-wrapper";

export default async function ProfilePage() {
  // Get auth token from cookie (server component)
  const cookieStore = cookies();
  const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;

  // Redirect to login if not authenticated
  if (!token) {
    redirect('/login');
  }

  const profile = await getUserProfile();

  return (
    <div className='min-h-screen bg-gray-50'>
      <NavigationWrapper />
      <div className='max-w-4xl mx-auto px-4 py-10'>
        {/* Profile Header Card */}
        <div className='bg-white rounded-xl shadow-md p-8 mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center'>
            {/* Profile Image Section */}
            <div className='flex justify-center sm:justify-start mb-6 sm:mb-0'>
              <div className='w-32 h-32 rounded-full overflow-hidden flex items-center justify-center'>
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

        {/* Profile Content - Pass token to the client component */}
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <ProfileContent initialProfile={profile} token={token} />
        </div>
      </div>
    </div>
  );
}