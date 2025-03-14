import { useState } from "react";
import { Material } from "../app/interfaces/material";
import { MaterialCategory } from "@/enums/material-category.enum";
import { MaterialUnit } from "@/enums/material-unit.enum";

interface UseMaterialSubmissionProps {
  onAddNewMaterial: (material: Material) => void;
  setShowAddNewMaterial: (show: boolean) => void;
  token: string;
}

interface FormState {
  name: string;
  weightPerUnit: string;
  environmentalImpact: number;
  category: MaterialCategory | string;
  unit: MaterialUnit | string;
}

export const useMaterialSubmission = ({ onAddNewMaterial, setShowAddNewMaterial, token }: UseMaterialSubmissionProps) => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    weightPerUnit: "",
    environmentalImpact: 1,
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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formState.name.trim()) {
      errors.name = "Material name is required";
    }

    if (!formState.weightPerUnit) {
      errors.weightPerUnit = "Weight per unit is required";
    }

    if (!formState.environmentalImpact) {
      errors.environmentalImpact = "Environmental impact is required";
    }

    if (!formState.category) {
      errors.category = "Category is required";
    }

    if (!formState.unit) {
      errors.unit = "Unit is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newMaterial = {
        ...formState,
        weightPerUnit: parseFloat(formState.weightPerUnit),
        category: formState.category as MaterialCategory,
        unit: formState.unit as MaterialUnit,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newMaterial),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        }
        const errorText = await res.text();
        throw new Error(`Failed to add material: ${errorText}`);
      }

      const addedMaterial = await res.json();
      onAddNewMaterial(addedMaterial);
      setShowAddNewMaterial(false);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error adding material. Please try again.";
      setError(errorMessage);
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = Boolean(
    formState.name && 
    formState.weightPerUnit && 
    formState.environmentalImpact && 
    formState.category && 
    formState.unit
  );

  return {
    formState,
    updateField,
    handleSubmit,
    isLoading,
    error,
    validationErrors,
  };
};