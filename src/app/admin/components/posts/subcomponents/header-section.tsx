import { HiSearch } from "react-icons/hi";

interface HeaderSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setShowAddNewPost: (show: boolean) => void;
}

export const HeaderSection = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  handleSortChange,
  setShowAddNewPost
}: HeaderSectionProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Post Management</h1>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">All Posts</h2>
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
              <option value="ID Ascending">Sort by: ID Ascending</option>
              <option value="ID Descending">Sort by: ID Descending</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddNewPost(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add New Post
          </button>
        </div>
      </div>
    </div>
  );
};