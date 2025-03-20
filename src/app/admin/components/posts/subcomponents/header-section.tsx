import React from "react";

interface HeaderSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setShowAddNewPost?: (show: boolean) => void;
  hideAddButton?: boolean;
  postStatus?: string;
  handlePostStatusChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showPostStatusFilter?: boolean;
}

export const HeaderSection = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  handleSortChange,
  setShowAddNewPost,
  hideAddButton = false,
  postStatus = "ALL",
  handlePostStatusChange,
  showPostStatusFilter = true
}: HeaderSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
      <h1 className="text-2xl font-bold">Posts Management</h1>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {/* Post Status Filter */}
          {showPostStatusFilter && handlePostStatusChange && (
            <select
              value={postStatus}
              onChange={handlePostStatusChange}
              className="
                min-w-[120px]
                px-3 py-2
                border rounded-md
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
            >
              <option value="ALL">All Posts</option>
              <option value="PUBLISH">Published</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING">Pending</option>
            </select>
          )}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ID Ascending">ID Ascending</option>
          <option value="ID Descending">ID Descending</option>
        </select>
        {!hideAddButton && setShowAddNewPost && (
          <button
            onClick={() => setShowAddNewPost(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Add New Post
          </button>
        )}
      </div>
    </div>
  );
};