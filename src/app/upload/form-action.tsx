import React from "react";

interface FormActionsProps {
  handleCancel: () => void;
  handleConfirm: () => void;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  handleCancel,
  handleConfirm,
  isSubmitting,
}) => {
  return (
    <div className='flex justify-end gap-3 mt-8'>
      <button
        type='button'
        className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors'
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type='button'
        className='px-4 py-2 rounded-md bg-primary text-white hover:bg-primary transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none'
        onClick={handleConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className='flex items-center'>
            <svg
              className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};

export default FormActions;
