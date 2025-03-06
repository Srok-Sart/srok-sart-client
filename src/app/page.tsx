import { fetcher } from "@/api/use-fetcher";
import CardDisplay from "./components/card-display";
import Navigation from "./components/navigation";
import SearchBar from "./components/searchbar";
import { PaginationPost } from "./interfaces/post";

interface HomeProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Home = async ({ searchParams }: HomeProps) => {
  // Parse pagination parameters
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 9;

  // Parse search query
  const search = searchParams.search as string | undefined;

  // Parse filters
  const postType = searchParams.postType as string | undefined;
  let postStatus = searchParams.postStatus as string | undefined;

  // Default to showing published posts if no status filter is set
  if (postStatus === undefined) {
    postStatus = "PUBLISH";
  }

  // Parse sorting
  const sortField = searchParams.sortField as string | undefined;
  const sortOrder = searchParams.sortOrder as string | undefined;

  // Construct query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) queryParams.set("search", search);
  if (postType) queryParams.set("postType", postType);
  if (postStatus) queryParams.set("postStatus", postStatus);
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
            <CardDisplay key={index} post={post} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className='flex justify-center gap-2 my-8'>
          {Array.from({ length: totalPages }, (_, i) => {
            const newParams = new URLSearchParams(queryParams);
            newParams.set("page", (i + 1).toString());
            return (
              <a
                key={i + 1}
                href={`/?${newParams.toString()}`}
                className={`px-4 py-2 rounded ${
                  page === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
