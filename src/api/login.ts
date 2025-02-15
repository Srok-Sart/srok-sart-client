import { type LoginRequest, type LoginResponse } from "@/interfaces/login";
import { fetcher } from "./base";

export const loginUser = async (
  userData: LoginRequest
): Promise<LoginResponse> => {
  return fetcher<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};
