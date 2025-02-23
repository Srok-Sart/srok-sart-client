import React from "react";

interface PostDifficultyProps {
  difficulty: "EASY" | "MEDIUM" | "HARD";
  setDifficulty: React.Dispatch<React.SetStateAction<"EASY" | "MEDIUM" | "HARD">>;
}

const PostDifficulty: React.FC<PostDifficultyProps> = ({ difficulty, setDifficulty }) => {
  return (
    <div className="mb-4">
      <label htmlFor="difficulty" className="block text-gray-800 font-medium">
        Post Difficulty
      </label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
        className="p-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="EASY">EASY</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HARD">HARD</option>
      </select>
    </div>
  );
};

export default PostDifficulty;