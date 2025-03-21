import { Post } from "@/app/interfaces/post";
import { useState } from "react";
import { PostTableRow } from "./post-table-row";
import { MaterialsModal } from "./materials-modal";

interface PostsTableProps {
  posts: Post[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onApproveOrReject?: (id: number, status: "PUBLISH" | "REJECTED") => void;
  isPostsRequestTab?: boolean;
  startIndex?: number;
}

export const PostsTable = ({
  posts,
  onEdit,
  onDelete,
  onView,
  onApproveOrReject,
  isPostsRequestTab = false,
  startIndex = 0,
}: PostsTableProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const truncateMaterials = (materials: string[], maxLength: number) => {
    if (!materials || materials.length === 0) return "No materials";
    if (materials.length <= maxLength) return materials.join(", ");
    return `${materials.slice(0, maxLength).join(", ")}...`;
  };

  const handleViewMaterials = (post: Post) => {
    setSelectedPost(post);
  };

  if (!posts || posts.length === 0) {
    return (
      <div className='w-full p-4 text-center text-gray-500 bg-white border border-gray-300 rounded'>
        No posts available
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full border-collapse border border-gray-300 text-black text-center bg-white'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='p-2 border'>No.</th>
            <th className='p-2 border'>Title</th>
            <th className='p-2 border'>Description</th>
            <th className='p-2 border'>Difficulty Level</th>
            <th className='p-2 border'>Type</th>
            <th className='p-2 border'>Estimated Time</th>
            <th className='p-2 border'>Materials</th>
            <th className='p-2 border'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <PostTableRow
              key={post.id ?? `post-${index}`}
              post={post}
              index={index}
              isPostsRequestTab={isPostsRequestTab}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onApproveOrReject={onApproveOrReject}
              onViewMaterials={handleViewMaterials}
              truncateText={truncateText}
              truncateMaterials={truncateMaterials}
              displayNumber={startIndex + index + 1}
            />
          ))}
        </tbody>
      </table>
      <MaterialsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
};

export default PostsTable;