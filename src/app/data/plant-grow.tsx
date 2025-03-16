"use client";

import { fetcher } from "@/api/use-fetcher";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

enum MaterialUnit {
  KG = "KG",
  G = "G",
  L = "L",
  ML = "ML",
  PIECE = "PIECE",
  PACK = "PACK",
  BOTTLE = "BOTTLE",
  SPOON = "SPOON",
}

interface MaterialBreakdownItem {
  id: number;
  name: string;
  originalAmount: number;
  standardAmount: number;
  originalUnit: MaterialUnit;
  displayUnit: string;
  category: string;
  environmentalImpact: number;
  totalEnvironmentalImpact: number;
  savedCount: number;
}

interface MaterialSavedSummary {
  totalSavedWeight: number;
  totalSavedVolume: number;
  totalSavedItems: number;
  totalMaterialCount: number;
  totalPostsCompleted: number;
  totalEnvironmentalImpact: number;
  materialBreakdown: MaterialBreakdownItem[];
}

export const PlantGrow = () => {
  const [materialData, setMaterialData] = useState<MaterialSavedSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"weight" | "volume" | "impact">(
    "weight"
  );

  // Set appropriate targets based on your expectations
  const maxWeight = 1; // Target amount for weight in kg
  const maxVolume = 5; // Target amount for volume in L
  const maxImpact = 500; // Target for environmental impact

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        // Update to use the correct API endpoint
        const data = await fetcher<MaterialSavedSummary>(
          "/posts/saved-materials"
        );
        setMaterialData(data);
      } catch (error) {
        console.error("Error fetching material data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialData();
  }, []);

  if (loading) {
    return (
      <div className='w-full min-h-[400px] flex items-center justify-center'>
        <p className='text-lg font-medium text-gray-600'>
          Loading material data...
        </p>
      </div>
    );
  }

  if (!materialData) {
    return (
      <div className='w-full min-h-[400px] flex items-center justify-center'>
        <p className='text-lg font-medium text-gray-600'>
          No material data available
        </p>
      </div>
    );
  }

  // Calculate different growth metrics
  const weightProgress = Math.min(
    100,
    (materialData.totalSavedWeight / maxWeight) * 100
  );
  const volumeProgress = Math.min(
    100,
    (materialData.totalSavedVolume / maxVolume) * 100
  );
  const impactProgress = Math.min(
    100,
    (materialData.totalEnvironmentalImpact / maxImpact) * 100
  );

  // Determine which progress to use for the tree based on active tab
  let activeProgress = weightProgress;
  if (activeTab === "volume") activeProgress = volumeProgress;
  if (activeTab === "impact") activeProgress = impactProgress;

  // Tree growth calculations
  const treeHeight = Math.min(160, activeProgress * 1.6);
  const trunkWidth = Math.min(14, Math.max(6, activeProgress / 6));
  const leafScale = Math.min(1, Math.max(0, (activeProgress - 20) / 60));
  const fruitScale = Math.max(0, (activeProgress - 50) / 50); // Fruits appear at 50% progress

  // Sort materials based on active tab
  // Sort and filter materials based on active tab
  const sortedMaterials = [...materialData.materialBreakdown]
    .filter((material) => {
      if (activeTab === "weight")
        return material.displayUnit === MaterialUnit.KG;
      if (activeTab === "volume")
        return material.displayUnit === MaterialUnit.L;
      return true; // For items and impact, show all materials
    })
    .sort((a, b) => {
      if (activeTab === "weight") return b.standardAmount - a.standardAmount;
      if (activeTab === "volume") return b.standardAmount - a.standardAmount;
      return b.totalEnvironmentalImpact - a.totalEnvironmentalImpact;
    })
    .slice(0, 5); // Show top 5

  // Group materials by category
  const materialsByCategory = materialData.materialBreakdown.reduce(
    (acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = {
          totalWeight: 0,
          totalVolume: 0,
          totalCount: 0,
          totalImpact: 0,
        };
      }

      // Check unit type to determine where to add the amount
      const isWeight = material.displayUnit === MaterialUnit.KG;
      const isVolume = material.displayUnit === MaterialUnit.L;

      if (isWeight) {
        acc[material.category].totalWeight += material.standardAmount;
      } else if (isVolume) {
        acc[material.category].totalVolume += material.standardAmount;
      }

      acc[material.category].totalCount += material.savedCount;
      acc[material.category].totalImpact += material.totalEnvironmentalImpact;
      return acc;
    },
    {} as Record<
      string,
      {
        totalWeight: number;
        totalVolume: number;
        totalCount: number;
        totalImpact: number;
      }
    >
  );

  // Get the appropriate max value for the active tab
  const getActiveMax = () => {
    switch (activeTab) {
      case "weight":
        return maxWeight;
      case "volume":
        return maxVolume;
      case "impact":
        return maxImpact;
      default:
        return maxWeight;
    }
  };

  // Get the appropriate value for the active tab
  const getActiveValue = () => {
    switch (activeTab) {
      case "weight":
        return materialData.totalSavedWeight.toFixed(1);
      case "volume":
        return materialData.totalSavedVolume.toFixed(1);
      case "impact":
        return materialData.totalEnvironmentalImpact.toFixed(1);
      default:
        return materialData.totalSavedWeight.toFixed(1);
    }
  };

  // Get the appropriate unit for the active tab
  const getActiveUnit = () => {
    switch (activeTab) {
      case "weight":
        return "kg";
      case "volume":
        return "L";
      case "impact":
        return "points";
      default:
        return "kg";
    }
  };

  return (
    <div className='w-full min-h-[480px] p-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8'>
        <div className='w-full md:w-1/2 flex flex-col items-center'>
          <div className='tabs flex mb-6 space-x-2 flex-wrap justify-center'>
            <button
              className={`px-3 py-1 m-1 rounded text-sm font-medium ${
                activeTab === "weight"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("weight")}
            >
              Weight
            </button>
            <button
              className={`px-3 py-1 m-1 rounded text-sm font-medium ${
                activeTab === "volume"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("volume")}
            >
              Volume
            </button>
            <button
              className={`px-3 py-1 m-1 rounded text-sm font-medium ${
                activeTab === "impact"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("impact")}
            >
              Impact
            </button>
          </div>

          <div className='relative w-full max-w-[300px] aspect-square flex items-end justify-center mb-8'>
            {/* Ground/dirt */}
            <div
              className='absolute bottom-0 w-32 h-3 bg-amber-900/20 rounded-full'
              style={{
                transform: `scale(${Math.min(1, activeProgress / 20)})`,
              }}
            />

            {/* Tree trunk */}
            <motion.div
              className='absolute bottom-0 bg-amber-800 rounded-t-lg origin-bottom'
              style={{
                width: trunkWidth,
                height: treeHeight,
                scale: activeProgress > 5 ? 1 : 0,
              }}
              animate={{ height: treeHeight, width: trunkWidth }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
            >
              {/* Tree leaves */}
              <motion.div
                className='absolute -left-20 -right-20 bottom-[60%] flex items-center justify-center'
                style={{ scale: leafScale }}
                animate={{ scale: leafScale }}
                transition={{ type: "spring", stiffness: 70, damping: 15 }}
              >
                <div className='absolute bottom-0 w-40 h-32 rounded-full bg-green-600' />
                <div className='absolute bottom-8 w-36 h-32 rounded-full bg-green-500' />
                <div className='absolute bottom-16 w-32 h-32 rounded-full bg-green-400' />

                {/* Fruits appear as progress increases */}
                {fruitScale > 0 && (
                  <>
                    <motion.div
                      className='absolute bottom-12 -left-4 w-4 h-4 rounded-full bg-red-500'
                      initial={{ scale: 0 }}
                      animate={{ scale: fruitScale }}
                    />
                    <motion.div
                      className='absolute bottom-20 left-8 w-4 h-4 rounded-full bg-red-500'
                      initial={{ scale: 0 }}
                      animate={{ scale: fruitScale }}
                      transition={{ delay: 0.2 }}
                    />
                    <motion.div
                      className='absolute bottom-12 right-5 w-4 h-4 rounded-full bg-red-500'
                      initial={{ scale: 0 }}
                      animate={{ scale: fruitScale }}
                      transition={{ delay: 0.3 }}
                    />
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>

          <div className='flex flex-col items-center gap-2 mb-4'>
            <p className='text-lg font-semibold text-gray-800'>
              {activeTab === "weight" && "Weight Saved:"}
              {activeTab === "volume" && "Volume Saved:"}
              {activeTab === "impact" && "Environmental Impact:"}
              <span className='ml-2'>
                {getActiveValue()} / {getActiveMax()} {getActiveUnit()}
              </span>
            </p>

            <div className='w-full max-w-[250px] h-3 bg-gray-200 rounded-full mt-2'>
              <motion.div
                className='h-full bg-green-500 rounded-full'
                animate={{ width: `${activeProgress}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
            <div className='text-sm text-gray-600'>
              Progress: {activeProgress.toFixed(1)}%
            </div>
          </div>

          {/* Stats summary */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-[280px] text-center text-sm'>
            <div className='bg-green-100 p-2 rounded'>
              <div className='font-bold'>
                {materialData.totalSavedWeight.toFixed(1)}
              </div>
              <div className='text-xs text-gray-600'>Weight (kg)</div>
            </div>
            <div className='bg-blue-100 p-2 rounded'>
              <div className='font-bold'>
                {materialData.totalSavedVolume.toFixed(1)}
              </div>
              <div className='text-xs text-gray-600'>Volume (L)</div>
            </div>
            <div className='bg-purple-100 p-2 rounded'>
              <div className='font-bold'>{materialData.totalSavedItems}</div>
              <div className='text-xs text-gray-600'>Items</div>
            </div>
            <div className='bg-yellow-100 p-2 rounded'>
              <div className='font-bold'>
                {materialData.totalPostsCompleted}
              </div>
              <div className='text-xs text-gray-600'>DIYs</div>
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/2'>
          <h2 className='text-xl font-semibold mb-4 text-center md:text-left text-gray-800'>
            DIY Materials Saved
          </h2>

          <div className='space-y-4'>
            {sortedMaterials.length > 0 ? (
              sortedMaterials.map((material) => (
                <div
                  key={material.id}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm font-medium text-gray-700 w-24 truncate'>
                    {material.name}
                  </span>
                  <div className='flex-1 mx-4'>
                    <div className='h-2 bg-gray-200 rounded-full'>
                      <motion.div
                        className='h-full bg-[#6437A0] rounded-full'
                        initial={{ width: 0 }}
                        animate={{
                          width:
                            activeTab === "weight" &&
                            material.displayUnit === MaterialUnit.KG
                              ? `${
                                  (material.standardAmount /
                                    materialData.totalSavedWeight) *
                                  100
                                }%`
                              : activeTab === "volume" &&
                                material.displayUnit === MaterialUnit.L
                              ? `${
                                  (material.standardAmount /
                                    materialData.totalSavedVolume) *
                                  100
                                }%`
                              : `${
                                  (material.totalEnvironmentalImpact /
                                    materialData.totalEnvironmentalImpact) *
                                  100
                                }%`,
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                  <span className='text-sm font-semibold text-gray-700 w-24 text-right'>
                    {activeTab === "weight" &&
                      material.displayUnit === MaterialUnit.KG &&
                      `${material.standardAmount.toFixed(1)} kg`}
                    {activeTab === "volume" &&
                      material.displayUnit === MaterialUnit.L &&
                      `${material.standardAmount.toFixed(1)} L`}
                    {activeTab === "impact" &&
                      `${material.totalEnvironmentalImpact} pts`}
                  </span>
                </div>
              ))
            ) : (
              <div className='text-center py-4 text-gray-500'>
                No materials available for the selected category
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div className='mt-6'>
            <h3 className='text-md font-semibold mb-3 text-gray-700'>
              By Category
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              {Object.entries(materialsByCategory).map(([category, data]) => (
                <div
                  key={category}
                  className='bg-gray-50 p-2 rounded border border-gray-200'
                >
                  <div className='font-medium text-sm'>{category}</div>
                  <div className='text-xs text-gray-600'>
                    {activeTab === "weight" &&
                      `${data.totalWeight.toFixed(1)} kg`}
                    {activeTab === "volume" &&
                      `${data.totalVolume.toFixed(1)} L`}
                    {activeTab === "impact" &&
                      `${data.totalImpact.toFixed(1)} points`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Environmental Impact:{" "}
              {materialData.totalEnvironmentalImpact.toFixed(1)} points
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {materialData.totalPostsCompleted} DIY projects completed
            </p>
          </div>

          {/* Environmental impact scale */}
          <div className='mt-4'>
            <h3 className='text-md font-semibold mb-2 text-gray-700 text-center'>
              Environmental Impact Scale
            </h3>
            <div className='h-2 w-full bg-gradient-to-r from-green-100 via-green-300 to-green-600 rounded-full mb-1'></div>
            <div className='flex justify-between text-xs text-gray-500'>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {/* Legend */}
          <div className='mt-6'>
            <h3 className='text-md font-semibold mb-2 text-gray-700'>
              What This Means
            </h3>
            <div className='text-xs text-gray-600 space-y-1'>
              <p>
                • Your tree grows as you save more materials through DIY
                projects
              </p>
              <p>
                • Weight measures the total weight of physical materials saved
                from waste
              </p>
              <p>
                • Volume measures liquids and other volumetric materials saved
              </p>
              <p>
                • Items counts distinct objects that cant be measured by weight
                or volume
              </p>
              <p>
                • Impact points represent the positive environmental effect of
                your savings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 mb-4 text-center text-sm text-gray-500 max-w-lg'>
        Keep completing DIY projects to grow your impact tree and track your
        contribution to sustainability!
      </div>
    </div>
  );
};
