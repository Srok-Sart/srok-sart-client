import { Post } from "@/app/interfaces/post";

interface MaterialsModalProps {
  post: Post | null;
  onClose: () => void;
}

export const MaterialsModal = ({ post, onClose }: MaterialsModalProps) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Materials for {post.title}</h2>
        {post.postMaterials && post.postMaterials.length > 0 ? (
          <ul className="list-disc list-inside">
            {post.postMaterials.map((material) => (
              <li key={material.id}>
                {material.material?.name || "Unknown material"} - Quantity: {material.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No materials available for this post.</p>
        )}
        <button
          onClick={onClose}
          className='mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary'
        >
          Close
        </button>
      </div>
    </div>
  );
};