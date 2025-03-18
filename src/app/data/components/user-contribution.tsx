"use client";
// UserContribution.tsx
// Displays individual user's sustainability contributions with personalized statistics,
// comparison to global averages, and progress visualization

import { useState } from "react";
import { BiWorld } from "react-icons/bi";
import { FaBox, FaLeaf, FaRecycle, FaTrophy, FaUserAlt } from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";

// Types
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

interface MaterialItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  environmentalImpact: number;
}

interface Post {
  id: number;
  title: string;
  materials: MaterialItem[];
}

interface CompletionItem {
  completionId: number;
  completedAt: string | null;
  post: Post;
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
  summary: {
    totalSavedWeight: number;
    totalSavedVolume: number;
    totalSavedItems: number;
    totalMaterialCount: number;
    totalPostsCompleted: number;
    totalEnvironmentalImpact: number;
    materialBreakdown: MaterialBreakdownItem[];
  };
  progress: {
    userStats: UserStats;
    globalComparison: GlobalComparison;
    completionTrend: CompletionTrend[];
  };
  topMaterials: []; // This is empty in the provided data
  completionHistory: CompletionItem[];
}

interface UserContributionProps {
  userData: UserContributionData;
}

export const UserContribution = ({ userData }: UserContributionProps) => {
  const [activeMetric, setActiveMetric] = useState<
    "weight" | "impact" | "items"
  >("impact");

  if (!userData) {
    return (
      <div className='w-full min-h-[400px] flex items-center justify-center'>
        <p className='text-lg font-medium text-gray-600'>
          No contribution data available
        </p>
      </div>
    );
  }

  const { summary, progress } = userData;

  // Calculate percentage of metrics for progress bars
  const weightProgress = Math.min(100, (summary.totalSavedWeight / 5) * 100); // Assuming 5kg is a good benchmark
  const impactProgress = Math.min(
    100,
    (summary.totalEnvironmentalImpact / 100) * 100
  ); // Assuming 100 points is a good benchmark
  const itemsProgress = Math.min(100, (summary.totalSavedItems / 20) * 100); // Assuming 20 items is a good benchmark

  // Calculate user ranking based on environmental impact
  // This is a placeholder calculation, in a real app you'd get this from the server
  const userRanking =
    progress.globalComparison.environmentalImpactPercentage === 100
      ? 1
      : progress.globalComparison.environmentalImpactPercentage > 75
      ? 2
      : progress.globalComparison.environmentalImpactPercentage > 50
      ? 3
      : progress.globalComparison.environmentalImpactPercentage > 25
      ? 4
      : 5;

  // Calculate average items saved per project
  const avgItemsPerProject =
    summary.totalPostsCompleted > 0
      ? (summary.totalSavedItems / summary.totalPostsCompleted).toFixed(1)
      : "0";

  // Get active metric data
  let activeProgressValue = impactProgress;
  if (activeMetric === "weight") activeProgressValue = weightProgress;
  if (activeMetric === "items") activeProgressValue = itemsProgress;

  // Get active metric display data
  const getActiveMetricData = () => {
    switch (activeMetric) {
      case "weight":
        return {
          value: summary.totalSavedWeight.toFixed(1),
          unit: "kg",
          icon: <FaBox className='w-5 h-5' />,
          label: "Materials Saved",
          color: "emerald",
          progress: weightProgress,
        };
      case "items":
        return {
          value: summary.totalSavedItems.toString(),
          unit: "items",
          icon: <FaRecycle className='w-5 h-5' />,
          label: "Items Reused",
          color: "purple",
          progress: itemsProgress,
        };
      case "impact":
      default:
        return {
          value: summary.totalEnvironmentalImpact.toFixed(1),
          unit: "points",
          icon: <FaLeaf className='w-5 h-5' />,
          label: "Environmental Impact",
          color: "green",
          progress: impactProgress,
        };
    }
  };

  const activeMetricData = getActiveMetricData();

  // Get recent projects data
  const recentProjects = userData.completionHistory.slice(0, 3).map((item) => ({
    id: item.completionId,
    title: item.post.title,
    impact: item.post.materials.reduce(
      (sum, material) => sum + material.environmentalImpact,
      0
    ),
    itemCount: item.post.materials.reduce((sum) => sum + 1, 0),
    date: item.completedAt || "Recently completed",
  }));

  return (
    <div className='w-full p-4 bg-gradient-to-b from-green-50 to-white rounded-xl shadow-sm'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold text-green-800 mb-2'>
          Your Sustainability Journey
        </h1>
        <p className='text-sm text-green-700 mb-6'>
          See how your DIY projects are making a difference for the planet
        </p>

        {/* User Stats Summary */}
        <div className='mb-8 p-6 bg-white rounded-xl shadow-md'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Left column: Stats */}
            <div>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
                <FaUserAlt className='mr-2 text-green-600' /> Your Impact
                Summary
              </h2>

              {/* Key Stats */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div className='p-4 bg-green-50 rounded-lg'>
                  <div className='flex items-center mb-1'>
                    <FaLeaf className='w-4 h-4 mr-2 text-green-600' />
                    <span className='text-sm font-medium text-gray-600'>
                      Environmental Impact
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-green-700'>
                    {summary.totalEnvironmentalImpact}{" "}
                    <span className='text-sm font-normal'>points</span>
                  </div>
                </div>

                <div className='p-4 bg-purple-50 rounded-lg'>
                  <div className='flex items-center mb-1'>
                    <FaRecycle className='w-4 h-4 mr-2 text-purple-600' />
                    <span className='text-sm font-medium text-gray-600'>
                      Items Reused
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-purple-700'>
                    {summary.totalSavedItems}{" "}
                    <span className='text-sm font-normal'>items</span>
                  </div>
                </div>

                <div className='p-4 bg-emerald-50 rounded-lg'>
                  <div className='flex items-center mb-1'>
                    <FaBox className='w-4 h-4 mr-2 text-emerald-600' />
                    <span className='text-sm font-medium text-gray-600'>
                      Materials Saved
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-emerald-700'>
                    {summary.totalSavedWeight}{" "}
                    <span className='text-sm font-normal'>kg</span>
                  </div>
                </div>

                <div className='p-4 bg-blue-50 rounded-lg'>
                  <div className='flex items-center mb-1'>
                    <BiWorld className='w-4 h-4 mr-2 text-blue-600' />
                    <span className='text-sm font-medium text-gray-600'>
                      Projects Completed
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-blue-700'>
                    {summary.totalPostsCompleted}{" "}
                    <span className='text-sm font-normal'>projects</span>
                  </div>
                </div>
              </div>

              {/* Global Comparison */}
              <div className='mb-6'>
                <h3 className='text-md font-medium text-gray-700 mb-2'>
                  How You Compare
                </h3>
                <div className='space-y-3'>
                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-gray-600'>
                        Your Environmental Impact
                      </span>
                      <span className='font-medium text-green-700'>
                        {
                          progress.globalComparison
                            .environmentalImpactPercentage
                        }
                        % of average
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-green-600 h-2 rounded-full'
                        style={{
                          width: `${progress.globalComparison.environmentalImpactPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-gray-600'>
                        Your Completed Projects
                      </span>
                      <span className='font-medium text-blue-700'>
                        {progress.globalComparison.postsCompletedPercentage}% of
                        average
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full'
                        style={{
                          width: `${progress.globalComparison.postsCompletedPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Milestones */}
              <div>
                <h3 className='text-md font-medium text-gray-700 mb-2'>
                  Your Achievements
                </h3>
                <div className='grid grid-cols-2 gap-3'>
                  <div
                    className={`p-3 rounded-lg border ${
                      summary.totalPostsCompleted >= 1
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className='flex items-center'>
                      <FaTrophy
                        className={`w-4 h-4 mr-2 ${
                          summary.totalPostsCompleted >= 1
                            ? "text-amber-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          summary.totalPostsCompleted >= 1
                            ? "text-amber-700"
                            : "text-gray-500"
                        }`}
                      >
                        First Project
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg border ${
                      summary.totalSavedItems >= 5
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className='flex items-center'>
                      <FaTrophy
                        className={`w-4 h-4 mr-2 ${
                          summary.totalSavedItems >= 5
                            ? "text-emerald-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          summary.totalSavedItems >= 5
                            ? "text-emerald-700"
                            : "text-gray-500"
                        }`}
                      >
                        5+ Items Reused
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg border ${
                      summary.totalEnvironmentalImpact >= 50
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className='flex items-center'>
                      <FaTrophy
                        className={`w-4 h-4 mr-2 ${
                          summary.totalEnvironmentalImpact >= 50
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          summary.totalEnvironmentalImpact >= 50
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        50+ Impact Points
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg border ${
                      summary.totalSavedWeight >= 1
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className='flex items-center'>
                      <FaTrophy
                        className={`w-4 h-4 mr-2 ${
                          summary.totalSavedWeight >= 1
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          summary.totalSavedWeight >= 1
                            ? "text-blue-700"
                            : "text-gray-500"
                        }`}
                      >
                        1+ kg Materials Saved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Visualization */}
            <div className='flex flex-col'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                Your Contribution Visualization
              </h2>

              {/* Circular Progress */}
              <div className='flex flex-col items-center justify-center flex-1'>
                <div className='relative w-48 h-48 mb-4'>
                  <svg className='w-full h-full' viewBox='0 0 100 100'>
                    <circle
                      cx='50'
                      cy='50'
                      r='45'
                      fill='none'
                      stroke='#f0f0f0'
                      strokeWidth='8'
                    />
                    <circle
                      cx='50'
                      cy='50'
                      r='45'
                      fill='none'
                      stroke={
                        activeMetric === "weight"
                          ? "#10b981"
                          : activeMetric === "items"
                          ? "#8b5cf6"
                          : "#22c55e"
                      }
                      strokeWidth='8'
                      strokeDasharray='283'
                      strokeDashoffset={283 - (283 * activeProgressValue) / 100}
                      strokeLinecap='round'
                      transform='rotate(-90 50 50)'
                    />
                    <text
                      x='50'
                      y='45'
                      textAnchor='middle'
                      fontSize='16'
                      fontWeight='bold'
                      fill='#374151'
                    >
                      {activeMetricData.value}
                    </text>
                    <text
                      x='50'
                      y='62'
                      textAnchor='middle'
                      fontSize='10'
                      fill='#6b7280'
                    >
                      {activeMetricData.unit}
                    </text>
                  </svg>
                </div>

                {/* Metric Selector */}
                <div className='flex space-x-2 mb-4'>
                  <button
                    onClick={() => setActiveMetric("impact")}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                      activeMetric === "impact"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaLeaf className='w-3 h-3 mr-1' /> Impact
                  </button>
                  <button
                    onClick={() => setActiveMetric("items")}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                      activeMetric === "items"
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaRecycle className='w-3 h-3 mr-1' /> Items
                  </button>
                  <button
                    onClick={() => setActiveMetric("weight")}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                      activeMetric === "weight"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaBox className='w-3 h-3 mr-1' /> Weight
                  </button>
                </div>

                {/* Key Stats */}
                <div className='space-y-3 w-full max-w-xs'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>
                      Your Sustainability Rank
                    </span>
                    <span className='font-semibold text-amber-700 flex items-center'>
                      #{userRanking}{" "}
                      <FaTrophy className='w-3 h-3 ml-1 text-amber-500' />
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>
                      Avg. Items per Project
                    </span>
                    <span className='font-semibold text-blue-700'>
                      {avgItemsPerProject}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>
                      Materials Saved per Project
                    </span>
                    <span className='font-semibold text-emerald-700'>
                      {summary.totalPostsCompleted > 0
                        ? (
                            summary.totalSavedWeight /
                            summary.totalPostsCompleted
                          ).toFixed(1)
                        : "0"}{" "}
                      kg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className='mb-8 p-6 bg-white rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
            <MdTrendingUp className='mr-2 text-blue-600' /> Your Recent Projects
          </h2>

          {recentProjects.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className='p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow'
                >
                  <h3 className='font-medium text-lg text-gray-800 mb-2'>
                    {project.title}
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>
                        Environmental Impact
                      </span>
                      <span className='font-medium text-green-700 flex items-center'>
                        {project.impact} <FaLeaf className='w-3 h-3 ml-1' />
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>
                        Items Reused
                      </span>
                      <span className='font-medium text-purple-700'>
                        {project.itemCount}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Completed</span>
                      <span className='text-xs text-gray-500'>
                        {project.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-600'>
              No projects completed yet. Start your first DIY project!
            </p>
          )}
        </div>

        {/* Material Breakdown */}
        <div className='mb-8 p-6 bg-white rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Material Breakdown
          </h2>

          {summary.materialBreakdown.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Material
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Category
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Items Reused
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Amount
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Environmental Impact
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {summary.materialBreakdown.map((material) => (
                    <tr key={material.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-3 text-sm text-gray-800'>
                        {material.name}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-600'>
                        {material.category}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-800'>
                        {material.savedCount}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-800'>
                        {material.standardAmount} {material.displayUnit}
                      </td>
                      <td className='px-4 py-3 text-sm text-green-700 font-medium'>
                        {material.totalEnvironmentalImpact} points
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-gray-600'>
              No materials saved yet. Start your first project!
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className='p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>
            Next Steps for Your Sustainability Journey
          </h2>
          <ul className='space-y-2'>
            <li className='flex items-start'>
              <div className='flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5'>
                <span className='text-green-600 text-xs font-bold'>1</span>
              </div>
              <span className='text-gray-700'>
                Complete more DIY projects to increase your environmental
                impact.
              </span>
            </li>
            <li className='flex items-start'>
              <div className='flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5'>
                <span className='text-green-600 text-xs font-bold'>2</span>
              </div>
              <span className='text-gray-700'>
                Try using different materials to diversify your sustainability
                portfolio.
              </span>
            </li>
            <li className='flex items-start'>
              <div className='flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5'>
                <span className='text-green-600 text-xs font-bold'>3</span>
              </div>
              <span className='text-gray-700'>
                Share your projects with friends to inspire others to join the
                sustainability movement.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
