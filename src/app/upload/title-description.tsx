import React from "react";

const TitleDescription = () => (
  <>
    <div className="mb-4">
      <label className="block text-gray-800 font-medium">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        className="w-full p-3 border rounded-lg bg-gray-100"
        type="text"
        placeholder="Enter title"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-800 font-medium">Description</label>
      <textarea
        className="w-full p-3 border rounded-lg bg-gray-100"
        placeholder="Enter description"
      />
    </div>
  </>
);

export default TitleDescription;
