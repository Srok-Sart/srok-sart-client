"use client";
// PlantGrow.tsx
// Fetches sustainability data and renders the complete dashboard with ability to toggle between
// overall sustainability data and individual user contribution data
import { fetcher } from "@/api/use-fetcher";
import { useEffect, useState } from "react";
import {
  FaBox,
  FaGlobeAmericas,
  FaLeaf,
  FaRecycle,
  FaUserAlt,
} from "react-icons/fa";
import { AchievementsMilestones } from "./achievements-milestones";
import { MaterialCategories } from "./material-categories";
import { MetricDisplay } from "./metric-display";
import { SustainabilitySummary } from "./sustainability-summary";
import { TopMaterials } from "./top-materials";
import { TreeVisualization } from "./tree-visualization";
import { UserContribution } from "./user-contribution";
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

interface MetricGoal {
  current: number;
  goal: number;
  explanation: string;
}

interface UserStats {
  totalPostsCompleted: number;
  totalSavedWeight: number;
  totalSavedVolume: number;
  totalSavedItems: number;
  totalEnvironmentalImpact: number;
}

interface GlobalComparison {
  postsCompletedPercentage: number;
  environmentalImpactPercentage: number;
}

interface CompletionTrend {
  month: string | null;
  count: number;
}

interface UserContributionData {
  summary: MaterialSavedSummary;
  progress: {
    userStats: UserStats;
    globalComparison: GlobalComparison;
    completionTrend: CompletionTrend[];
  };
  topMaterials: [];
  completionHistory: [];
}

export const PlantGrow = () => {
  const [viewMode, setViewMode] = useState<"overall" | "user">("overall");
  const [materialData, setMaterialData] = useState<MaterialSavedSummary | null>(
    null
  );
  const [userData, setUserData] = useState<UserContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<
    "weight" | "impact" | "items"
  >("impact");

  // Set target values for metrics.
  const maxWeightInGrams = 5000; // Now in grams instead of kg
  const maxImpact = 5000; // environmental impact points
  const maxItems = 5000; // number of items

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (viewMode === "overall") {
          const data = await fetcher<MaterialSavedSummary>(
            "/material-tracking/all"
          );
          setMaterialData(data);
        } else {
          const data = await fetcher<UserContributionData>(
            "/material-tracking/user"
          );
          setUserData(data);
        }
      } catch (error) {
        console.error(`Error fetching ${viewMode} data:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [viewMode]);

  if (loading) {
    return (
      <div className='w-full min-h-[400px] flex items-center justify-center'>
        <p className='text-lg font-medium text-gray-600'>
          Loading {viewMode === "overall" ? "overall" : "your"} sustainability
          data...
        </p>
      </div>
    );
  }

  if (
    (viewMode === "overall" && !materialData) ||
    (viewMode === "user" && !userData)
  ) {
    return (
      <div className='w-full min-h-[400px] flex items-center justify-center'>
        <p className='text-lg font-medium text-gray-600'>
          No {viewMode === "overall" ? "overall" : "user"} data available
        </p>
      </div>
    );
  }

  // Render the content based on the selected view mode
  return (
    <div className='w-full min-h-[550px] p-4 flex flex-col items-center justify-center rounded-xl'>
      <h1 className='text-2xl font-bold text-green-800 mb-2 text-center'>
        Environmental Impact Dashboard
      </h1>
      <p className='text-sm text-green-700 mb-4 text-center max-w-lg'>
        Track sustainability progress and see how DIY projects contribute to a
        greener planet
      </p>

      {/* Toggle Tabs */}
      <div className='flex mb-6 bg-gray-100 rounded-lg p-1 shadow-sm'>
        <button
          onClick={() => setViewMode("overall")}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === "overall"
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaGlobeAmericas className='mr-2' />
          Overall Impact
        </button>
        <button
          onClick={() => setViewMode("user")}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === "user"
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaUserAlt className='mr-2' />
          My Contribution
        </button>
      </div>

      {/* Content based on selected view */}
      {viewMode === "overall" && materialData && (
        <OverallDashboard
          materialData={materialData}
          activeMetric={activeMetric}
          setActiveMetric={setActiveMetric}
          maxWeightInGrams={maxWeightInGrams}
          maxImpact={maxImpact}
          maxItems={maxItems}
        />
      )}

      {viewMode === "user" && userData && (
        <UserContribution userData={userData} />
      )}
    </div>
  );
};

interface OverallDashboardProps {
  materialData: MaterialSavedSummary;
  activeMetric: "weight" | "impact" | "items";
  setActiveMetric: (metric: "weight" | "impact" | "items") => void;
  maxWeightInGrams: number;
  maxImpact: number;
  maxItems: number;
}

const OverallDashboard = ({
  materialData,
  activeMetric,
  setActiveMetric,
  maxWeightInGrams,
  maxImpact,
  maxItems,
}: OverallDashboardProps) => {
  // Calculate progress for each metric.
  const weightProgress = Math.min(
    100,
    ((materialData.totalSavedWeight * 1000) / maxWeightInGrams) * 100
  );
  const impactProgress = Math.min(
    100,
    (materialData.totalEnvironmentalImpact / maxImpact) * 100
  );
  const itemsProgress = Math.min(
    100,
    (materialData.totalSavedItems / maxItems) * 100
  );

  let activeProgress = impactProgress;
  if (activeMetric === "weight") activeProgress = weightProgress;
  if (activeMetric === "items") activeProgress = itemsProgress;

  // Group materials by category.
  const materialsByCategory = materialData.materialBreakdown.reduce(
    (acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = {
          totalWeight: 0,
          totalCount: 0,
          totalImpact: 0,
        };
      }
      const isWeight = material.displayUnit === MaterialUnit.KG;
      if (isWeight) {
        acc[material.category].totalWeight += material.standardAmount;
      }
      acc[material.category].totalCount += material.savedCount;
      acc[material.category].totalImpact += material.totalEnvironmentalImpact;
      return acc;
    },
    {} as Record<
      string,
      { totalWeight: number; totalCount: number; totalImpact: number }
    >
  );

  const sortedCategories = Object.entries(materialsByCategory)
    .sort(([, a], [, b]) => b.totalImpact - a.totalImpact)
    .slice(0, 5);

  // Get top materials based on active metric.
  const getTopMaterials = () => {
    return [...materialData.materialBreakdown]
      .sort((a, b) => {
        if (activeMetric === "weight")
          return b.standardAmount - a.standardAmount;
        if (activeMetric === "items") return b.savedCount - a.savedCount;
        return b.totalEnvironmentalImpact - a.totalEnvironmentalImpact;
      })
      .slice(0, 5);
  };
  const topMaterials = getTopMaterials();

  // Dynamic goal calculation based on user's current progress
  const calculateGoal = (current: number, baseGoal: number): number => {
    // If user has exceeded 80% of the base goal, set a new goal that's 50% higher
    if (current >= baseGoal * 0.8) {
      return Math.ceil((baseGoal * 1.5) / 100) * 100; // Round to nearest hundred
    }
    return baseGoal;
  };

  // Set target values for metrics with explanations
  const baseWeightGoal = 1000; // 1000 grams
  const baseImpactGoal = 500; // 500 points
  const baseItemsGoal = 50; // 50 items

  const metricGoals: Record<"weight" | "impact" | "items", MetricGoal> = {
    weight: {
      current: materialData?.totalSavedWeight
        ? materialData.totalSavedWeight * 1000
        : 0,
      goal: calculateGoal(
        materialData?.totalSavedWeight
          ? materialData.totalSavedWeight * 1000
          : 0,
        baseWeightGoal
      ),
      explanation: `Shows progress toward saving ${baseWeightGoal}g of materials. Goals increase as you progress!`,
    },
    impact: {
      current: materialData?.totalEnvironmentalImpact || 0,
      goal: calculateGoal(
        materialData?.totalEnvironmentalImpact || 0,
        baseImpactGoal
      ),
      explanation: `Represents your environmental impact score with a target of ${baseImpactGoal} points`,
    },
    items: {
      current: materialData?.totalSavedItems || 0,
      goal: calculateGoal(materialData?.totalSavedItems || 0, baseItemsGoal),
      explanation: `Tracks your progress toward reusing ${baseItemsGoal} items`,
    },
  };

  // Get metric value data.
  const getMetricValue = (metric: "weight" | "impact" | "items") => {
    switch (metric) {
      case "weight":
        return {
          value: (materialData.totalSavedWeight * 1000).toFixed(0),
          max: maxWeightInGrams,
          unit: "g",
          progress: weightProgress,
          icon: <FaBox className='w-4 h-4' />,
          color: "from-emerald-400 to-emerald-600",
          explanation: metricGoals.weight.explanation,
        };
      case "items":
        return {
          value: materialData.totalSavedItems.toString(),
          max: maxItems,
          unit: "items",
          progress: itemsProgress,
          icon: <FaRecycle className='w-4 h-4' />,
          color: "from-purple-400 to-purple-600",
          explanation: metricGoals.items.explanation,
        };
      case "impact":
      default:
        return {
          value: materialData.totalEnvironmentalImpact.toFixed(1),
          max: maxImpact,
          unit: "points",
          progress: impactProgress,
          icon: <FaLeaf className='w-4 h-4' />,
          color: "from-green-400 to-green-600",
          explanation: metricGoals.impact.explanation,
        };
    }
  };

  const activeMetricData = getMetricValue(activeMetric);

  return (
    <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6'>
      {/* Left column: Tree visualization and metric display */}
      <div className='flex flex-col items-center md:col-span-1 pt-16'>
        <TreeVisualization
          activeProgress={activeProgress}
          totalMaterialsSaved={materialData.totalSavedWeight}
          itemsReused={materialData.totalSavedItems}
          projectsCompleted={materialData.totalPostsCompleted}
        />
        <MetricDisplay
          activeMetricData={activeMetricData}
          activeMetric={activeMetric}
          setActiveMetric={setActiveMetric}
        />
      </div>
      {/* Right column: Dashboard content */}
      <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <SustainabilitySummary
          totalSavedWeight={materialData.totalSavedWeight}
          totalSavedItems={materialData.totalSavedItems}
          totalPostsCompleted={materialData.totalPostsCompleted}
        />
        <TopMaterials
          topMaterials={topMaterials}
          activeMetric={activeMetric}
          activeMetricData={{
            progress: activeMetricData.progress,
            color: activeMetricData.color,
          }}
          totalSavedWeight={materialData.totalSavedWeight}
          totalSavedItems={materialData.totalSavedItems}
          totalEnvironmentalImpact={materialData.totalEnvironmentalImpact}
        />
        <MaterialCategories
          sortedCategories={sortedCategories}
          activeMetric={activeMetric}
          totalSavedWeight={materialData.totalSavedWeight}
          totalSavedItems={materialData.totalSavedItems}
          totalEnvironmentalImpact={materialData.totalEnvironmentalImpact}
        />
        <AchievementsMilestones impactProgress={impactProgress} />
      </div>
      <div className='md:col-span-3 mt-6 mb-4 text-center text-sm text-gray-600 max-w-lg mx-auto bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm'>
        <span className='font-semibold'>🌱 Keep growing our impact!</span>{" "}
        Complete more DIY projects to grow the community tree and track our
        collective contribution to sustainability.
      </div>
    </div>
  );
};
