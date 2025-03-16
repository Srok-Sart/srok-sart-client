"use client";

import { motion } from "framer-motion";
import { MaterialSummary } from "./plant-grow";
import TreeVisualization from "./tree-visualization"; // adjust the path if needed

interface TreePanelProps {
  activeTab: "weight" | "count" | "impact";
  setActiveTab: (tab: "weight" | "count" | "impact") => void;
  materialData: MaterialSummary;
  activeProgress: number;
  maxWeight: number;
  maxCount: number;
  maxPosts: number;
}

const TreePanel = ({
  activeTab,
  setActiveTab,
  materialData,
  activeProgress,
  maxWeight,
  maxCount,
  maxPosts,
}: TreePanelProps) => {
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center">
      {/* Tab Controls */}
      <div className="tabs flex mb-6 space-x-2">
        <button
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeTab === "weight" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("weight")}
        >
          Weight
        </button>
        <button
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeTab === "count" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("count")}
        >
          Items
        </button>
        <button
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeTab === "impact" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("impact")}
        >
          Impact
        </button>
      </div>

      {/* Tree Visualization */}
      <TreeVisualization activeProgress={activeProgress} />

      {/* Progress & Stats */}
      <div className="flex flex-col items-center gap-2 mb-4">
        {activeTab === "weight" && (
          <p className="text-lg font-semibold text-gray-800">
            Total Weight Saved: {materialData.totalWeight.toFixed(1)} / {maxWeight}
          </p>
        )}
        {activeTab === "count" && (
          <p className="text-lg font-semibold text-gray-800">
            Items Saved: {materialData.totalMaterialCount} / {maxCount}
          </p>
        )}
        {activeTab === "impact" && (
          <p className="text-lg font-semibold text-gray-800">
            DIYs Completed: {materialData.totalPostsCompleted} / {maxPosts}
          </p>
        )}

        <div className="w-full max-w-[250px] h-3 bg-gray-200 rounded-full mt-2">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            animate={{ width: `${activeProgress}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
        <div className="text-sm text-gray-600">Progress: {activeProgress.toFixed(1)}%</div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] text-center text-sm">
        <div className="bg-green-100 p-2 rounded">
          <div className="font-bold">{materialData.totalWeight.toFixed(1)}</div>
          <div className="text-xs text-gray-600">Materials</div>
        </div>
        <div className="bg-blue-100 p-2 rounded">
          <div className="font-bold">{materialData.totalMaterialCount}</div>
          <div className="text-xs text-gray-600">Items</div>
        </div>
        <div className="bg-purple-100 p-2 rounded">
          <div className="font-bold">{materialData.totalPostsCompleted}</div>
          <div className="text-xs text-gray-600">DIYs</div>
        </div>
      </div>
    </div>
  );
};

export default TreePanel;
