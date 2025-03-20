import { cookies } from "next/headers";
import { getUserProfile } from "@/api/get-user-profile";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import Navigation from "./navigation";

export default async function NavigationWrapper() {
  let profileImageUrl = null;
  let username = "";
  
  try {
    // Get auth token from cookie
    const cookieStore = cookies();
    const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;
    
    // If authenticated, get the user profile
    if (token) {
      const profile = await getUserProfile();
      profileImageUrl = profile?.profileImageUrl || null;
      username = profile?.username || "";
    }
  } catch (error) {
    console.error("Error fetching user profile for navigation:", error);
    // Continue without profile data - will show default avatar
  }
  
  // Pass the data to the client component
  return (
    <Navigation 
      initialProfileImageUrl={profileImageUrl}
      initialUsername={username}
    />
  );
}