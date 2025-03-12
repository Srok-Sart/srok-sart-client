import { fetcher } from "@/api/use-fetcher";
import DetailPage from "@/app/detail/page";
import { type Post } from "@/app/interfaces/post";
import { getAuthToken } from "@/lib/auth";

interface PageProps {
  params: {
    id: string;
  };
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

  return <DetailPage 
    post={post} 
    isAuthenticated={!!token} 
    token={token || undefined} 
  />;
};

export default Page;