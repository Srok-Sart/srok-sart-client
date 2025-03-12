"use client";

// Client-side fetcher
export async function clientFetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Don't set Content-Type for FormData
  const isFormData = options.body instanceof FormData;

  const defaultOptions: RequestInit = {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    credentials: "include", // This will include cookies in the request
    cache: "no-store",
    ...options,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);

  if (response.status === 401 || response.status === 403) {
    window.location.href = "/login";
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return await response.json();
}