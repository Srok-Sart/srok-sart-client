import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Material, PostMaterial } from '@/app/interfaces/material';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';

interface PostFormFieldsProps {
  title: string;
  description: string;
  postDifficulty: PostDifficulty | string;
  postType: PostType | string;
  estimatedTime: string;
  timeUnit?: 'minutes' | 'hours';
  materials: Material[];
  selectedMaterials: PostMaterial[];
  errors?: Record<string, string>;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDifficultyChange: (value: PostDifficulty) => void;
  onTypeChange: (value: PostType) => void;
  onEstimatedTimeChange: (value: string) => void;
  onTimeUnitChange?: (value: 'minutes' | 'hours') => void;
  onMaterialsChange: (selectedMaterials: PostMaterial[]) => void;
}

export const PostFormFields = ({
  title,
  description,
  postDifficulty,
  postType,
  estimatedTime,
  timeUnit = 'minutes',
  materials,
  selectedMaterials,
  errors = {},
  onTitleChange,
  onDescriptionChange,
  onDifficultyChange,
  onTypeChange,
  onEstimatedTimeChange,
  onTimeUnitChange = () => {},
  onMaterialsChange,
}: PostFormFieldsProps) => {
  const handleMaterialsChange = (selectedOptions: any) => {
    const selectedMaterialObjects = selectedOptions.map((option: any) => {
      const material = materials.find(m => m.id.toString() === option.value);
      const existingMaterial = selectedMaterials.find(m => m.materialId.toString() === option.value);
      
      return {
        materialId: material?.id || parseInt(option.value),
        material,
        quantityRequired: existingMaterial?.quantityRequired || 1,
      };
    });
    onMaterialsChange(selectedMaterialObjects);
  };

  const handleQuantityChange = (materialId: number, quantity: number) => {
    const updatedMaterials = selectedMaterials.map(material => {
      if (material.materialId === materialId) {
        return { ...material, quantityRequired: quantity };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const increaseQuantity = (materialId: number) => {
    const updatedMaterials = selectedMaterials.map(material => {
      if (material.materialId === materialId) {
        const currentQuantity = material.quantityRequired || 1;
        return { ...material, quantityRequired: currentQuantity + 1 };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const decreaseQuantity = (materialId: number) => {
    const updatedMaterials = selectedMaterials.map(material => {
      if (material.materialId === materialId) {
        const currentQuantity = material.quantityRequired || 1;
        return { ...material, quantityRequired: Math.max(1, currentQuantity - 1) };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const materialOptions = materials.map(material => ({
    value: material.id.toString(),
    label: material.name,
  }));

  const selectedMaterialOptions = selectedMaterials.map(material => ({
    value: material.materialId.toString(),
    label: material.material?.name || materials.find(m => m.id === material.materialId)?.name || 'Unknown',
  }));

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? 'purple' : provided.borderColor,
      boxShadow: state.isFocused ? '0 0 0 1px purple' : provided.boxShadow,
      '&:hover': {
        borderColor: state.isFocused ? 'purple' : provided.borderColor,
      },
    }),
  };

  // Handle plain text input for estimated time - without units
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^\d]/g, '');
    onEstimatedTimeChange(value);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a descriptive title (e.g., 'DIY Garden Planter Box')"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your post in detail. Include any instructions, tips, or important information."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Estimated Time</label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={estimatedTime}
            onChange={handleTimeInputChange}
            placeholder="Enter time value"
            className="w-36 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary h-10"
            aria-label="Estimated time value"
          />
          <select
            value={timeUnit}
            onChange={(e) => onTimeUnitChange(e.target.value as 'minutes' | 'hours')}
            className="px-3 py-2 border-t border-r border-b rounded-r-md border-l-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary h-10"
            aria-label="Time unit"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">Enter the estimated time as a number only.</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">
          Materials <span className="text-red-500">*</span>
        </label>
        <Select
          isMulti
          value={selectedMaterialOptions}
          onChange={handleMaterialsChange}
          options={materialOptions}
          styles={customStyles}
          className={`w-full ${errors.materials ? 'border-red-500 rounded-md' : ''}`}
          classNamePrefix="react-select"
          placeholder="Select materials needed for this project..."
        />
        {errors.materials && <p className="text-red-500 text-sm mt-1">{errors.materials}</p>}
        
        {selectedMaterials.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-medium mb-2">Material Quantities:</h3>
            <div className="space-y-2">
              {selectedMaterials.map((material, index) => (
                <div key={index} className="flex items-center">
                  <span className="flex-grow">
                    {material.material?.name || 
                     materials.find(m => m.id === material.materialId)?.name || 
                     'Unknown'}:
                  </span>
                  <div className="flex items-center ml-2">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(material.materialId)}
                      className="px-2 py-1 bg-primary text-white rounded-l-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={material.quantityRequired || 1}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        handleQuantityChange(material.materialId, parseInt(value) || 1);
                      }}
                      placeholder="1"
                      className="w-12 px-2 py-1 border-t border-b border-gray-300 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => increaseQuantity(material.materialId)}
                      className="px-2 py-1 bg-primary text-white rounded-r-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Use the +/- buttons to adjust quantities or enter a value directly.</p>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">
          Difficulty Level <span className="text-red-500">*</span>
        </label>
        <select
          value={postDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value as PostDifficulty)}
          className={`w-full px-3 py-2 border rounded-md ${errors.postDifficulty ? 'border-red-500' : ''} h-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary`}
        >
          <option value="">Select the difficulty level of your project</option>
          {Object.values(PostDifficulty).map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        {errors.postDifficulty && <p className="text-red-500 text-sm mt-1">{errors.postDifficulty}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          value={postType}
          onChange={(e) => onTypeChange(e.target.value as PostType)}
          className={`w-full px-3 py-2 border rounded-md ${errors.postType ? 'border-red-500' : ''} h-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary`}
        >
          <option value="">Select the type of post</option>
          {Object.values(PostType).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.postType && <p className="text-red-500 text-sm mt-1">{errors.postType}</p>}
      </div>
    </>
  );
};