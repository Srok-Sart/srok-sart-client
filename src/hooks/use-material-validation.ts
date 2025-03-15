import { useState } from 'react';
import { MaterialCategory } from '@/enums/material-category.enum';
import { MaterialUnit } from '@/enums/material-unit.enum';

interface ValidationFields {
  name: string;
  category: MaterialCategory | string;
  weightPerUnit: string;
  unit: MaterialUnit | string;
  environmentalImpact: number;
}

export const useMaterialValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (fields: ValidationFields): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!fields.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!fields.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!fields.weightPerUnit) {
      newErrors.weightPerUnit = 'Weight per unit is required';
    } else if (isNaN(parseFloat(fields.weightPerUnit))) {
      newErrors.weightPerUnit = 'Weight must be a valid number';
    }

    if (!fields.unit) {
      newErrors.unit = 'Unit is required';
    }

    if (!fields.environmentalImpact) {
      newErrors.environmentalImpact = 'Environmental impact is required';
    } else if (fields.environmentalImpact < 1 || fields.environmentalImpact > 10) {
      newErrors.environmentalImpact = 'Environmental impact must be between 1 and 10';
    }

    setErrors(newErrors);
    setSubmitted(true);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
    setSubmitted(false);
  };

  return {
    errors,
    submitted,
    validateForm,
    clearErrors,
    setFieldError: (field: string, message: string) => 
      setErrors(prev => ({ ...prev, [field]: message })),
  };
};