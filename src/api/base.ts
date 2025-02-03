export async function fetcher<T>(endpoint: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}${endpoint}`, { cache: "no-store" });

  return await res.json();
}
