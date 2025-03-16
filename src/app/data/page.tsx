"use client";

import Navigation from "../components/navigation"; 
import { PlantGrow } from "./components/plant-grow";
import ProjectCard from "./components/project-card";

const projects: { difficulty: "easy" | "medium" | "hard"; completedCount: number; totalCount: number }[] = [
  { difficulty: "easy", completedCount: 3, totalCount: 5 },
  { difficulty: "medium", completedCount: 2, totalCount: 4 },
  { difficulty: "hard", completedCount: 1, totalCount: 3 },
];

const Page = () => {
  return (
    <>
      <Navigation /> 
      <div className="container mx-auto px-10 lg:px-24 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">My Eco Projects</h1>
        <PlantGrow />

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Project Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.difficulty} {...project} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
