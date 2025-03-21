"use client";

import { fetcher } from "@/api/use-fetcher";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CardDisplay from "../components/card-display";
import FilterBar from "../components/filtering";
import { PaginationPost } from "../interfaces/post";

const HomeContent = () => {
  const searchParams = useSearchParams();

  // Extract search query
  const searchQuery = searchParams.get("search") || undefined;

  // Extract filters
  const postType = searchParams.get("postType") || undefined;
  const postStatus = searchParams.get("postStatus") || "PUBLISH";

  // Extract sorting parameters
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "DESC";

  // State to hold posts data
  const [posts, setPosts] = useState<PaginationPost["data"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 9; // Fixed limit per page

  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Construct API query parameters
  const getQueryParams = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
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
    },
    [searchQuery, postType, postStatus, sortField, sortOrder]
  );

  // Fetch posts function
  const fetchPosts = useCallback(
    async (currentPage: number, append = false) => {
      setIsLoading(true);
      try {
        const queryParams = getQueryParams(currentPage);
        const { data, total } = await fetcher<PaginationPost>(
          `/posts?${queryParams.toString()}`
        );

        if (append) {
          setPosts((prevPosts) => [...prevPosts, ...data]);
        } else {
          setPosts(data);
        }

        // Check if we've reached the end
        setHasMore(currentPage * limit < total);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [getQueryParams]
  );

  // Initial load
  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, postType, postStatus, sortField, sortOrder]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Don't set up observer if we're currently loading or there are no more items
    if (isLoading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    // Observe loading element if it exists
    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchPosts, hasMore, isLoading, page]);

  // Handle filter changes
  const handleFilterChange = useCallback(() => {
    // Reset pagination when filters change
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1, false);
  }, [fetchPosts]);

  return (
    <div className='pt-16 max-w-7xl mx-auto px-4'>
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Display posts */}
      <div className='columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4 mt-4'>
        {posts?.map((post, index) => (
          <CardDisplay key={post.id || index} post={post} />
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className='flex justify-center my-8'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && !isLoading && (
        <div ref={loadingRef} className='h-10 w-full'></div>
      )}

      {/* Show message when there are no more posts */}
      {!hasMore && posts.length > 0 && (
        <p className='text-gray-500 text-center my-8'>No more posts to load</p>
      )}

      {/* Show "No Results Found" if there are no posts */}
      {!isLoading && posts.length === 0 && !hasMore && (
        <p className='text-gray-500 text-center mt-8 text-lg'>
          {searchQuery
            ? `No results found for "${searchQuery}"`
            : "No posts available"}
        </p>
      )}
    </div>
  );
};

export default HomeContent;
