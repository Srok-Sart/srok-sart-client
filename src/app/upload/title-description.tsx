import React from "react";

interface TitleDescriptionProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({ setTitle, setDescription }) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-800 font-medium">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        className="w-full p-3 border rounded-lg bg-gray-100"
        type="text"
        placeholder="Enter title"
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-800 font-medium">Description</label>
      <textarea
        className="w-full p-3 border rounded-lg bg-gray-100"
        placeholder="Enter description"
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  </>
);

export default TitleDescription;