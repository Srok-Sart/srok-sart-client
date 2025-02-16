import { LoginRequest, LoginResponse } from "@/interfaces/login";
import { fetcher } from "./fetcher";

export const loginUser = async (
  userData: LoginRequest
): Promise<LoginResponse> => {
  return fetcher<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};
