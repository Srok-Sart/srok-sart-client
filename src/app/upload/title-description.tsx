import React from "react";

interface TitleDescriptionProps {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  error?: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  description,
  setTitle,
  setDescription,
  error,
}) => {
  return (
    <div className='mb-6'>
      <div className='mb-4'>
        <label className='block text-gray-700 font-semibold mb-2'>
          Title <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          className={`w-full p-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter a title for your post'
          required
        />
        {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
      </div>
      <div>
        <label className='block text-gray-700 font-semibold mb-2'>
          Description
        </label>
        <textarea
          className='w-full p-2 border border-gray-300 rounded h-32'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Describe your post (optional)'
        />
      </div>
    </div>
  );
};

export default TitleDescription;
