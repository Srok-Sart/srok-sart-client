import React from "react";

// Import the enum we defined earlier
enum PostDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

interface PostDifficultyProps {
  difficulty: PostDifficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<PostDifficulty>>;
}

const PostDifficultySelector = ({
  difficulty,
  setDifficulty,
}: PostDifficultyProps) => {
  // Use ES6 object to map difficulties to display names
  const difficultyLabels = {
    [PostDifficulty.EASY]: "Easy",
    [PostDifficulty.MEDIUM]: "Medium",
    [PostDifficulty.HARD]: "Hard",
  };

  // Use ES6 Object.entries to create options
  const difficultyOptions = Object.entries(difficultyLabels).map(
    ([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    )
  );

  // Use arrow function for handler
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value as PostDifficulty);
  };

  return (
    <div className='mb-4'>
      <label
        htmlFor='difficulty'
        className='block text-gray-800 font-medium mb-2'
      >
        Difficulty Level
      </label>
      <select
        id='difficulty'
        value={difficulty}
        onChange={handleChange}
        className='p-3 block w-full border border-gray-300 rounded-md shadow-sm'
      >
        {difficultyOptions}
      </select>
      <p className='mt-1 text-sm text-gray-500'>
        {difficulty === PostDifficulty.EASY && "Perfect for beginners"}
        {difficulty === PostDifficulty.MEDIUM && "Some experience required"}
        {difficulty === PostDifficulty.HARD && "Advanced techniques needed"}
      </p>
    </div>
  );
};

export default PostDifficultySelector;