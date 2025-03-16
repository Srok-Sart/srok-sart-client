import { Post } from "@/app/interfaces/post";
import { FaCheck, FaEdit, FaEye, FaTimes, FaTrashAlt } from "react-icons/fa";

interface PostTableRowProps {
  post: Post;
  index: number;
  isPostsRequestTab: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onApproveOrReject?: (id: number, status: "PUBLISH" | "REJECTED") => void;
  onViewMaterials: (post: Post) => void;
  truncateText: (text: string, maxLength: number) => string;
  truncateMaterials: (materials: string[], maxLength: number) => string;
}

export const PostTableRow = ({
  post,
  index,
  isPostsRequestTab,
  onView,
  onEdit,
  onDelete,
  onApproveOrReject,
  onViewMaterials,
  truncateText,
  truncateMaterials
}: PostTableRowProps) => {
  const uniqueKey = post.id ?? `post-${index}`;
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
            onClick={() => onViewMaterials(post)}
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
};