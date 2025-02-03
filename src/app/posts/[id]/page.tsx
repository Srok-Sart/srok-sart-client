import { fetcher } from "@/api/base";
import { Post } from "@/interfaces/post";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const post: Post = await fetcher(`/posts/${params.id}`);

  return <div>{post.title}</div>;
};

export default Page;
