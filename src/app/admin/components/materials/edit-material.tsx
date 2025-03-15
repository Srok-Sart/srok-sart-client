"use client";
import React, { useEffect, useState } from "react";
import { Material } from "../../../interfaces/material";
import { MaterialCategory } from "@/enums/material-category.enum";
import { MaterialUnit } from "@/enums/material-unit.enum";
import { MaterialFormFields } from "./material-form";
import { useMaterialUpdate } from "@/hooks/use-material-update";
import { useMaterialValidation } from "@/hooks/use-material-validation";

interface EditMaterialProps {
  setShowEditMaterial: (show: boolean) => void;
  onUpdateMaterial: (material: Material) => void;
  id: number;
  token: string;
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
    token,
  });

  const { errors: validationErrors, validateForm, clearErrors } = useMaterialValidation();

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

    if (!validateForm(material)) {
      return;
    }

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

  const handleFieldUpdate = (field: keyof Material, value: string | number) => {
    setMaterial(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
    clearErrors();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Material</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <MaterialFormFields
          name={material.name}
          weightPerUnit={material.weightPerUnit || ""}
          environmentalImpact={material.environmentalImpact || 0}
          category={material.category || ""}
          unit={material.unit || ""}
          onNameChange={(value) => handleFieldUpdate('name', value)}
          onWeightPerUnitChange={(value) => handleFieldUpdate('weightPerUnit', value)}
          onEnvironmentalImpactChange={(value) => handleFieldUpdate('environmentalImpact', value)}
          onCategoryChange={(value) => handleFieldUpdate('category', value as MaterialCategory)}
          onUnitChange={(value) => handleFieldUpdate('unit', value as MaterialUnit)}
          errors={validationErrors}
        />

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => setShowEditMaterial(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Material"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMaterial;