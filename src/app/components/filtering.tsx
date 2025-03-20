"use client";

import { useRouter, useSearchParams } from "next/navigation";

const FilterBar = () => {
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
    <div>
      <div
        className="
          max-w-7xl mx-auto px-4 flex flex-nowrap items-center gap-4
          overflow-x-auto whitespace-nowrap
          md:flex-wrap md:overflow-visible md:whitespace-normal md:justify-start
        "
      >
        {/* Post Type Filter */}
        <select
          value={searchParams.get("postType") || ""}
          onChange={(e) => updateParams("postType", e.target.value)}
          className="
            min-w-[120px]
            px-4 py-2
            text-base
            bg-white
            border-2 border-gray-200
            rounded-full
            hover:shadow-sm
            focus:outline-none
            focus:ring-2 focus:ring-[var(--primary-color)]
            focus:border-[var(--primary-color)]
            transition-all
          "
        >
          <option value="">All Types</option>
          <option value="IMAGE">Images</option>
          <option value="VIDEO">Videos</option>
        </select>

        {/* Post Status Filter */}
        {/* <select
          value={searchParams.get("postStatus") || "PUBLISH"}
          onChange={(e) => updateParams("postStatus", e.target.value)}
          className="
            min-w-[120px]
            px-4 py-2
            text-base
            bg-white
            border-2 border-gray-200
            rounded-full
            hover:shadow-sm
            focus:outline-none
            focus:ring-2 focus:ring-[var(--primary-color)]
            focus:border-[var(--primary-color)]
            transition-all
          "
        >
          <option value="PUBLISH">Published</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select> */}

        {/* Sorting Filter */}
        <select
        value={`${searchParams.get("sortField") || "createdAt"}:${searchParams.get("sortOrder") || "DESC"}`}
        onChange={(e) => {
          const newParams = new URLSearchParams(searchParams.toString());
          const [field, order] = e.target.value.split(":");
          newParams.set("sortField", field);
          newParams.set("sortOrder", order);
          // Reset to first page when filters change
          newParams.delete("page");
          router.push(`/?${newParams.toString()}`);
        }}
        className="
          min-w-[120px]
          px-4 py-2
          text-base
          bg-white
          border-2 border-gray-200
          rounded-full
          hover:shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-[var(--primary-color)]
          focus:border-[var(--primary-color)]
          transition-all
        "
      >
        <option value="createdAt:DESC">Newest First</option>
        <option value="createdAt:ASC">Oldest First</option>
        <option value="title:ASC">Title A–Z</option>
        <option value="title:DESC">Title Z–A</option>
      </select>

      </div>
    </div>
  );
};

export default FilterBar;
