"use server";

import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

/**
 * Server-side fetch utility that handles authentication and error handling
 * @param endpoint API endpoint path
 * @param options Request options
 * @param token Optional auth token (will use cookie token if not provided)
 * @returns Parsed response data
 */
export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Get token from cookies if not provided
  if (!token) {
    token = (await cookies()).get("accessToken")?.value;
  }

  // Prepare headers with auth token if available
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  // Merge default options with provided options
  const requestOptions: RequestInit = {
    headers,
    credentials: "include",
    ...options,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);

  // Handle error responses
  if (!response.ok) {
    let errorMessage = response.statusText;

    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } catch {
      // If the response is not JSON, try to read it as text
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch {
        // If we can't read as text either, use the status text
      }
    }

    throw new ApiError(response.status, errorMessage);
  }

  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // Parse and return the response data
  try {
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return {} as T;
  }
}
