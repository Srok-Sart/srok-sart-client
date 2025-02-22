import { fetcher } from "@/api/base";
import CardDisplay from "./components/card-display";
import Navigation from "./components/navigation";
import { Post } from "./interfaces/post";

const Home = async () => {
  // const [selectedCategory, setSelectedCategory] = useState("All");

  const posts: Post[] = await fetcher("/posts");

  // Filtered images based on selected category
  // const filteredImages =
  //   selectedCategory === "All"
  //     ? images
  //     : images.filter((img) => img.category === selectedCategory);

  return (
    <>
      <Navigation />

      <div className='pt-16 max-w-7xl mx-auto px-4'>
        {/* Filter Section with Icon */}
        {/* <div className='flex items-center gap-2 '>
          <Filter onSelect={setSelectedCategory} />
        </div> */}

        {/* Masonry Grid Layout */}
        <div className='columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4'>
          {posts.map((post, index) => (
            <CardDisplay key={index} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
