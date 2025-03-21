import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Material } from "@/app/interfaces/material";

// First create a MaterialTableRow component
interface MaterialTableRowProps {
  material: Material;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  truncateText: (text: string, maxLength: number) => string;
  displayNumber?: number;
}

export const MaterialTableRow = ({
  material,
  index,
  onEdit,
  onDelete,
  truncateText,
  displayNumber
}: MaterialTableRowProps) => {
  const uniqueKey = material.id ?? `material-${index}`;
  const rowClass = index % 2 === 0 ? "" : "bg-gray-50";

  return (
    <tr key={uniqueKey} className='hover:bg-gray-50'>
      <td className='p-2 border'>{displayNumber !== undefined ? displayNumber : material.id}</td>
      <td className='p-2 border'>{material.name || "Unnamed"}</td>
      <td className='p-2 border'>{material.category || "N/A"}</td>
      <td className='p-2 border'>
        {truncateText(material.weightPerUnit ?? "", 40)}
      </td>
      <td className='p-2 border'>{material.unit || "N/A"}</td>
      <td className='p-2 border'>{material.environmentalImpact || "N/A"}</td>
      <td className='px-2 py-1.5 border'>
        <div className='flex justify-center space-x-1.5'>
          <button
            onClick={() => material.id && onEdit(material.id)}
            disabled={!material.id}
            className='bg-yellow-100 text-yellow-600 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 rounded-full shadow-sm'
            title='Edit Material'
          >
            <FaEdit />
          </button>
          <button
            onClick={() => material.id && onDelete(material.id)}
            disabled={!material.id}
            className='bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 rounded-full shadow-sm'
            title='Delete Material'
          >
            <FaTrashAlt />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Then update the MaterialsTable component
interface MaterialsTableProps {
  materials: Material[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  startIndex?: number;
}

export const MaterialsTable = ({
  materials,
  onEdit,
  onDelete,
  startIndex = 0,
}: MaterialsTableProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (!materials || materials.length === 0) {
    return (
      <div className='w-full py-3 text-center text-gray-500 bg-white border border-gray-300 rounded'>
        No materials available
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full border-collapse border border-gray-300 text-black text-center bg-white'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='p-2 border'>No.</th>
            <th className='p-2 border'>Name</th>
            <th className='p-2 border'>Category</th>
            <th className='p-2 border'>Weight Per Unit</th>
            <th className='p-2 border'>Unit</th>
            <th className='p-2 border'>Impact</th>
            <th className='p-2 border'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material, index) => (
            <MaterialTableRow
              key={material.id ?? `material-${index}`}
              material={material}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              truncateText={truncateText}
              displayNumber={startIndex + index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsTable;