// api/use-profile-client.ts
import { UserProfile } from "@/app/interfaces/user-profile";
import { fetcher } from "./use-fetcher";

export const getUserProfileClient = async (): Promise<UserProfile> => {
  try {
    return await fetcher<UserProfile>("/auth/profile", {});
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};