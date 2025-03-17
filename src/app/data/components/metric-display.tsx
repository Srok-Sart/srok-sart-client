"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaInfoCircle, FaLeaf, FaBox, FaRecycle } from "react-icons/fa";

// Displays the current metric (Weight, Impact, or Items) with a progress bar and metric selector buttons.
interface MetricData {
  value: string;
  max: number;
  unit: string;
  progress: number;
  icon: React.ReactElement;
  color: string;
}

interface MetricDisplayProps {
  activeMetricData: MetricData;
  activeMetric: "weight" | "impact" | "items";
  setActiveMetric: (metric: "weight" | "impact" | "items") => void;
}

export const MetricDisplay = ({
  activeMetricData,
  activeMetric,
  setActiveMetric,
}: MetricDisplayProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md w-full max-w-[280px] mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {activeMetricData.icon}
          <span className="ml-2 font-semibold text-gray-800">
            {activeMetric === "weight" && "Weight Saved"}
            {activeMetric === "items" && "Items Saved"}
            {activeMetric === "impact" && "Environmental Impact"}
          </span>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600"
          title={
            activeMetric === "weight"
              ? "Total weight of materials saved through your DIY projects"
              : activeMetric === "items"
              ? "Total number of items saved through your DIY projects"
              : "Environmental impact score based on your material savings"
          }
        >
          <FaInfoCircle className="w-4 h-4" />
        </button>
      </div>
      <div className="text-2xl font-bold text-green-700 mb-2">
        {activeMetricData.value}{" "}
        <span className="text-sm font-normal text-gray-600">
          {activeMetricData.unit}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${activeMetricData.color} rounded-full`}
          animate={{ width: `${activeMetricData.progress}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0 {activeMetricData.unit}</span>
        <span>
          Goal: {activeMetricData.max} {activeMetricData.unit}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] mt-4">
        <button
          onClick={() => setActiveMetric("impact")}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeMetric === "impact"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-green-100"
          }`}
        >
          <FaLeaf className="w-4 h-4" />
          <span className="text-sm">Impact</span>
        </button>
        <button
          onClick={() => setActiveMetric("weight")}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeMetric === "weight"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-emerald-100"
          }`}
        >
          <FaBox className="w-4 h-4" />
          <span className="text-sm">Weight</span>
        </button>
        <button
          onClick={() => setActiveMetric("items")}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeMetric === "items"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-purple-100"
          }`}
        >
          <FaRecycle className="w-4 h-4" />
          <span className="text-sm">Items</span>
        </button>
      </div>
    </div>
  );
};