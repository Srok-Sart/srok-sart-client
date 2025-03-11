import { fetcher } from "@/api/use-fetcher";
import { type Post } from "@/app/interfaces/post";
import PostDetailPage from "@/app/posts/[id]/post-detail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  const post: Post = await fetcher<Post>(`/posts/${postId}`);

  console.log(post);

  return <PostDetailPage post={post} />;
};

export default Page;
