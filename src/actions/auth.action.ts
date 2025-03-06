"use server";

import { fetcher } from "@/api/use-fetcher";
import { clearAuthToken, setAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    // other user fields
  };
}

export async function loginUser(
  formData: LoginRequest
): Promise<LoginResponse> {
  try {
    const response = await fetcher<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    // Set the auth token in cookies
    setAuthToken(response.accessToken);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Login failed");
  }
}

export async function logoutUser() {
  clearAuthToken();
  redirect("/login");
}
