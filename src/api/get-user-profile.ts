import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetcher } from "./use-fetcher";
import { UserProfile } from "@/app/interfaces/user-profile";

export const getUserProfile = async (): Promise<UserProfile> => {
  // Await cookies() to get the actual cookie store
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

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
