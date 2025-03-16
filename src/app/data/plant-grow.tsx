"use client"

import { fetcher } from "@/api/use-fetcher"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FaLeaf, FaRecycle, FaSeedling, FaInfoCircle, FaAward, FaBox, FaTint } from "react-icons/fa"

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
  id: number
  name: string
  originalAmount: number
  standardAmount: number
  originalUnit: MaterialUnit
  displayUnit: string
  category: string
  environmentalImpact: number
  totalEnvironmentalImpact: number
  savedCount: number
}

interface MaterialSavedSummary {
  totalSavedWeight: number
  totalSavedVolume: number
  totalSavedItems: number
  totalMaterialCount: number
  totalPostsCompleted: number
  totalEnvironmentalImpact: number
  materialBreakdown: MaterialBreakdownItem[]
}

export const PlantGrow = () => {
  const [materialData, setMaterialData] = useState<MaterialSavedSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeMetric, setActiveMetric] = useState<"weight" | "volume" | "impact" | "items">("impact")

  // Set appropriate targets based on your expectations
  const maxWeight = 1 // Target amount for weight in kg
  const maxVolume = 5 // Target amount for volume in L
  const maxImpact = 500 // Target for environmental impact
  const maxItems = 50 // Target for items saved

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        // Update to use the correct API endpoint
        const data = await fetcher<MaterialSavedSummary>("/posts/saved-materials")
        setMaterialData(data)
      } catch (error) {
        console.error("Error fetching material data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterialData()
  }, [])

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Loading material data...</p>
      </div>
    )
  }

  if (!materialData) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">No material data available</p>
      </div>
    )
  }

  // Calculate different growth metrics
  const weightProgress = Math.min(100, (materialData.totalSavedWeight / maxWeight) * 100)
  const volumeProgress = Math.min(100, (materialData.totalSavedVolume / maxVolume) * 100)
  const impactProgress = Math.min(100, (materialData.totalEnvironmentalImpact / maxImpact) * 100)
  const itemsProgress = Math.min(100, (materialData.totalSavedItems / maxItems) * 100)

  // Determine which progress to use for the tree based on active metric
  let activeProgress = impactProgress
  if (activeMetric === "weight") activeProgress = weightProgress
  if (activeMetric === "volume") activeProgress = volumeProgress
  if (activeMetric === "items") activeProgress = itemsProgress

  // Enhanced tree growth calculations
  const treeHeight = Math.min(200, activeProgress * 2) // Increased max height
  const trunkWidth = Math.min(18, Math.max(8, activeProgress / 5)) // Wider trunk
  const leafScale = Math.min(1.2, Math.max(0, (activeProgress - 15) / 60)) // Leaves appear earlier and grow larger
  const fruitScale = Math.max(0, (activeProgress - 40) / 50) // Fruits appear earlier at 40% progress

  // Group materials by category with improved calculation
  const materialsByCategory = materialData.materialBreakdown.reduce(
    (acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = {
          totalWeight: 0,
          totalVolume: 0,
          totalCount: 0,
          totalImpact: 0,
        }
      }

      // Check unit type to determine where to add the amount
      const isWeight = material.displayUnit === MaterialUnit.KG
      const isVolume = material.displayUnit === MaterialUnit.L

      if (isWeight) {
        acc[material.category].totalWeight += material.standardAmount
      } else if (isVolume) {
        acc[material.category].totalVolume += material.standardAmount
      }

      acc[material.category].totalCount += material.savedCount
      acc[material.category].totalImpact += material.totalEnvironmentalImpact
      return acc
    },
    {} as Record<
      string,
      {
        totalWeight: number
        totalVolume: number
        totalCount: number
        totalImpact: number
      }
    >,
  )

  // Sort categories by impact for display
  const sortedCategories = Object.entries(materialsByCategory)
    .sort(([, a], [, b]) => b.totalImpact - a.totalImpact)
    .slice(0, 5)

  // Get top materials based on active metric
  const getTopMaterials = () => {
    return [...materialData.materialBreakdown]
      .sort((a, b) => {
        if (activeMetric === "weight") return b.standardAmount - a.standardAmount
        if (activeMetric === "volume") return b.standardAmount - a.standardAmount
        if (activeMetric === "items") return b.savedCount - a.savedCount
        return b.totalEnvironmentalImpact - a.totalEnvironmentalImpact
      })
      .slice(0, 5)
  }

  const topMaterials = getTopMaterials()

  // Get the appropriate value and unit for the active metric
  const getMetricValue = (metric: "weight" | "volume" | "impact" | "items") => {
    switch (metric) {
      case "weight":
        return {
          value: materialData.totalSavedWeight.toFixed(1),
          max: maxWeight,
          unit: "kg",
          progress: weightProgress,
          icon: <FaBox className="w-4 h-4" />,
          color: "from-emerald-400 to-emerald-600",
        }
      case "volume":
        return {
          value: materialData.totalSavedVolume.toFixed(1),
          max: maxVolume,
          unit: "L",
          progress: volumeProgress,
          icon: <FaTint className="w-4 h-4" />,
          color: "from-blue-400 to-blue-600",
        }
      case "items":
        return {
          value: materialData.totalSavedItems.toString(),
          max: maxItems,
          unit: "items",
          progress: itemsProgress,
          icon: <FaRecycle className="w-4 h-4" />,
          color: "from-purple-400 to-purple-600",
        }
      case "impact":
        return {
          value: materialData.totalEnvironmentalImpact.toFixed(1),
          max: maxImpact,
          unit: "points",
          progress: impactProgress,
          icon: <FaLeaf className="w-4 h-4" />,
          color: "from-green-400 to-green-600",
        }
      default:
        return {
          value: "0",
          max: 0,
          unit: "",
          progress: 0,
          icon: null,
          color: "from-gray-400 to-gray-600",
        }
    }
  }

  const activeMetricData = getMetricValue(activeMetric)

  return (
    // <div className="w-full min-h-[550px] p-4 flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 rounded-xl"> with background

    // without background
    <div className="w-full min-h-[550px] p-4 flex flex-col items-center justify-center rounded-xl">
      <h1 className="text-2xl font-bold text-green-800 mb-2 text-center">Your Environmental Impact</h1>
      <p className="text-sm text-green-700 mb-6 text-center max-w-lg">
        Track your sustainability journey and see how your DIY projects contribute to a greener planet
      </p>

      <div className="w-full max-w-5xl grid grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Tree visualization - Left column on desktop, top on mobile */}
        <div className="flex flex-col items-center lg:col-span-1 pt-16">
          <div className="relative w-full max-w-[280px] aspect-square flex items-end justify-center mb-4">
            {/* Enhanced ground/soil with gradient and texture */}
            <div className="absolute bottom-0 w-full h-8 flex justify-center">
              <div
                className="w-48 h-4 bg-gradient-to-r from-amber-800/30 via-amber-700/40 to-amber-800/30 rounded-full"
                style={{
                  transform: `scale(${Math.min(1.2, activeProgress / 15)})`,
                  boxShadow: "0 -2px 10px rgba(0,0,0,0.1) inset",
                }}
              />
            </div>

            {/* Tree trunk with texture and gradient */}
            <motion.div
              className="absolute bottom-0 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg origin-bottom"
              style={{
                width: trunkWidth,
                height: treeHeight,
                scale: activeProgress > 5 ? 1 : 0,
                boxShadow: "2px 0 3px rgba(0,0,0,0.1)",
              }}
              animate={{ height: treeHeight, width: trunkWidth }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
            >
              {/* Tree branches */}
              {activeProgress > 30 && (
                <>
                  <motion.div
                    className="absolute w-20 h-3 bg-amber-700 rounded-full"
                    style={{
                      left: -15,
                      bottom: treeHeight * 0.6,
                      transformOrigin: "right center",
                      transform: "rotate(-25deg)",
                      boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute w-16 h-3 bg-amber-700 rounded-full"
                    style={{
                      right: -12,
                      bottom: treeHeight * 0.7,
                      transformOrigin: "left center",
                      transform: "rotate(20deg)",
                      boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                </>
              )}

              {activeProgress > 50 && (
                <>
                  <motion.div
                    className="absolute w-14 h-2.5 bg-amber-700 rounded-full"
                    style={{
                      left: -10,
                      bottom: treeHeight * 0.4,
                      transformOrigin: "right center",
                      transform: "rotate(-15deg)",
                      boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute w-12 h-2.5 bg-amber-700 rounded-full"
                    style={{
                      right: -8,
                      bottom: treeHeight * 0.5,
                      transformOrigin: "left center",
                      transform: "rotate(15deg)",
                      boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                </>
              )}

              {/* Enhanced tree leaves with multiple layers and gradients */}
              <motion.div
                className="absolute -left-24 -right-24 bottom-[60%] flex items-center justify-center"
                style={{ scale: leafScale }}
                animate={{ scale: leafScale }}
                transition={{ type: "spring", stiffness: 70, damping: 15 }}
              >
                <div
                  className="absolute bottom-0 w-48 h-40 rounded-full bg-gradient-to-b from-green-700 to-green-600 opacity-90"
                  style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
                />
                <div
                  className="absolute bottom-8 w-44 h-40 rounded-full bg-gradient-to-b from-green-600 to-green-500 opacity-95"
                  style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.1))" }}
                />
                <div
                  className="absolute bottom-16 w-40 h-40 rounded-full bg-gradient-to-b from-green-500 to-green-400"
                  style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.05))" }}
                />

                {/* Additional leaf clusters that appear with progress */}
                {activeProgress > 40 && (
                  <>
                    <motion.div
                      className="absolute -left-12 bottom-4 w-20 h-16 rounded-full bg-gradient-to-b from-green-600 to-green-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                    <motion.div
                      className="absolute -right-14 bottom-6 w-22 h-18 rounded-full bg-gradient-to-b from-green-600 to-green-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  </>
                )}

                {/* Small leaf details */}
                {activeProgress > 30 &&
                  Array.from({ length: Math.floor(activeProgress / 8) }).map((_, i) => (
                    <motion.div
                      key={`leaf-${i}`}
                      className="absolute rounded-full bg-green-400"
                      style={{
                        width: 4 + Math.random() * 8,
                        height: 4 + Math.random() * 8,
                        left: -20 + Math.random() * 80,
                        bottom: 10 + Math.random() * 40,
                        opacity: 0.7 + Math.random() * 0.3,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                    />
                  ))}

                {/* Enhanced fruits with glow effect */}
                {fruitScale > 0 && (
                  <>
                    <motion.div
                      className="absolute bottom-12 -left-4 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
                      style={{
                        boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                        filter: "brightness(1.1)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: fruitScale }}
                    />
                    <motion.div
                      className="absolute bottom-20 left-8 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
                      style={{
                        boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                        filter: "brightness(1.1)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: fruitScale }}
                      transition={{ delay: 0.2 }}
                    />
                    <motion.div
                      className="absolute bottom-12 right-5 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
                      style={{
                        boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                        filter: "brightness(1.1)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: fruitScale }}
                      transition={{ delay: 0.3 }}
                    />
                    {activeProgress > 70 && (
                      <motion.div
                        className="absolute bottom-24 right-10 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600"
                        style={{
                          boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                          filter: "brightness(1.1)",
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: fruitScale }}
                        transition={{ delay: 0.4 }}
                      />
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Animated butterflies or birds that appear at higher progress */}
            {activeProgress > 60 && (
              <>
                <motion.div
                  className="absolute w-4 h-4"
                  style={{
                    top: "30%",
                    left: "30%",
                  }}
                  animate={{
                    x: [0, 20, 0, -20, 0],
                    y: [0, -10, -20, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M12 2L15 6L12 10L9 6L12 2Z" fill="#FB923C" />
                    <path d="M12 10L15 14L12 18L9 14L12 10Z" fill="#FB923C" />
                  </svg>
                </motion.div>
                <motion.div
                  className="absolute w-3 h-3"
                  style={{
                    top: "20%",
                    right: "35%",
                  }}
                  animate={{
                    x: [0, -15, 0, 15, 0],
                    y: [0, -5, -15, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    delay: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M12 2L15 6L12 10L9 6L12 2Z" fill="#3B82F6" />
                    <path d="M12 10L15 14L12 18L9 14L12 10Z" fill="#3B82F6" />
                  </svg>
                </motion.div>
              </>
            )}
          </div>

          {/* Active metric display */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md w-full max-w-[280px] mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {activeMetricData.icon}
                <span className="ml-2 font-semibold text-gray-800">
                  {activeMetric === "weight" && "Weight Saved"}
                  {activeMetric === "volume" && "Volume Saved"}
                  {activeMetric === "items" && "Items Saved"}
                  {activeMetric === "impact" && "Environmental Impact"}
                </span>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                title={
                  activeMetric === "weight"
                    ? "Total weight of materials saved through your DIY projects"
                    : activeMetric === "volume"
                      ? "Total volume of materials saved through your DIY projects"
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
              <span className="text-sm font-normal text-gray-600">{activeMetricData.unit}</span>
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
          </div>

          {/* Metric selector buttons */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
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
              onClick={() => setActiveMetric("volume")}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                activeMetric === "volume"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              <FaTint className="w-4 h-4" />
              <span className="text-sm">Volume</span>
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

        {/* Main dashboard content - Right columns on desktop, bottom on mobile */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key stats summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <FaAward className="w-5 h-5 mr-2 text-amber-500" />
              Your Sustainability Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200 flex flex-col items-center">
                <FaBox className="w-5 h-5 text-green-700 mb-1" />
                <div className="font-bold text-green-700 text-lg">{materialData.totalSavedWeight.toFixed(1)}</div>
                <div className="text-xs text-gray-600">kg Saved</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200 flex flex-col items-center">
                <FaTint className="w-5 h-5 text-blue-700 mb-1" />
                <div className="font-bold text-blue-700 text-lg">{materialData.totalSavedVolume.toFixed(1)}</div>
                <div className="text-xs text-gray-600">L Saved</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200 flex flex-col items-center">
                <FaRecycle className="w-5 h-5 text-purple-700 mb-1" />
                <div className="font-bold text-purple-700 text-lg">{materialData.totalSavedItems}</div>
                <div className="text-xs text-gray-600">Items Saved</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm border border-amber-200 flex flex-col items-center">
                <FaAward className="w-5 h-5 text-amber-700 mb-1" />
                <div className="font-bold text-amber-700 text-lg">{materialData.totalPostsCompleted}</div>
                <div className="text-xs text-gray-600">DIY Projects</div>
              </div>
            </div>
          </div>

          {/* Top materials */}
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
                          className={`h-full bg-gradient-to-r ${
                            activeMetric === "impact"
                              ? "from-green-400 to-green-600"
                              : activeMetric === "weight"
                                ? "from-emerald-400 to-emerald-600"
                                : activeMetric === "volume"
                                  ? "from-blue-400 to-blue-600"
                                  : "from-purple-400 to-purple-600"
                          } rounded-full`}
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              activeMetric === "weight"
                                ? `${(material.standardAmount / materialData.totalSavedWeight) * 100}%`
                                : activeMetric === "volume"
                                  ? `${(material.standardAmount / materialData.totalSavedVolume) * 100}%`
                                  : activeMetric === "items"
                                    ? `${(material.savedCount / materialData.totalSavedItems) * 100}%`
                                    : `${(material.totalEnvironmentalImpact / materialData.totalEnvironmentalImpact) * 100}%`,
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

          {/* Category breakdown */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Material Categories
            </h2>
            <div className="space-y-3">
              {sortedCategories.map(([category, data]) => (
                <div key={category} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {activeMetric === "weight" && `${data.totalWeight.toFixed(1)} kg`}
                      {activeMetric === "volume" && `${data.totalVolume.toFixed(1)} L`}
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
                            : activeMetric === "volume"
                              ? "from-blue-400 to-blue-600"
                              : "from-purple-400 to-purple-600"
                      } rounded-full`}
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          activeMetric === "weight"
                            ? `${(data.totalWeight / materialData.totalSavedWeight) * 100}%`
                            : activeMetric === "volume"
                              ? `${(data.totalVolume / materialData.totalSavedVolume) * 100}%`
                              : activeMetric === "items"
                                ? `${(data.totalCount / materialData.totalSavedItems) * 100}%`
                                : `${(data.totalImpact / materialData.totalEnvironmentalImpact) * 100}%`,
                      }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement and milestones */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <FaAward className="w-5 h-5 mr-2 text-amber-500" />
              Achievements & Milestones
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className={`p-3 rounded-lg border ${impactProgress >= 25 ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300 opacity-60"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${impactProgress >= 25 ? "bg-green-600 text-white" : "bg-gray-400 text-gray-100"}`}
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
                className={`p-3 rounded-lg border ${impactProgress >= 50 ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300 opacity-60"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${impactProgress >= 50 ? "bg-green-600 text-white" : "bg-gray-400 text-gray-100"}`}
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
                className={`p-3 rounded-lg border ${impactProgress >= 75 ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300 opacity-60"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${impactProgress >= 75 ? "bg-green-600 text-white" : "bg-gray-400 text-gray-100"}`}
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
        </div>
      </div>

      <div className="mt-6 mb-4 text-center text-sm text-gray-600 max-w-lg bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
        <span className="font-semibold">🌱 Keep growing your impact!</span> Complete more DIY projects to grow your tree
        and track your contribution to sustainability.
      </div>
    </div>
  )
}

