"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    cache: "no-store",
    ...options,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);

  if (response.status === 401 || response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return await response.json();
}