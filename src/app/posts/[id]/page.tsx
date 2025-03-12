import { fetcher } from "@/api/use-fetcher";
import { type Post } from "@/app/interfaces/post";
import PostDetailPage from "@/app/posts/[id]/post-detail";
import { getAuthToken } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const token = await getAuthToken();
  const post: Post = await fetcher<Post>(`/posts/${params.id}`, token ? {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include"
  } : undefined);

  return <PostDetailPage 
    post={post} 
    isAuthenticated={!!token} 
    token={token || undefined} 
  />;
};

export default Page;