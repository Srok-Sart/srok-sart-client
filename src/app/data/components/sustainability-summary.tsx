"use client";
// Displays the key stats summary of your sustainability progress.
import { FaAward, FaBox, FaRecycle } from "react-icons/fa";

interface SustainabilitySummaryProps {
  totalSavedWeight: number;
  totalSavedItems: number;
  totalPostsCompleted: number;
}

export const SustainabilitySummary = ({
  totalSavedWeight,
  totalSavedItems,
  totalPostsCompleted,
}: SustainabilitySummaryProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md md:col-span-2">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <FaAward className="w-5 h-5 mr-2 text-amber-500" />
        Your Sustainability Summary
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200 flex flex-col items-center">
          <FaBox className="w-5 h-5 text-green-700 mb-1" />
          <div className="font-bold text-green-700 text-lg">{(totalSavedWeight * 1000).toFixed(0)}</div>
          <div className="text-xs text-gray-600">G Saved</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200 flex flex-col items-center">
          <FaRecycle className="w-5 h-5 text-purple-700 mb-1" />
          <div className="font-bold text-purple-700 text-lg">{totalSavedItems}</div>
          <div className="text-xs text-gray-600">Items Saved</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm border border-amber-200 flex flex-col items-center">
          <FaAward className="w-5 h-5 text-amber-700 mb-1" />
          <div className="font-bold text-amber-700 text-lg">{totalPostsCompleted}</div>
          <div className="text-xs text-gray-600">DIY Projects</div>
        </div>
      </div>
    </div>
  );
};