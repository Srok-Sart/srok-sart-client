import { fetcher } from "@/api/use-fetcher";
import DetailPage from "@/app/detail/page";
import { type Post } from "@/app/interfaces/post";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const post: Post = await fetcher<Post>(`/posts/${params.id}`);

  return <DetailPage post={post} />;
};

export default Page;
