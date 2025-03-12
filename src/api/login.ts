"use server";

import { type LoginRequest, type LoginResponse } from "@/app/interfaces/login";
import { cookies } from "next/headers";
import { fetcher } from "./use-fetcher";

export const loginUser = async (
  userData: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetcher<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  console.log("response", response);

  // Set tokens in httpOnly cookies for security
  const cookieStore = cookies();

  (await cookieStore).set("accessToken", response.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  console.log("Cookies set");

  return response;
};
