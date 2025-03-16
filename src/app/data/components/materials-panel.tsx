"use client";

import { motion } from "framer-motion";
import { MaterialSummary, MaterialUnit, formatUnitDisplay } from "./plant-grow";

// ─── MATERIALS PANEL COMPONENT ─────────────────────────────
// Renders the list of top materials with filter buttons and shows a category breakdown.
interface MaterialsPanelProps {
  activeTab: "weight" | "count" | "impact";
  materialData: MaterialSummary;
  activeUnitFilter: "all" | "weight" | "volume" | "count";
  setActiveUnitFilter: (filter: "all" | "weight" | "volume" | "count") => void;
}

const MaterialsPanel = ({
  activeTab,
  materialData,
  activeUnitFilter,
  setActiveUnitFilter,
}: MaterialsPanelProps) => {
  // Filter and sort top materials
  const filteredAndSortedMaterials = [...materialData.materialBreakdown]
    .filter(material => {
      if (activeUnitFilter === "all") return true;
      if (activeUnitFilter === "weight") return [MaterialUnit.KG, MaterialUnit.G].includes(material.unit);
      if (activeUnitFilter === "volume") return [MaterialUnit.L, MaterialUnit.ML].includes(material.unit);
      if (activeUnitFilter === "count")
        return ![MaterialUnit.KG, MaterialUnit.G, MaterialUnit.L, MaterialUnit.ML].includes(material.unit);
      return true;
    })
    .sort((a, b) => {
      if (activeTab === "weight") return b.amount - a.amount;
      if (activeTab === "count") return b.savedCount - a.savedCount;
      return (b.environmentalImpact * b.savedCount) - (a.environmentalImpact * a.savedCount);
    })
    .slice(0, 5);

  // Total environmental impact calculation
  const totalImpact = materialData.materialBreakdown.reduce(
    (sum, m) => sum + m.environmentalImpact * m.savedCount,
    0
  );

  // Group materials by category
  const materialsByCategory = materialData.materialBreakdown.reduce(
    (acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = { totalAmount: 0, totalCount: 0, totalImpact: 0 };
      }
      acc[material.category].totalAmount += material.amount;
      acc[material.category].totalCount += material.savedCount;
      acc[material.category].totalImpact += material.environmentalImpact * material.savedCount;
      return acc;
    },
    {} as Record<string, { totalAmount: number; totalCount: number; totalImpact: number }>
  );

  // Helpers for category totals
  const getTotalVolume = (category: string) =>
    materialData.materialBreakdown
      .filter(m => m.category === category && [MaterialUnit.L, MaterialUnit.ML].includes(m.unit))
      .reduce((sum, material) => {
        const volumeInL = material.unit === MaterialUnit.ML ? material.amount / 1000 : material.amount;
        return sum + volumeInL;
      }, 0);

  const getTotalCountItems = (category: string) =>
    materialData.materialBreakdown
      .filter(m => m.category === category && ![MaterialUnit.KG, MaterialUnit.G, MaterialUnit.L, MaterialUnit.ML].includes(m.unit))
      .reduce((sum, material) => sum + material.savedCount, 0);

  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-gray-800">DIY Materials Saved</h2>

      <div className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold text-gray-700">Top Materials</h3>
          <div className="flex space-x-1 text-xs">
            {(["all", "weight", "volume", "count"] as const).map(filter => (
              <button
                key={filter}
                className={`px-2 py-1 rounded ${
                  activeUnitFilter === filter ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setActiveUnitFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Top Materials List */}
        {filteredAndSortedMaterials.map(material => (
          <div key={material.id} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 w-24 truncate">{material.name}</span>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  className={`h-full rounded-full ${
                    [MaterialUnit.KG, MaterialUnit.G].includes(material.unit)
                      ? "bg-blue-500"
                      : [MaterialUnit.L, MaterialUnit.ML].includes(material.unit)
                      ? "bg-purple-500"
                      : "bg-[#6437A0]"
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      activeTab === "weight"
                        ? `${(material.amount / materialData.totalWeight) * 100}%`
                        : activeTab === "count"
                        ? `${(material.savedCount / materialData.totalMaterialCount) * 100}%`
                        : `${((material.environmentalImpact * material.savedCount) / totalImpact) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-700 w-28 text-right flex items-center justify-end">
              {activeTab === "weight" && (
                <>
                  {material.amount.toFixed(1)}{" "}
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    [MaterialUnit.KG, MaterialUnit.G].includes(material.unit)
                      ? "bg-blue-100 text-blue-800"
                      : [MaterialUnit.L, MaterialUnit.ML].includes(material.unit)
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {formatUnitDisplay(material.unit)}
                  </span>
                </>
              )}
              {activeTab === "count" && `${material.savedCount} items`}
              {activeTab === "impact" && `${(material.environmentalImpact * material.savedCount).toFixed(1)} pts`}
            </span>
          </div>
        ))}

        {filteredAndSortedMaterials.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4">
            No materials found with the selected filter
          </p>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3 text-gray-700">By Category</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(materialsByCategory).map(([category, data]) => {
            const hasWeight = materialData.materialBreakdown.some(
              m => m.category === category && [MaterialUnit.KG, MaterialUnit.G].includes(m.unit)
            );
            const hasVolume = materialData.materialBreakdown.some(
              m => m.category === category && [MaterialUnit.L, MaterialUnit.ML].includes(m.unit)
            );
            const hasCount = materialData.materialBreakdown.some(
              m => m.category === category && ![MaterialUnit.KG, MaterialUnit.G, MaterialUnit.L, MaterialUnit.ML].includes(m.unit)
            );
            const totalVolume = getTotalVolume(category);
            const totalCountItems = getTotalCountItems(category);
            return (
              <div key={category} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="font-medium text-sm flex items-center mb-1">
                  {category}
                  <div className="flex ml-auto space-x-1">
                    {hasWeight && <span className="w-2 h-2 rounded-full bg-blue-500" title="Contains weight-based materials"></span>}
                    {hasVolume && <span className="w-2 h-2 rounded-full bg-purple-500" title="Contains volume-based materials"></span>}
                    {hasCount && <span className="w-2 h-2 rounded-full bg-[#6437A0]" title="Contains count-based materials"></span>}
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  {hasWeight && (
                    <div className={`${activeTab === "weight" ? "font-medium" : ""}`}>
                      <span className="inline-block w-3 h-3 bg-blue-100 rounded-sm mr-1"></span>
                      {data.totalAmount.toFixed(1)} kg
                    </div>
                  )}
                  {hasVolume && totalVolume > 0 && (
                    <div className={`${activeTab === "weight" ? "font-medium" : ""}`}>
                      <span className="inline-block w-3 h-3 bg-purple-100 rounded-sm mr-1"></span>
                      {totalVolume.toFixed(1)} L
                    </div>
                  )}
                  {hasCount && (
                    <div className={`${activeTab === "count" ? "font-medium" : ""}`}>
                      <span className="inline-block w-3 h-3 bg-[#6437A0]/20 rounded-sm mr-1"></span>
                      {totalCountItems} items
                    </div>
                  )}
                  {activeTab === "impact" && (
                    <div className="font-medium mt-1 pt-1 border-t border-gray-100">
                      {data.totalImpact.toFixed(1)} impact pts
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental Impact Summary */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Environmental Impact: {totalImpact.toFixed(1)} points
        </p>
      </div>
    </div>
  );
};

export default MaterialsPanel;
