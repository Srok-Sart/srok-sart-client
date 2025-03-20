import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { getUserProfile } from "@/api/get-user-profile";
import NavigationWrapper from '@/app/components/navigation-wrapper';
import CollectionContent from "./collection-content";

export default async function CollectionPage({ params }: { params: { id: string } }) {
  // Get auth token and profile data server-side
  let profileData = {
    profileImageUrl: null as string | null,
    username: ""
  };
  
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;
    
    if (token) {
      const profile = await getUserProfile();
      profileData = {
        profileImageUrl: profile?.profileImageUrl || null,
        username: profile?.username || ""
      };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
  
  return (
    <>
      <NavigationWrapper />
      <CollectionContent collectionId={params.id} />
    </>
  );
}