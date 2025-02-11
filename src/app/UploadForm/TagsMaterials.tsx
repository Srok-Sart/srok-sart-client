import React from "react";
import { FaTrash } from "react-icons/fa";

interface TagsMaterialsProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  materials: { name: string; quantity: number; unit: string }[];
  addMaterial: () => void;
  removeMaterial: (index: number) => void;
}

const TagsMaterials: React.FC<TagsMaterialsProps> = ({
  selectedTags,
  toggleTag,
  materials,
  addMaterial,
  removeMaterial,
}) => {
  const tags = ["Kids & Families", "All Age", "DIY Lover", "Trending"];

  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-800 font-medium">
          Tags <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <label className="text-gray-800 font-medium">
          Required Materials <span className="text-red-500">*</span>
        </label>
        <button
          className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-full flex items-center gap-2"
          onClick={addMaterial}
        >
          Add Material +
        </button>
      </div>
      {materials.map((material, index) => (
        <div key={index} className="flex items-center gap-3 mb-2">
          <input
            className="border p-2 w-1/5 rounded-lg bg-gray-100"
            type="text"
            value={material.name}
            placeholder="Material"
          />
          <input
            className="border p-2 w-1/6 rounded-lg bg-gray-100"
            type="number"
            value={material.quantity}
          />
          <select className="border p-2 w-1/6 rounded-lg bg-gray-100">
            <option>Unit</option>
            <option>Pair</option>
          </select>
          <button className="text-red-500" onClick={() => removeMaterial(index)}>
            <FaTrash />
          </button>
        </div>
      ))}
    </>
  );
};

export default TagsMaterials;
