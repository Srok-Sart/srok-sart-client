import { fetcher } from "@/api/base";
import { Post } from "../../interfaces/post";
import DetailPage from "@/app/detail/page";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const post: Post = await fetcher(`/posts/${params.id}`);

  return <DetailPage post={post} />;
};

export default Page;
