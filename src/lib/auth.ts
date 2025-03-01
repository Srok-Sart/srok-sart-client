import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "accessToken";

export const getAuthToken = async () => {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
};

export const setAuthToken = async (token: string) => {
  (await cookies()).set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const clearAuthToken = async () => {
  (await cookies()).delete(AUTH_COOKIE_NAME);
};
