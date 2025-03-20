"use client";

import { fetcher } from "@/api/use-fetcher";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CardDisplay from "../components/card-display";
import FilterBar from "../components/filtering";
import { PaginationPost } from "../interfaces/post";

const HomeContent = () => {
  const searchParams = useSearchParams();

  // Extract search query
  const searchQuery = searchParams.get("search") || undefined;

  // Extract pagination parameters
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 9;

  // Extract filters
  const postType = searchParams.get("postType") || undefined;
  const postStatus = searchParams.get("postStatus") || "PUBLISH";

  // Extract sorting parameters
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "DESC";

  // Construct API query parameters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchQuery) params.set("search", searchQuery);

    // Build filter string
    let filterString = "";
    if (postType) filterString += `postType:${postType}`;
    if (postStatus) {
      if (filterString) filterString += ",";
      filterString += `postStatus:${postStatus}`;
    }

    if (filterString) params.set("filter", filterString);

    // Format sort parameter in the way backend expects
    params.set("sort", `${sortField}:${sortOrder}`);

    return params;
  }, [page, limit, searchQuery, postType, postStatus, sortField, sortOrder]);

  // State to hold posts data
  const [posts, setPosts] = useState<PaginationPost["data"]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = Math.ceil(total / limit);

  // Fetch posts on mount & when query changes
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, total } = await fetcher<PaginationPost>(
          `/posts?${queryParams.toString()}`
        );
        setPosts(data);
        setTotal(total);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [queryParams, searchParams]);

  return (
    <div className='pt-16 max-w-7xl mx-auto px-4'>
      <FilterBar />

      {/* Loading indicator */}
      {isLoading && (
        <div className='flex justify-center my-8'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
        </div>
      )}

      {/* Show "No Results Found" if there are no posts */}
      {!isLoading && posts.length === 0 && (
        <p className='text-gray-500 text-center mt-8 text-lg'>
          {searchQuery
            ? `No results found for "${searchQuery}"`
            : "No posts available"}
        </p>
      )}

      {/* Display posts */}
      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4'>
        {posts?.map((post, index) => (
          <CardDisplay key={post.id || index} post={post} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && posts.length > 0 && (
        <div className='flex justify-center gap-2 my-8'>
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", pageNumber.toString());

            return (
              <a
                key={pageNumber}
                href={`/?${newParams.toString()}`}
                className={`px-4 py-2 rounded ${
                  page === pageNumber
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomeContent;