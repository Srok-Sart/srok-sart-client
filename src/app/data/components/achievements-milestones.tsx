"use client";

// Displays the achievements and milestones based on the environmental impact progress.
import { motion } from "framer-motion";
import { FaAward, FaLeaf, FaRecycle, FaSeedling } from "react-icons/fa";

interface AchievementsMilestonesProps {
  impactProgress: number;
}

export const AchievementsMilestones = ({ impactProgress }: AchievementsMilestonesProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md md:col-span-2">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <FaAward className="w-5 h-5 mr-2 text-amber-500" />
        Achievements & Milestones
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          className={`p-3 rounded-lg border ${
            impactProgress >= 25 ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300 opacity-60"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                impactProgress >= 25 ? "bg-green-600 text-white" : "bg-gray-400 text-gray-100"
              }`}
            >
              <FaSeedling className="w-4 h-4" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">Eco Beginner</div>
              <div className="text-xs text-gray-600">
                {impactProgress >= 25 ? "Achieved!" : `${impactProgress.toFixed(0)}% complete`}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`p-3 rounded-lg border ${
            impactProgress >= 50 ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300 opacity-60"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                impactProgress >= 50 ? "bg-green-600 text-white" : "bg-gray-400 text-gray-100"
              }`}
            >
              <FaLeaf className="w-4 h-4" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">Eco Enthusiast</div>
              <div className="text-xs text-gray-600">
                {impactProgress >= 50 ? "Achieved!" : `${Math.max(0, impactProgress - 25).toFixed(0)}% complete`}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`p-3 rounded-lg border ${
            impactProgress >= 75 ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300 opacity-60"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                impactProgress >= 75 ? "bg-green-600 text-white" : "bg-gray-400 text-gray-100"
              }`}
            >
              <FaRecycle className="w-4 h-4" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">Eco Champion</div>
              <div className="text-xs text-gray-600">
                {impactProgress >= 75 ? "Achieved!" : `${Math.max(0, impactProgress - 50).toFixed(0)}% complete`}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Overall Progress</div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full"
            animate={{ width: `${impactProgress}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Beginner</span>
          <span>Enthusiast</span>
          <span>Champion</span>
          <span>Master</span>
        </div>
      </div>
    </div>
  );
};
