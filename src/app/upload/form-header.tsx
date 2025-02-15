import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const FormHeader = () => (
  <div className="flex items-center mb-6">
    <button className="text-gray-750 font-semibold">
      <FaArrowLeft size={15} />
    </button>
    <h2 className="text-xl font-bold text-gray-900 ml-4">Upload Request</h2>
  </div>
);
export default FormHeader;
