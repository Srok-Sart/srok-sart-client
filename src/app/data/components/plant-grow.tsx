"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/api/use-fetcher";
import TreePanel from "./tree-panel";
import MaterialsPanel from "./materials-panel";

// ─── ENUMS, INTERFACES & HELPER ─────────────────────────────
// MaterialUnit enum and interfaces used across components
export enum MaterialUnit {
  KG = "KG",
  G = "G",
  L = "L",
  ML = "ML",
  PIECE = "PIECE",
  PACK = "PACK",
  BOTTLE = "BOTTLE",
  SPOON = "SPOON",
}

export interface MaterialBreakdown {
  id: number;
  name: string;
  amount: number;
  unit: MaterialUnit;
  category: string;
  environmentalImpact: number;
  savedCount: number;
  displayUnit?: MaterialUnit; // for display purposes only
}

export interface MaterialSummary {
  totalWeight: number;
  totalMaterialCount: number;
  totalPostsCompleted: number;
  materialBreakdown: MaterialBreakdown[];
}

// Helper function to format unit display strings
export const formatUnitDisplay = (unit: string, includeType = false): string => {
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

// ─── PLANTGROW COMPONENT ────────────────────────────────────
// This component fetches the material data, calculates progress, and renders both panels.
const PlantGrow = () => {
  const [materialData, setMaterialData] = useState<MaterialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"weight" | "count" | "impact">("weight");
  const [activeUnitFilter, setActiveUnitFilter] = useState<"all" | "weight" | "volume" | "count">("all");

  // Define target values
  const maxWeight = 500; // kg target
  const maxCount = 100;  // items target
  const maxPosts = 50;   // DIY posts target

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const data = await fetcher<MaterialSummary>("/posts/saved-materials");
        // Convert grams to kg when needed and recalc total weight
        const processedData = {
          ...data,
          materialBreakdown: data.materialBreakdown.map(material => {
            let adjustedAmount = material.amount;
            if (material.unit === MaterialUnit.G) {
              adjustedAmount = material.amount / 1000;
            }
            return { ...material, amount: adjustedAmount, displayUnit: material.unit };
          }),
        };

        const totalWeightInKg = processedData.materialBreakdown.reduce(
          (sum, material) => sum + material.amount,
          0
        );

        setMaterialData({ ...processedData, totalWeight: totalWeightInKg });
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

  // Calculate progress values based on active tab
  const weightProgress = Math.min(100, (materialData.totalWeight / maxWeight) * 100);
  const countProgress = Math.min(100, (materialData.totalMaterialCount / maxCount) * 100);
  const postsProgress = Math.min(100, (materialData.totalPostsCompleted / maxPosts) * 100);
  const activeProgress =
    activeTab === "weight" ? weightProgress : activeTab === "count" ? countProgress : postsProgress;

  return (
    <div className="w-full min-h-[480px] p-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8">
        <TreePanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          materialData={materialData}
          activeProgress={activeProgress}
          maxWeight={maxWeight}
          maxCount={maxCount}
          maxPosts={maxPosts}
        />
        <MaterialsPanel
          activeTab={activeTab}
          materialData={materialData}
          activeUnitFilter={activeUnitFilter}
          setActiveUnitFilter={setActiveUnitFilter}
        />
      </div>
    </div>
  );
};

export default PlantGrow;
