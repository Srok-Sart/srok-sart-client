import { cookies } from "next/headers";

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = (await cookies()).get("accessToken")?.value;

  console.log("Fetching", token, endpoint);

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const defaultOptions: RequestInit = {
    headers,
    credentials: "include",
    cache: "no-store",
    ...options,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);

  console.log("Response", response);

  // Check for common errors
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (response.status === 403) {
    throw new Error("Forbidden");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || response.statusText;
    throw new Error(`API error: ${errorMessage}`);
  }

  return await response.json();
}
