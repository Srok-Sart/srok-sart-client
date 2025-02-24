import { fetcher } from "@/api/base";
import { Post } from "../interfaces/post";

export default async function Page() {
  const posts: Post[] = await fetcher("/posts");

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
