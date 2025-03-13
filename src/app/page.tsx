"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetcher } from "@/api/use-fetcher";
import CardDisplay from "./components/card-display";
import Navigation from "./components/navigation";
import FilterBar from "./components/filtering";
import { PaginationPost } from "./interfaces/post";

const Home = () => {
  const searchParams = useSearchParams();

  // Extract search query
  const searchQuery = searchParams.get("search") || undefined;

  // Extract pagination parameters
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 9;

  // Extract filters
  const filter = searchParams.get("filter") || undefined;
  const filterParams = filter
    ?.split(",")
    .reduce<Record<string, string>>((acc, item) => {
      const [key, value] = item.split(":");
      if (key && value) acc[key] = value;
      return acc;
    }, {});

  const postType =
    filterParams?.postType || searchParams.get("postType") || undefined;
  const postStatus =
    filterParams?.postStatus || searchParams.get("postStatus") || "PUBLISH";

  // Extract sorting parameters
  const sort = searchParams.get("sort") || undefined;
  const [sortField, sortOrder] = sort?.split(":") || [];

  // Construct API query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (searchQuery) queryParams.set("search", searchQuery);
  if (postType && postStatus)
    queryParams.set("filter", `postType:${postType},postStatus:${postStatus}`);
  else if (postType) queryParams.set("filter", `postType:${postType}`);
  else if (postStatus) queryParams.set("filter", `postStatus:${postStatus}`);
  if (sortField && sortOrder)
    queryParams.set("sort", `${sortField}:${sortOrder}`);

  // State to hold posts data
  const [posts, setPosts] = useState<PaginationPost["data"]>([]);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  // Fetch posts on mount & when query changes
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, total } = await fetcher<PaginationPost>(
        `/posts?${queryParams.toString()}`
      );
      setPosts(data);
      setTotal(total);
    };
    fetchPosts();
  }, [searchParams]);

  return (
    <>
      <Navigation />
      <div className='pt-16 max-w-7xl mx-auto px-4'>
        <FilterBar />

        {/* Show "No Results Found" if there are no posts */}
        {searchQuery && posts.length === 0 && (
          <p className='text-gray-500 text-center mt-8 text-lg'>
            No results found for{" "}
            <span className='font-bold'>{searchQuery}</span>
          </p>
        )}

        {/* Display posts */}
        <div className='columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4'>
          {posts?.map((post, index) => (
            <CardDisplay key={post.id || index} post={post} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && posts.length > 0 && (
          <div className='flex justify-center gap-2 my-8'>
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNumber = i + 1;
              const newParams = new URLSearchParams(queryParams);
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
    </>
  );
};

export default Home;
