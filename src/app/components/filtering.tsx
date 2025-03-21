"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

interface FilterBarProps {
  onFilterChange?: () => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract filter values as memoized values to use in dependency arrays
  const postType = useMemo(() => searchParams.get("postType"), [searchParams]);
  const postStatus = useMemo(
    () => searchParams.get("postStatus"),
    [searchParams]
  );
  const sortField = useMemo(
    () => searchParams.get("sortField"),
    [searchParams]
  );
  const sortOrder = useMemo(
    () => searchParams.get("sortOrder"),
    [searchParams]
  );

  // Update URL params and maintain state
  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }

      // Reset to first page when filters change
      newParams.delete("page");

      // Use { scroll: false } to prevent page jumping when updating URL
      router.push(`/?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handle sorting change with combined field and order
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [field, order] = e.target.value.split(":");
      const newParams = new URLSearchParams(searchParams.toString());

      newParams.set("sortField", field);
      newParams.set("sortOrder", order);
      newParams.delete("page");

      router.push(`/?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Get current sort value for select
  const currentSortValue = `${sortField || "createdAt"}:${sortOrder || "DESC"}`;

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange?.();
  }, [postType, postStatus, sortField, sortOrder, onFilterChange]);

  const selectClassName = `
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
  `;

  return (
    <div>
      <div
        className='
        max-w-7xl mx-auto px-4 flex flex-nowrap items-center gap-4
        overflow-x-auto whitespace-nowrap
        md:flex-wrap md:overflow-visible md:whitespace-normal md:justify-start
      '
      >
        {/* Post Type Filter */}
        <select
          value={postType || ""}
          onChange={(e) => updateParams("postType", e.target.value || null)}
          className={selectClassName}
          aria-label='Filter by post type'
        >
          <option value=''>All Types</option>
          <option value='IMAGE'>Images</option>
          <option value='VIDEO'>Videos</option>
        </select>

        {/* Sorting Filter */}
        <select
          value={currentSortValue}
          onChange={handleSortChange}
          className={selectClassName}
          aria-label='Sort posts'
        >
          <option value='createdAt:DESC'>Newest First</option>
          <option value='createdAt:ASC'>Oldest First</option>
          <option value='title:ASC'>Title A–Z</option>
          <option value='title:DESC'>Title Z–A</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
