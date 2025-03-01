import { HiSearch } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";

interface HeaderSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setShowAddNewMaterial: (show: boolean) => void;
}

export const HeaderSection = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  handleSortChange,
  setShowAddNewMaterial
}: HeaderSectionProps) => {
  return (
    <div className="mb-6 bg-white shadow-sm p-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Material Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-md px-3 py-2"
            >
              <option value="ID Ascending">Sort by: Ascending</option>
              <option value="ID Descending">Sort by: Descending</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddNewMaterial(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary"
          >
            <FaPlus className="mr-2" />
            Add New Material
          </button>
        </div>
      </div>
    </div>
  );
};