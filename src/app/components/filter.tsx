"use client";

import React, { useState } from "react";
import { FaSlidersH } from "react-icons/fa"; // Updated to match the icon in the image

interface FilterProps {
  onSelect: (category: string) => void;
}

const categories = [
  "All",
  "Trending",
  "Beginner-Friendly",
  "Advanced",
  "Home Decor",
  "Kids Crafts",
  "Seasonal",
];

const Filter: React.FC<FilterProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState("All");

  const handleFilterClick = (category: string) => {
    setSelected(category);
    onSelect(category);
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-3 px-4">
      {/* Updated Filter Icon */}
      {/* <FaSlidersH className="text-gray-600 cursor-pointer text-lg" /> */}

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleFilterClick(category)}
          className={`px-4 py-2 whitespace-nowrap transition-all relative ${
            selected === category
              ? "font-bold text-[var(--primary-color)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[var(--primary-color)]"
              : "text-gray-700 hover:text-[var(--primary-color)]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Filter;
