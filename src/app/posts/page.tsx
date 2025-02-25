import { clientFetcher } from "@/api/client-fetcher";
import { Post } from "../interfaces/post";

export default async function Page() {
  const posts: Post[] = await clientFetcher("/posts");

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {post.title} {post.postType}
        </li>
      ))}
    </ul>
  );
}
