import React from "react";
import { FaLeaf, FaRecycle, FaSeedling } from "react-icons/fa";

interface ProjectCardProps {
  difficulty: "easy" | "medium" | "hard";
  completedCount: number;
  totalCount: number;
}

const difficultyIcons: Record<ProjectCardProps["difficulty"], React.ElementType> = {
  easy: FaLeaf,
  medium: FaRecycle,
  hard: FaSeedling,
};

const cardColors: Record<ProjectCardProps["difficulty"], string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

const ProjectCard: React.FC<ProjectCardProps> = ({ difficulty, completedCount, totalCount }) => {
  const progress = (completedCount / totalCount) * 100;
  const DifficultyIcon = difficultyIcons[difficulty];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-3xl text-[#6437A0]">
          <DifficultyIcon />
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded-full ${cardColors[difficulty]}`}>
          <span className="capitalize">{difficulty}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 capitalize text-gray-800">{difficulty}</h3>
      <div className="mt-auto">
        <div className="text-sm font-medium mb-1 text-gray-600">
          {completedCount} / {totalCount}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-[#6437A0] h-2.5 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
