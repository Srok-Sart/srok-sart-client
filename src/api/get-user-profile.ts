import { UserProfile } from "@/app/interfaces/user-profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetcher } from "./use-fetcher";

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("accessToken")?.value;

    return await fetcher<UserProfile>("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);

    if (
      error instanceof Error &&
      (error.message.includes("Unauthorized") ||
        error.message.includes("Forbidden"))
    ) {
      redirect("/login");
    }

    throw error;
  }
};
