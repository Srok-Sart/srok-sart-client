import { clientFetcher } from "@/api/client-fetcher";
import DetailPage from "@/app/detail/page";
import { type Post } from "@/app/interfaces/post";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const post: Post = await clientFetcher(`/posts/${params.id}`);

  return <DetailPage post={post} />;
};

export default Page;
