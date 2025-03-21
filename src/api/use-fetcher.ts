"use server";

import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  token = (await cookies()).get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const defaultOptions: RequestInit = {
    headers,
    credentials: "include",
    ...options,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);
  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  console.log("vanetah", response);

  if (!response.ok) {
    let errorMessage = response.statusText;

    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } catch (error) {
      // If the response is not JSON, read it as text
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
    throw new ApiError(response.status, errorMessage);
  }

  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  try {
    const data = await response.json();
    return data as T;
  } catch (error) {
    // If the response is not JSON, return an empty object or handle accordingly
    console.error("Failed to parse JSON response:", error);
    return {} as T;
  }

  // return response.json() as Promise<T>;;
}
