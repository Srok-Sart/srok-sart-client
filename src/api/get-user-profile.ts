import { UserProfile } from "@/app/interfaces/user-profile";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetcher } from "./use-fetcher";

export const getUserProfile = async (): Promise<UserProfile> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    return await fetcher<UserProfile>("/auth/profile", {}, token);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);

    if (error instanceof ApiError && [401, 403].includes(error.statusCode)) {
      redirect("/login");
    }

    throw error;
  }
};
