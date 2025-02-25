import { useState } from "react";
import { Material } from "../app/interfaces/material";
import { MaterialCategory } from "@/enums/material-category.enum";
import { MaterialUnit } from "@/enums/material-unit.enum";

interface UseMaterialSubmissionProps {
  onAddNewMaterial: (material: Material) => void;
  setShowAddNewMaterial: (show: boolean) => void;
}

interface FormState {
  name: string;
  weightPerUnit: string;
  environmentalImpact: number;
  category: MaterialCategory | string;
  unit: MaterialUnit | string;
}

export const useMaterialSubmission = ({ onAddNewMaterial, setShowAddNewMaterial }: UseMaterialSubmissionProps) => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    weightPerUnit: "",
    environmentalImpact: 0,
    category: "",
    unit: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof FormState, value: string | number) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newMaterial = {
        ...formState,
        weightPerUnit: parseFloat(formState.weightPerUnit), // Convert weightPerUnit to a number
        category: formState.category as MaterialCategory,
        unit: formState.unit as MaterialUnit,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMaterial),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add material: ${errorText}`);
      }

      const addedMaterial = await res.json();
      onAddNewMaterial(addedMaterial);
      setShowAddNewMaterial(false);
    } catch (error) {
      setError("Error adding material. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formState.name && formState.weightPerUnit && formState.environmentalImpact && formState.category && formState.unit;

  return {
    formState,
    updateField,
    handleSubmit,
    isLoading,
    error,
    isFormValid,
  };
};