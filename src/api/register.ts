import {
  type RegisterRequest,
  type RegisterResponse,
} from "@/app/interfaces/register";
import { fetcher } from "./use-fetcher";

export const registerUser = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  return fetcher<RegisterResponse>("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};
