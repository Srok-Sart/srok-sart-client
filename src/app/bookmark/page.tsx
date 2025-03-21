import { getUserProfile } from "@/api/get-user-profile";
import NavigationWrapper from "@/app/components/navigation-wrapper";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import BookmarkContent from "./bookmark-content";

export default async function BookmarkPage() {
  // Get auth token and profile data server-side
  let profileData = {
    profileImageUrl: null as string | null,
    username: "",
  };

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      const profile = await getUserProfile();
      profileData = {
        profileImageUrl: profile?.profileImageUrl || null,
        username: profile?.username || "",
      };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }

  return (
    <>
      <NavigationWrapper />
      <BookmarkContent />
    </>
  );
}
