"use client";
// TopMaterials.tsx
// Displays the top materials saved based on the active metric.
import { motion } from "framer-motion";

interface MaterialBreakdownItem {
  id: number;
  name: string;
  standardAmount: number;
  savedCount: number;
  totalEnvironmentalImpact: number;
}

interface TopMaterialsProps {
  topMaterials: MaterialBreakdownItem[];
  activeMetric: "weight" | "volume" | "impact" | "items";
  activeMetricData: { progress: number; color: string };
  totalSavedWeight: number;
  totalSavedVolume: number;
  totalSavedItems: number;
  totalEnvironmentalImpact: number;
}

export const TopMaterials = ({
  topMaterials,
  activeMetric,
  activeMetricData,
  totalSavedWeight,
  totalSavedVolume,
  totalSavedItems,
  totalEnvironmentalImpact,
}: TopMaterialsProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
        Top Materials Saved
      </h2>
      <div className="space-y-3">
        {topMaterials.length > 0 ? (
          topMaterials.map((material) => (
            <div key={material.id} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-24 truncate">{material.name}</span>
              <div className="flex-1 mx-3">
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${activeMetricData.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        activeMetric === "weight"
                          ? `${(material.standardAmount / totalSavedWeight) * 100}%`
                          : activeMetric === "volume"
                          ? `${(material.standardAmount / totalSavedVolume) * 100}%`
                          : activeMetric === "items"
                          ? `${(material.savedCount / totalSavedItems) * 100}%`
                          : `${(material.totalEnvironmentalImpact / totalEnvironmentalImpact) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-700 w-16 text-right">
                {activeMetric === "weight" && `${material.standardAmount.toFixed(1)} kg`}
                {activeMetric === "volume" && `${material.standardAmount.toFixed(1)} L`}
                {activeMetric === "items" && `${material.savedCount} items`}
                {activeMetric === "impact" && `${material.totalEnvironmentalImpact} pts`}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">No materials available for the selected category</div>
        )}
      </div>
    </div>
  );
};
