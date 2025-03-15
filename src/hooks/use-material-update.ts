import { useState } from "react";
import { Material } from "../app/interfaces/material";

interface UseMaterialUpdateProps {
  onUpdateMaterial: (material: Material) => void;
  setShowEditMaterial: (show: boolean) => void;
  token: string;
}

export const useMaterialUpdate = ({ 
  onUpdateMaterial, 
  setShowEditMaterial,
  token 
}: UseMaterialUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMaterialUpdate = async (
    material: Material, 
    id: number
  ) => {
    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedMaterial = {
        name: material.name,
        weightPerUnit: parseFloat(material.weightPerUnit),
        environmentalImpact: material.environmentalImpact,
        category: material.category,
        unit: material.unit,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedMaterial),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        }
        const errorText = await res.text();
        throw new Error(`Failed to update material: ${errorText}`);
      }

      const updatedMaterialData = await res.json();
      onUpdateMaterial(updatedMaterialData);
      setShowEditMaterial(false);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error updating material. Please try again.";
      setError(errorMessage);
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