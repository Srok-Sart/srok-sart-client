import { fetcher } from "@/api/use-fetcher";
import CardDisplay from "./components/card-display";
import Navigation from "./components/navigation";
import SearchBar from "./components/searchbar";
import { PaginationPost } from "./interfaces/post";

interface HomeProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const Home = async ({ searchParams }: HomeProps) => {
  // Await the searchParams
  const resolvedParams = await searchParams;

  // Parse pagination parameters
  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 9;

  // Parse search query
  const search =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;

  // Parse filters
  const filter =
    typeof resolvedParams.filter === "string"
      ? resolvedParams.filter
      : undefined;
  const filterParams = filter
    ?.split(",")
    .reduce<Record<string, string>>((acc, item) => {
      const [key, value] = item.split(":");
      if (key && value) acc[key] = value;
      return acc;
    }, {});

  const postType =
    filterParams?.postType ||
    (typeof resolvedParams.postType === "string"
      ? resolvedParams.postType
      : undefined);
  const postStatus =
    filterParams?.postStatus ||
    (typeof resolvedParams.postStatus === "string"
      ? resolvedParams.postStatus
      : undefined) ||
    "PUBLISH";

  // Parse sorting
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const [sortField, sortOrder] = sort?.split(":") || [];

  // Construct query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) queryParams.set("search", search);

  // Handle filter parameter format from the screenshot
  if (postType && postStatus) {
    queryParams.set("filter", `postType:${postType},postStatus:${postStatus}`);
  } else if (postType) {
    queryParams.set("filter", `postType:${postType}`);
  } else if (postStatus) {
    queryParams.set("filter", `postStatus:${postStatus}`);
  }

  if (sortField && sortOrder) {
    queryParams.set("sort", `${sortField}:${sortOrder}`);
  }

  // Fetch data with all query parameters
  const { data: posts, total }: PaginationPost = await fetcher<PaginationPost>(
    `/posts?${queryParams.toString()}`
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navigation />
      <div className='pt-16 max-w-7xl mx-auto px-4'>
        <SearchBar />

        <div className='columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4'>
          {posts?.map((post, index) => (
            <CardDisplay key={post.id || index} post={post} />
          ))}
        </div>

        {/* Pagination Controls */}
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
      </div>
    </>
  );
};

export default Home;
