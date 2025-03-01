"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuthFetch() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function authFetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (response.status === 401 || response.status === 403) {
        router.push("/login");
        return null;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.message || `Request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { authFetch, isLoading, error };
}
