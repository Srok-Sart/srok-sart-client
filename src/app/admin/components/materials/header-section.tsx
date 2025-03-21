import React from "react";
import { FaPlus } from "react-icons/fa";

interface MaterialHeaderSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setShowAddNewMaterial: (show: boolean) => void;
}

export const MaterialHeaderSection = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  handleSortChange,
  setShowAddNewMaterial
}: MaterialHeaderSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
      <h1 className="text-2xl font-bold">Material Management</h1>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ID Ascending">ID Ascending</option>
          <option value="ID Descending">ID Descending</option>
        </select>
        <button
          onClick={() => setShowAddNewMaterial(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Material
        </button>
      </div>
    </div>
  );
};

export default MaterialHeaderSection;