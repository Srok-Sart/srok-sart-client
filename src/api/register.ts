import {
  type RegisterRequest,
  type RegisterResponse,
} from "@/interfaces/register";
import { fetcher } from "./fetcher";

export const registerUser = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  return fetcher<RegisterResponse>("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};
