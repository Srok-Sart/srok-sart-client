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

interface MaterialBreakdown {
  id: number;
  name: string;
  amount: number;
  unit: MaterialUnit;
  category: string;
  environmentalImpact: number;
  savedCount: number;
}

interface MaterialSummary {
  totalWeight: number;
  totalMaterialCount: number;
  totalPostsCompleted: number;
  materialBreakdown: MaterialBreakdown[];
}

export const PlantGrow = () => {
  const [materialData, setMaterialData] = useState<MaterialSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"weight" | "count" | "impact">(
    "weight"
  );
  const [activeUnitFilter, setActiveUnitFilter] = useState<"all" | "weight" | "volume" | "count">("all");


  // Set appropriate targets based on your expectations
  const maxWeight = 5; // Target amount for weight in kg
  const maxCount = 100; // Target for item count
  const maxPosts = 50; // Target for completed posts

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const data = await fetcher<MaterialSummary>("/posts/saved-materials");

        // Convert weights to kg if needed
        const processedData = {
          ...data,
          materialBreakdown: data.materialBreakdown.map((material) => {
            let adjustedAmount = material.amount;
            // Convert grams to kg if the unit is G
            if (material.unit === MaterialUnit.G) {
              adjustedAmount = material.amount / 1000;
            }
            return {
              ...material,
              amount: adjustedAmount,
              // Keep the original unit for display purposes
              displayUnit: material.unit,
            };
          }),
        };

        // Calculate total weight in kg
        const totalWeightInKg = processedData.materialBreakdown.reduce(
          (sum, material) => {
            return sum + material.amount;
          },
          0
        );

        setMaterialData({
          ...processedData,
          totalWeight: totalWeightInKg,
        });
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
    (materialData.totalWeight / maxWeight) * 100
  );
  const countProgress = Math.min(
    100,
    (materialData.totalMaterialCount / maxCount) * 100
  );
  const postsProgress = Math.min(
    100,
    (materialData.totalPostsCompleted / maxPosts) * 100
  );

  // Calculate total environmental impact
  const totalImpact = materialData.materialBreakdown.reduce(
    (sum, mat) => sum + mat.environmentalImpact * mat.savedCount,
    0
  );

  // Determine which progress to use for the tree based on active tab
  let activeProgress = weightProgress;
  if (activeTab === "count") activeProgress = countProgress;
  if (activeTab === "impact") activeProgress = postsProgress;

  // Tree growth calculations
  const treeHeight = Math.min(160, activeProgress * 1.6);
  const trunkWidth = Math.min(14, Math.max(6, activeProgress / 6));
  const leafScale = Math.min(1, Math.max(0, (activeProgress - 20) / 60));
  const fruitScale = Math.max(0, (activeProgress - 50) / 50); // Fruits appear at 50% progress

  // Sort materials based on active tab
  const filteredAndSortedMaterials = [...materialData.materialBreakdown]
  .filter(material => {
    if (activeUnitFilter === "all") return true;
    if (activeUnitFilter === "weight") return [MaterialUnit.KG, MaterialUnit.G].includes(material.unit);
    if (activeUnitFilter === "volume") return [MaterialUnit.L, MaterialUnit.ML].includes(material.unit);
    if (activeUnitFilter === "count") return ![...Object.values(MaterialUnit)].slice(0, 4).includes(material.unit);
    return true;
  })
  .sort((a, b) => {
    if (activeTab === "weight") return b.amount - a.amount;
    if (activeTab === "count") return b.savedCount - a.savedCount;
    return (b.environmentalImpact * b.savedCount) - (a.environmentalImpact * a.savedCount);
  })
  .slice(0, 5); // Show top 5

  // Format unit display based on MaterialUnit enum
  const formatUnitDisplay = (unit: string, includeType = false): string => {
    const formattedUnit = (() => {
      switch (unit) {
        case MaterialUnit.KG: return "kg";
        case MaterialUnit.G: return "g";
        case MaterialUnit.L: return "L";
        case MaterialUnit.ML: return "mL";
        case MaterialUnit.PIECE: return "pc";
        case MaterialUnit.PACK: return "pack";
        case MaterialUnit.BOTTLE: return "bottle";
        case MaterialUnit.SPOON: return "spoon";
        default: return unit.toLowerCase();
      }
    })();
    
    if (!includeType) return formattedUnit;
    
    if ([MaterialUnit.KG, MaterialUnit.G].includes(unit as MaterialUnit)) {
      return `${formattedUnit} (weight)`;
    } else if ([MaterialUnit.L, MaterialUnit.ML].includes(unit as MaterialUnit)) {
      return `${formattedUnit} (volume)`;
    } else {
      return `${formattedUnit} (count)`;
    }
  };

  // Group materials by category
  const materialsByCategory = materialData.materialBreakdown.reduce(
    (acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = {
          totalAmount: 0,
          totalCount: 0,
          totalImpact: 0,
        };
      }
      acc[material.category].totalAmount += material.amount;
      acc[material.category].totalCount += material.savedCount;
      acc[material.category].totalImpact +=
        material.environmentalImpact * material.savedCount;
      return acc;
    },
    {} as Record<
      string,
      { totalAmount: number; totalCount: number; totalImpact: number }
    >
  );

  const categorizeMaterialsByType = () => {
    const categories = {
      weight: [] as MaterialBreakdown[],
      volume: [] as MaterialBreakdown[],
      count: [] as MaterialBreakdown[]
    };
    
    materialData.materialBreakdown.forEach(material => {
      if ([MaterialUnit.KG, MaterialUnit.G].includes(material.unit)) {
        categories.weight.push(material);
      } else if ([MaterialUnit.L, MaterialUnit.ML].includes(material.unit)) {
        categories.volume.push(material);
      } else {
        categories.count.push(material);
      }
    });
    
    return categories;
  };
  
  const materialsByType = categorizeMaterialsByType();

  return (
    <div className='w-full min-h-[480px] p-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8'>
        <div className='w-full md:w-1/2 flex flex-col items-center'>
          <div className='tabs flex mb-6 space-x-2'>
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${
                activeTab === "weight"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("weight")}
            >
              Weight
            </button>
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${
                activeTab === "count"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("count")}
            >
              Items
            </button>
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${
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
            {activeTab === "weight" && (
              <p className='text-lg font-semibold text-gray-800'>
                Total Weight Saved: {materialData.totalWeight.toFixed(1)} /{" "}
                {maxWeight}
              </p>
            )}
            {activeTab === "count" && (
              <p className='text-lg font-semibold text-gray-800'>
                Items Saved: {materialData.totalMaterialCount} / {maxCount}
              </p>
            )}
            {activeTab === "impact" && (
              <p className='text-lg font-semibold text-gray-800'>
                DIYs Completed: {materialData.totalPostsCompleted} / {maxPosts}
              </p>
            )}

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
          <div className='grid grid-cols-3 gap-2 w-full max-w-[280px] text-center text-sm'>
            <div className='bg-green-100 p-2 rounded'>
              <div className='font-bold'>
                {materialData.totalWeight.toFixed(1)}
              </div>
              <div className='text-xs text-gray-600'>Materials</div>
            </div>
            <div className='bg-blue-100 p-2 rounded'>
              <div className='font-bold'>{materialData.totalMaterialCount}</div>
              <div className='text-xs text-gray-600'>Items</div>
            </div>
            <div className='bg-purple-100 p-2 rounded'>
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
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-700">Top Materials</h3>
              <div className="flex space-x-1 text-xs">
                <button
                  className={`px-2 py-1 rounded ${activeUnitFilter === "all" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveUnitFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 rounded ${activeUnitFilter === "weight" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveUnitFilter("weight")}
                >
                  Weight
                </button>
                <button
                  className={`px-2 py-1 rounded ${activeUnitFilter === "volume" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveUnitFilter("volume")}
                >
                  Volume
                </button>
                <button
                  className={`px-2 py-1 rounded ${activeUnitFilter === "count" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveUnitFilter("count")}
                >
                  Count
                </button>
              </div>
            </div>
            
            {filteredAndSortedMaterials.map((material) => (
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
                      className={`h-full rounded-full ${
                        [MaterialUnit.KG, MaterialUnit.G].includes(material.unit)
                          ? "bg-blue-500"
                          : [MaterialUnit.L, MaterialUnit.ML].includes(material.unit)
                            ? "bg-purple-500"
                            : "bg-[#6437A0]"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: activeTab === "weight"
                          ? `${(material.amount / materialData.totalWeight) * 100}%`
                          : activeTab === "count"
                            ? `${(material.savedCount / materialData.totalMaterialCount) * 100}%`
                            : `${((material.environmentalImpact * material.savedCount) / totalImpact) * 100}%`,
                      }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <span className='text-sm font-semibold text-gray-700 w-28 text-right flex items-center justify-end'>
                  {activeTab === "weight" && (
                    <>
                      {material.amount.toFixed(1)} 
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

          {/* Category breakdown */}
          <div className='mt-6'>
            <h3 className='text-md font-semibold mb-3 text-gray-700'>
              By Category
            </h3>
            <div className='grid grid-cols-2 gap-2'>
            {Object.entries(materialsByCategory).map(([category, data]) => {
              const hasWeight = materialData.materialBreakdown.some(
                m => m.category === category && [MaterialUnit.KG, MaterialUnit.G].includes(m.unit)
              );
              const hasVolume = materialData.materialBreakdown.some(
                m => m.category === category && [MaterialUnit.L, MaterialUnit.ML].includes(m.unit)
              );
              const hasCount = materialData.materialBreakdown.some(
                m => m.category === category && 
                ![MaterialUnit.KG, MaterialUnit.G, MaterialUnit.L, MaterialUnit.ML].includes(m.unit)
              );
              
              // Calculate total volume for this category (in L)
              const totalVolume = materialData.materialBreakdown
                .filter(m => m.category === category && [MaterialUnit.L, MaterialUnit.ML].includes(m.unit))
                .reduce((sum, material) => {
                  const volumeInL = material.unit === MaterialUnit.ML 
                    ? material.amount / 1000 
                    : material.amount;
                  return sum + volumeInL;
                }, 0);
              
              const totalCountItems = materialData.materialBreakdown
                .filter(m => m.category === category && 
                  ![MaterialUnit.KG, MaterialUnit.G, MaterialUnit.L, MaterialUnit.ML].includes(m.unit))
                .reduce((sum, material) => sum + material.savedCount, 0);
              
              return (
                <div
                  key={category}
                  className='bg-gray-50 p-3 rounded border border-gray-200'
                >
                  <div className='font-medium text-sm flex items-center mb-1'>
                    {category}
                    <div className="flex ml-auto space-x-1">
                      {hasWeight && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" title="Contains weight-based materials"></span>
                      )}
                      {hasVolume && (
                        <span className="w-2 h-2 rounded-full bg-purple-500" title="Contains volume-based materials"></span>
                      )}
                      {hasCount && (
                        <span className="w-2 h-2 rounded-full bg-[#6437A0]" title="Contains count-based materials"></span>
                      )}
                    </div>
                  </div>
                  
                  <div className='space-y-1 text-xs text-gray-600'>
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

          {/* Category breakdown
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
                    {activeTab === "weight" && `${data.totalAmount.toFixed(1)}`}
                    {activeTab === "count" && `${data.totalCount} items`}
                    {activeTab === "impact" &&
                      `${data.totalImpact.toFixed(1)} impact`}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Environmental Impact: {totalImpact.toFixed(1)} points
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
