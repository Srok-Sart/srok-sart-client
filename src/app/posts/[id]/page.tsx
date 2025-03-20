import { fetcher } from "@/api/use-fetcher";
import { type Post } from "@/app/interfaces/post";
import { getAuthToken } from "@/lib/auth";
import PostDetailPage from "./post-detail";
import NavigationWrapper from "@/app/components/navigation-wrapper";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = params;
  const token = await getAuthToken();
  const post: Post = await fetcher<Post>(
    `/posts/${id}`,
    token
      ? {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      : undefined
  );

  return (
    <>
      <NavigationWrapper />
      <PostDetailPage
        post={post}
        isAuthenticated={!!token}
        token={token || undefined} 
      />
    </>
  );
};

export default Page;
