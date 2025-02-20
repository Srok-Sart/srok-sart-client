import React from 'react';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';

interface PostFormFieldsProps {
  title: string;
  description: string;
  postDifficulty: PostDifficulty | string;
  postType: PostType | string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDifficultyChange: (value: PostDifficulty) => void;
  onTypeChange: (value: PostType) => void;
}

export const PostFormFields = ({
  title,
  description,
  postDifficulty,
  postType,
  onTitleChange,
  onDescriptionChange,
  onDifficultyChange,
  onTypeChange,
}: PostFormFieldsProps) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-700">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Description</label>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Difficulty Level</label>
      <select
        value={postDifficulty}
        onChange={(e) => onDifficultyChange(e.target.value as PostDifficulty)}
        className="w-full px-3 py-2 border rounded-md"
        required
      >
        <option value="">Select Difficulty Level</option>
        {Object.values(PostDifficulty).map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Type</label>
      <select
        value={postType}
        onChange={(e) => onTypeChange(e.target.value as PostType)}
        className="w-full px-3 py-2 border rounded-md"
        required
      >
        <option value="">Select Type</option>
        {Object.values(PostType).map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  </>
);