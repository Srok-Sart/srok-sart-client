import React from "react";
import { FaTrash } from "react-icons/fa";

interface Material {
  name: string;
  quantity: number;
  unit: string;
}

interface TagsMaterialsProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  addMaterial: () => void;
  removeMaterial: (index: number) => void;
}

const TagsMaterials: React.FC<TagsMaterialsProps> = ({
  selectedTags,
  toggleTag,
  materials,
  setMaterials,
  addMaterial,
  removeMaterial,
}) => {
  const tags: string[] = ["Kids & Families", "All Age", "DIY Lover", "Trending"];

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
      {materials.map(({ name, quantity, unit }, index) => (
        <div key={index} className="flex items-center gap-3 mb-2">
          <input
            className="border p-2 w-1/5 rounded-lg bg-gray-100"
            type="text"
            value={name}
            placeholder="Material"
            onChange={(e) => {
              const updatedMaterials = [...materials];
              updatedMaterials[index].name = e.target.value;
              setMaterials(updatedMaterials);
            }}
          />
          <input
            className="border p-2 w-1/6 rounded-lg bg-gray-100"
            type="number"
            value={quantity}
            onChange={(e) => {
              const updatedMaterials = [...materials];
              updatedMaterials[index].quantity = Number(e.target.value);
              setMaterials(updatedMaterials);
            }}
          />
          <select
            className="border p-2 w-1/6 rounded-lg bg-gray-100"
            value={unit}
            onChange={(e) => {
              const updatedMaterials = [...materials];
              updatedMaterials[index].unit = e.target.value;
              setMaterials(updatedMaterials);
            }}
          >
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
