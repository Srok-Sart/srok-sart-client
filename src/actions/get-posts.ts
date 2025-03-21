"use server";

import { fetcher } from "@/api/use-fetcher";
import { PaginationPost } from "@/app/interfaces/post";

export const getPosts = async (
  page: number = 1,
  limit: number = 9,
  search?: string,
  filter?: string,
  sort?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.set("search", search);
  if (filter) params.set("filter", filter);
  if (sort) params.set("sort", sort);

  const response = await fetcher<PaginationPost>(`/posts?${params.toString()}`);
  return response;
};
