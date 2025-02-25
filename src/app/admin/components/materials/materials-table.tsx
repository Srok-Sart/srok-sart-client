import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Material } from "@/app/interfaces/material";

interface MaterialsTableProps {
  materials: Material[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const MaterialsTable = ({
  materials,
  onEdit,
  onDelete,
}: MaterialsTableProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500 bg-white border border-gray-300 rounded">
        No materials available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-black text-center bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Weight Per Unit</th>
            <th className="p-2 border">Unit</th>
            <th className="p-2 border">Environmental Impact</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material, index) => {
            const uniqueKey = material.id ?? `material-${index}`;

            return (
              <tr key={uniqueKey} className="hover:bg-gray-50">
                <td className="p-2 border">{material.id}</td>
                <td className="p-2 border">{material.name || "Unnamed"}</td>
                <td className="p-2 border">{material.category || "N/A"}</td>
                <td className="p-2 border">
                  {truncateText(material.weightPerUnit ?? "", 50)}
                </td>
                <td className="p-2 border">{material.unit || "N/A"}</td>
                <td className="p-2 border">{material.environmentalImpact || "N/A"}</td>
                <td className="p-2 border">
                  <div className="flex justify-center space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => material.id && onEdit(material.id)}
                      disabled={!material.id}
                      className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 rounded-full shadow-md"
                      title="Edit Material"
                    >
                      <FaEdit className="text-lg" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => material.id && onDelete(material.id)}
                      disabled={!material.id}
                      className="bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 rounded-full shadow-md"
                      title="Delete Material"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsTable;