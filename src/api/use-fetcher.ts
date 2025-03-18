"use server";

import { ApiError } from "next/dist/server/api-utils";

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const defaultOptions: RequestInit = {
    headers,
    credentials: "include",
    cache: "no-store",
    ...options,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    const errorData = await response.json();
    errorMessage = errorData?.message || errorMessage;

    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}
