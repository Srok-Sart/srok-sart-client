import { redirect } from "next/navigation";
import { fetcher } from "./use-fetcher";
import { UserProfile } from "@/app/interfaces/user-profile";

export const getUserProfile = async (): Promise<UserProfile> => {
  // Get the token depending on environment
  let token: string | undefined;

  // Check if we're running on client side
  if (typeof window !== 'undefined') {
    // Client-side: Get from document.cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('accessToken='));
    token = tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : undefined;
  } else {
    // Server-side: Use dynamic import to avoid initial parsing errors
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      token = cookieStore.get("accessToken")?.value;
    } catch (error) {
      console.error("Error accessing server cookies:", error);
    }
  }

  if (!token) {
    redirect("/login");
  }

  try {
    return await fetcher<UserProfile>("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);

    if (
      error instanceof Error &&
      (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))
    ) {
      redirect("/login");
    }

    throw error;
  }
};