"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // Reset to first page when filters change
    newParams.delete("page");

    router.push(`/?${newParams.toString()}`);
  };

  return (
    <nav className='w-full bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex gap-4 items-center'>
        {/* Search Input */}
        <input
          type='text'
          placeholder='Search...'
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateParams("search", e.target.value)}
          className='px-4 py-2 border rounded'
        />

        {/* Post Type Filter */}
        <select
          value={searchParams.get("postType") || ""}
          onChange={(e) => updateParams("postType", e.target.value)}
          className='px-4 py-2 border rounded'
        >
          <option value=''>All Types</option>
          <option value='IMAGE'>Images</option>
          <option value='VIDEO'>Videos</option>
        </select>

        {/* Post Status Filter */}
        <select
          value={searchParams.get("postStatus") || "PUBLISH"}
          onChange={(e) => updateParams("postStatus", e.target.value)}
          className='px-4 py-2 border rounded'
        >
          <option value='PUBLISH'>Published</option>
          <option value='PENDING'>Pending</option>
          <option value='REJECTED'>Rejected</option>
        </select>

        {/* Sorting */}
        <select
          value={`${searchParams.get("sortField") || "createdAt"}:${
            searchParams.get("sortOrder") || "DESC"
          }`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(":");
            updateParams("sortField", field);
            updateParams("sortOrder", order);
          }}
          className='px-4 py-2 border rounded'
        >
          <option value='createdAt:DESC'>Newest First</option>
          <option value='createdAt:ASC'>Oldest First</option>
          <option value='title:ASC'>Title A-Z</option>
          <option value='title:DESC'>Title Z-A</option>
        </select>
      </div>
    </nav>
  );
};

export default SearchBar;
