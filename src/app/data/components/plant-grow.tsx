"use client";
// PlantGrow.tsx
// Fetches sustainability data and renders the complete dashboard including tree visualization,
// metric display, and detailed dashboard summary (sustainability stats, top materials, categories, and achievements).
import { useEffect, useState } from "react";
import { fetcher } from "@/api/use-fetcher";
import { FaLeaf, FaRecycle, FaSeedling, FaInfoCircle, FaAward, FaBox, FaTint } from "react-icons/fa";
import { TreeVisualization } from "./tree-visualization";
import { MetricDisplay } from "./metric-display";
import { SustainabilitySummary } from "./sustainability-summary";
import { TopMaterials } from "./top-materials";
import { MaterialCategories } from "./material-categories";
import { AchievementsMilestones } from "./achievements-milestones";

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
  const [materialData, setMaterialData] = useState<MaterialSavedSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<"weight" | "volume" | "impact" | "items">("impact");

  // Set target values for metrics.
  const maxWeight = 1; // in kg
  const maxVolume = 5; // in L
  const maxImpact = 500; // environmental impact points
  const maxItems = 50; // number of items

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const data = await fetcher<MaterialSavedSummary>("/posts/saved-materials");
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
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Loading material data...</p>
      </div>
    );
  }

  if (!materialData) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">No material data available</p>
      </div>
    );
  }

  // Calculate progress for each metric.
  const weightProgress = Math.min(100, (materialData.totalSavedWeight / maxWeight) * 100);
  const volumeProgress = Math.min(100, (materialData.totalSavedVolume / maxVolume) * 100);
  const impactProgress = Math.min(100, (materialData.totalEnvironmentalImpact / maxImpact) * 100);
  const itemsProgress = Math.min(100, (materialData.totalSavedItems / maxItems) * 100);

  let activeProgress = impactProgress;
  if (activeMetric === "weight") activeProgress = weightProgress;
  if (activeMetric === "volume") activeProgress = volumeProgress;
  if (activeMetric === "items") activeProgress = itemsProgress;

  // Tree visualization calculations.
  const treeHeight = Math.min(200, activeProgress * 2);
  const trunkWidth = Math.min(18, Math.max(8, activeProgress / 5));
  const leafScale = Math.min(1.2, Math.max(0, (activeProgress - 15) / 60));
  const fruitScale = Math.max(0, (activeProgress - 40) / 50);

  // Group materials by category.
  const materialsByCategory = materialData.materialBreakdown.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = {
        totalWeight: 0,
        totalVolume: 0,
        totalCount: 0,
        totalImpact: 0,
      };
    }
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
  }, {} as Record<string, { totalWeight: number; totalVolume: number; totalCount: number; totalImpact: number }>);

  const sortedCategories = Object.entries(materialsByCategory)
    .sort(([, a], [, b]) => b.totalImpact - a.totalImpact)
    .slice(0, 5);

  // Get top materials based on active metric.
  const getTopMaterials = () => {
    return [...materialData.materialBreakdown]
      .sort((a, b) => {
        if (activeMetric === "weight") return b.standardAmount - a.standardAmount;
        if (activeMetric === "volume") return b.standardAmount - a.standardAmount;
        if (activeMetric === "items") return b.savedCount - a.savedCount;
        return b.totalEnvironmentalImpact - a.totalEnvironmentalImpact;
      })
      .slice(0, 5);
  };
  const topMaterials = getTopMaterials();

  // Get metric value data.
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
        };
      case "volume":
        return {
          value: materialData.totalSavedVolume.toFixed(1),
          max: maxVolume,
          unit: "L",
          progress: volumeProgress,
          icon: <FaTint className="w-4 h-4" />,
          color: "from-blue-400 to-blue-600",
        };
      case "items":
        return {
          value: materialData.totalSavedItems.toString(),
          max: maxItems,
          unit: "items",
          progress: itemsProgress,
          icon: <FaRecycle className="w-4 h-4" />,
          color: "from-purple-400 to-purple-600",
        };
      case "impact":
      default:
        return {
          value: materialData.totalEnvironmentalImpact.toFixed(1),
          max: maxImpact,
          unit: "points",
          progress: impactProgress,
          icon: <FaLeaf className="w-4 h-4" />,
          color: "from-green-400 to-green-600",
        };
    }
  };

  const activeMetricData = getMetricValue(activeMetric);

  return (
    <div className="w-full min-h-[550px] p-4 flex flex-col items-center justify-center rounded-xl">
      <h1 className="text-2xl font-bold text-green-800 mb-2 text-center">Your Environmental Impact</h1>
      <p className="text-sm text-green-700 mb-6 text-center max-w-lg">
        Track your sustainability journey and see how your DIY projects contribute to a greener planet
      </p>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Tree visualization and metric display */}
        <div className="flex flex-col items-center md:col-span-1 pt-16">
          <TreeVisualization
            activeProgress={activeProgress}
            treeHeight={treeHeight}
            trunkWidth={trunkWidth}
            leafScale={leafScale}
            fruitScale={fruitScale}
          />
          <MetricDisplay activeMetricData={activeMetricData} activeMetric={activeMetric} setActiveMetric={setActiveMetric} />
        </div>
        {/* Right column: Dashboard content */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <SustainabilitySummary
            totalSavedWeight={materialData.totalSavedWeight}
            totalSavedVolume={materialData.totalSavedVolume}
            totalSavedItems={materialData.totalSavedItems}
            totalPostsCompleted={materialData.totalPostsCompleted}
          />
          <TopMaterials
            topMaterials={topMaterials}
            activeMetric={activeMetric}
            activeMetricData={{ progress: activeMetricData.progress, color: activeMetricData.color }}
            totalSavedWeight={materialData.totalSavedWeight}
            totalSavedVolume={materialData.totalSavedVolume}
            totalSavedItems={materialData.totalSavedItems}
            totalEnvironmentalImpact={materialData.totalEnvironmentalImpact}
          />
          <MaterialCategories
            sortedCategories={sortedCategories}
            activeMetric={activeMetric}
            totalSavedWeight={materialData.totalSavedWeight}
            totalSavedVolume={materialData.totalSavedVolume}
            totalSavedItems={materialData.totalSavedItems}
            totalEnvironmentalImpact={materialData.totalEnvironmentalImpact}
          />
          <AchievementsMilestones impactProgress={impactProgress} />
        </div>
      </div>
      <div className="mt-6 mb-4 text-center text-sm text-gray-600 max-w-lg bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
        <span className="font-semibold">🌱 Keep growing your impact!</span> Complete more DIY projects to grow your tree and track your contribution to sustainability.
      </div>
    </div>
  );
};
