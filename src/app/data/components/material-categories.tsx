"use client";
// Displays the material categories breakdown with progress bars.
import { motion } from "framer-motion";

interface CategoryData {
  totalWeight: number;
  totalCount: number;
  totalImpact: number;
}

interface MaterialCategoriesProps {
  sortedCategories: [string, CategoryData][];
  activeMetric: "weight" | "impact" | "items";
  totalSavedWeight: number;
  totalSavedItems: number;
  totalEnvironmentalImpact: number;
}

export const MaterialCategories = ({
  sortedCategories,
  activeMetric,
  totalSavedWeight,
  totalSavedItems,
  totalEnvironmentalImpact,
}: MaterialCategoriesProps) => {
  // Add descriptions for each metric
  const metricDescriptions = {
    weight: "Shows percentage of total weight each material category contributes",
    items: "Shows percentage of total items each material category contributes",
    impact: "Shows percentage of total environmental impact each material category contributes"
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
        Material Categories
      </h2>
      
      <p className="text-xs text-gray-500 mb-4">
        {metricDescriptions[activeMetric]}
      </p>
      <div className="space-y-3">
        {sortedCategories.map(([category, data]) => (
          <div key={category} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <span className="text-xs font-semibold text-gray-700">
                {activeMetric === "weight" && `${(data.totalWeight * 1000).toFixed(0)} g`}
                {activeMetric === "items" && `${data.totalCount} items`}
                {activeMetric === "impact" && `${data.totalImpact} pts`}
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className={`h-full bg-gradient-to-r ${
                  activeMetric === "impact"
                    ? "from-green-400 to-green-600"
                    : activeMetric === "weight"
                    ? "from-emerald-400 to-emerald-600"
                    : "from-purple-400 to-purple-600"
                } rounded-full`}
                initial={{ width: 0 }}
                animate={{
                  width:
                    activeMetric === "weight"
                      ? `${(data.totalWeight / totalSavedWeight) * 100}%`
                      : activeMetric === "items"
                      ? `${(data.totalCount / totalSavedItems) * 100}%`
                      : `${(data.totalImpact / totalEnvironmentalImpact) * 100}%`,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};