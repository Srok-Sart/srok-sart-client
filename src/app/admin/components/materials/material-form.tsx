import React from 'react';
import { MaterialCategory } from '@/enums/material-category.enum';
import { MaterialUnit } from '@/enums/material-unit.enum';

interface MaterialFormFieldsProps {
  name: string;
  weightPerUnit: string;
  environmentalImpact: number;
  category: MaterialCategory | string;
  unit: MaterialUnit | string;
  onNameChange: (value: string) => void;
  onWeightPerUnitChange: (value: string) => void;
  onEnvironmentalImpactChange: (value: number) => void;
  onCategoryChange: (value: MaterialCategory | string) => void;
  onUnitChange: (value: MaterialUnit | string) => void;
  errors?: Record<string, string>;
}

export const MaterialFormFields = ({
  name,
  weightPerUnit,
  environmentalImpact,
  category,
  unit,
  onNameChange,
  onWeightPerUnitChange,
  onEnvironmentalImpactChange,
  onCategoryChange,
  onUnitChange,
  errors = {},
}: MaterialFormFieldsProps) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-700">Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
        required
      />
      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Category</label>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as MaterialCategory)}
        className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-500' : ''}`}
        required
      >
        <option value="">Select Category</option>
        {Object.values(MaterialCategory).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Weight Per Unit</label>
      <input
        type="text"
        value={weightPerUnit}
        onChange={(e) => onWeightPerUnitChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md ${errors.weightPerUnit ? 'border-red-500' : ''}`}
        required
      />
      {errors.weightPerUnit && <p className="text-red-500 text-sm mt-1">{errors.weightPerUnit}</p>}
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Unit</label>
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value as MaterialUnit)}
        className={`w-full px-3 py-2 border rounded-md ${errors.unit ? 'border-red-500' : ''}`}
        required
      >
        <option value="">Select Unit</option>
        {Object.values(MaterialUnit).map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
      {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Environmental Impact</label>
      <input
        type="number"
        value={environmentalImpact}
        onChange={(e) => onEnvironmentalImpactChange(Number(e.target.value))}
        className={`w-full px-3 py-2 border rounded-md ${errors.environmentalImpact ? 'border-red-500' : ''}`}
        required
        min={1}
      />
      {errors.environmentalImpact && <p className="text-red-500 text-sm mt-1">{errors.environmentalImpact}</p>}
    </div>
  </>
);