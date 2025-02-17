"use client";

import React, { useState } from "react";
import { FaSlidersH } from "react-icons/fa";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterClick = (category: string) => {
    setSelected(category);
    onSelect(category);
  };

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-3 px-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center text-[#000000] hover:text-[#502f80] px-4 py-2 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all mr-5"
        >
          <FaSlidersH className="text-lg mr-2" /> 
        </button>
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

      {isFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative z-50 w-full max-w-md border border-gray-300 lg:max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-[#6437A0] text-left">Filter</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 font-medium mb-2 text-left">Level</p>
            <div className="space-y-2 mb-4">
              {"Easy Medium Hard".split(" ").map((level) => (
                <label key={level} className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox accent-[#6437A0]" />
                  <span>{level}</span>
                </label>
              ))}
            </div>

            <p className="text-gray-700 font-medium mb-2 text-left">Content Type</p>
            <div className="flex space-x-2 mb-4">
              {"Video Photo".split(" ").map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selected === type
                      ? "bg-[#6437A0] text-white shadow-md"
                      : "bg-gray-200 hover:bg-[#6437A0] hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <p className="text-gray-700 font-medium mb-2 text-left">Tags</p>
            <div className="flex flex-wrap gap-2">
              {"Kids & Families DIY Lover Trending".split(" ").map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full cursor-pointer transition-all bg-gray-200 hover:bg-[#6437A0] hover:text-white shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;
