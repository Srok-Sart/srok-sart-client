"use client";
import React, { useEffect, useState } from "react";
import { Material } from "../../../interfaces/material";
import { MaterialCategory } from "@/enums/material-category.enum";
import { MaterialUnit } from "@/enums/material-unit.enum";
import { MaterialFormFields } from "./material-form";
import { useMaterialUpdate } from "@/hooks/use-material-update";

interface EditMaterialProps {
  setShowEditMaterial: (show: boolean) => void;
  onUpdateMaterial: (material: Material) => void;
  id: number;
  token: string; // Add token to props
}

const EditMaterial = ({ 
  setShowEditMaterial, 
  onUpdateMaterial, 
  id, 
  token 
}: EditMaterialProps) => {
  const [material, setMaterial] = useState<Material | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { isLoading, error, handleMaterialUpdate } = useMaterialUpdate({
    onUpdateMaterial,
    setShowEditMaterial,
    token, // Pass token to hook
  });

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Unauthorized: Please log in again');
          }
          throw new Error(`Failed to fetch material: ${res.statusText}`);
        }

        const data = await res.json();
        setMaterial(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error fetching material";
        setFetchError(errorMessage);
        console.error("Fetch error:", error);
      }
    };

    if (token) {
      fetchMaterial();
    } else {
      setFetchError("Authentication token is missing");
    }
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material) return;

    await handleMaterialUpdate(material, id);
  };

  if (fetchError) {
    return (
      <div className="p-4">
        <div className="text-red-500">
          {fetchError.includes('Unauthorized') 
            ? 'Your session has expired. Please log in again.'
            : fetchError}
        </div>
      </div>
    );
  }

  if (!material) return <div className="p-4">Loading material...</div>;

  const isFormValid = material.name && material.weightPerUnit && material.environmentalImpact && material.category && material.unit;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Material</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <MaterialFormFields
          name={material.name}
          weightPerUnit={material.weightPerUnit || ""}
          environmentalImpact={material.environmentalImpact || 0}
          category={material.category || ""}
          unit={material.unit || ""}
          onNameChange={(value) => setMaterial({ ...material, name: value })}
          onWeightPerUnitChange={(value) => setMaterial({ ...material, weightPerUnit: value })}
          onEnvironmentalImpactChange={(value) => setMaterial({ ...material, environmentalImpact: value })}
          onCategoryChange={(value) => setMaterial({ ...material, category: value as MaterialCategory })}
          onUnitChange={(value) => setMaterial({ ...material, unit: value as MaterialUnit })}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowEditMaterial(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:bg-gray-400"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Updating..." : "Update Material"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMaterial;