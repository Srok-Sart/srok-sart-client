import React from "react";

interface FormActionsProps {
  handleCancel: () => void;
  handleConfirm: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ handleCancel, handleConfirm }) => {
  return (
    <div className="flex justify-end gap-3 mt-8">
      <button
        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]"
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </div>
  );
};

export default FormActions;
