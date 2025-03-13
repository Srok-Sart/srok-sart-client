import { Post } from "@/app/interfaces/post";
import { useState } from "react";
import { FaCheck, FaEdit, FaEye, FaTimes, FaTrashAlt } from "react-icons/fa";

interface PostsTableProps {
  posts: Post[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onApproveOrReject?: (id: number, status: "PUBLISH" | "REJECTED") => void;
  isPostsRequestTab?: boolean;
}

export const PostsTable = ({
  posts,
  onEdit,
  onDelete,
  onView,
  onApproveOrReject,
  isPostsRequestTab = false,
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
            <th className='p-2 border'>ID</th>
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
          {posts.map((post, index) => {
            const uniqueKey = post.id ?? `post-${index}`;
            // Use post.postMaterials now instead of post.materials
            const materials = post.postMaterials || [];

            return (
              <tr key={uniqueKey} className='hover:bg-gray-50'>
                <td className='p-2 border'>{post.id}</td>
                <td className='p-2 border'>{post.title || "Untitled"}</td>
                <td className='p-2 border'>
                  {truncateText(post.description ?? "", 50)}
                </td>
                <td className='p-2 border'>{post.postDifficulty || "N/A"}</td>
                <td className='p-2 border'>{post.postType || "N/A"}</td>
                <td className='p-2 border'>{post.estimatedTime || "N/A"}</td>
                <td className='p-2 border'>
                  {materials.length > 0 ? (
                    <span
                      className="cursor-pointer text-primary"
                      onClick={() => handleViewMaterials(post)}
                    >
                      {truncateMaterials(
                        materials.map((material) => material.material?.name || "Unknown"),
                        3
                      )}
                    </span>
                  ) : (
                    "No materials"
                  )}
                </td>
                <td className='p-2 border'>
                  <div className='flex justify-center space-x-2'>
                    <button
                      onClick={() => post.id && onView(post.id)}
                      disabled={!post.id}
                      className='bg-blue-100 text-primary hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 rounded-full shadow-md'
                      title='View Post'
                    >
                      <FaEye className='text-lg' />
                    </button>
                    {!isPostsRequestTab && (
                      <>
                        <button
                          onClick={() => post.id && onEdit(post.id)}
                          disabled={!post.id}
                          className='bg-yellow-100 text-yellow-600 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 rounded-full shadow-md'
                          title='Edit Post'
                        >
                          <FaEdit className='text-lg' />
                        </button>
                        <button
                          onClick={() => post.id && onDelete(post.id)}
                          disabled={!post.id}
                          className='bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 rounded-full shadow-md'
                          title='Delete Post'
                        >
                          <FaTrashAlt className='text-lg' />
                        </button>
                      </>
                    )}
                    {isPostsRequestTab && post.postStatus === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            post.id && onApproveOrReject?.(post.id, "PUBLISH")
                          }
                          className='bg-green-100 text-green-600 hover:bg-green-200 transition-colors p-2 rounded-full shadow-md'
                          title='Approve Post'
                        >
                          <FaCheck className='text-lg' />
                        </button>
                        <button
                          onClick={() =>
                            post.id && onApproveOrReject?.(post.id, "REJECTED")
                          }
                          className='bg-red-100 text-red-600 hover:bg-red-200 transition-colors p-2 rounded-full shadow-md'
                          title='Reject Post'
                        >
                          <FaTimes className='text-lg' />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md w-1/2">
            <h2 className="text-2xl font-bold mb-4">Materials for {selectedPost.title}</h2>
            {selectedPost.postMaterials && selectedPost.postMaterials.length > 0 ? (
              <ul className="list-disc list-inside">
                {selectedPost.postMaterials.map((material) => (
                  <li key={material.id}>
                    {material.material?.name || "Unknown material"} - Quantity: {material.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No materials available for this post.</p>
            )}
            <button
              onClick={() => setSelectedPost(null)}
              className='mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsTable;
