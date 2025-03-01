import { UserProfile } from "@/app/interfaces/user-profile";
import { getAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetcher } from "./use-fetcher";

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getUserProfile = async (): Promise<UserProfile> => {
  // Get the token directly
  const token = getAuthToken();

  // If no token, redirect to login
  if (!token) {
    redirect("/login");
  }

  try {
    return await fetcher<UserProfile>("/auth/profile");
  } catch (error) {
    console.error("Failed to fetch user profile:", error);

    // Check if the error is due to auth issues
    if (
      error instanceof Error &&
      (error.message.includes("Unauthorized") ||
        error.message.includes("Forbidden"))
    ) {
      redirect("/login");
    }

    // For other errors, throw to allow error boundary to catch
    throw error;
  }
};
