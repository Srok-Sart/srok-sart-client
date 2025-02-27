import { useState } from "react";
import { Material } from "../app/interfaces/material";

interface UseMaterialUpdateProps {
  onUpdateMaterial: (material: Material) => void;
  setShowEditMaterial: (show: boolean) => void;
}

export const useMaterialUpdate = ({ onUpdateMaterial, setShowEditMaterial }: UseMaterialUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMaterialUpdate = async (
    material: Material, 
    id: number
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedMaterial = {
        name: material.name,
        weightPerUnit: parseFloat(material.weightPerUnit), // Convert weightPerUnit to a number
        environmentalImpact: material.environmentalImpact,
        category: material.category,
        unit: material.unit,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMaterial),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update material: ${errorText}`);
      }

      const updatedMaterialData = await res.json();
      onUpdateMaterial(updatedMaterialData);
      setShowEditMaterial(false);
    } catch (error) {
      setError("Error updating material. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleMaterialUpdate,
  };
};