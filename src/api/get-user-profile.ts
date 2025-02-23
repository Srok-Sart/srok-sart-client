import { UserProfile } from "@/app/interfaces/user-profile";
import { fetcher } from "./base";

export const getUserProfile = async (): Promise<UserProfile> => {
  return fetcher<UserProfile>("/auth/profile");
};
