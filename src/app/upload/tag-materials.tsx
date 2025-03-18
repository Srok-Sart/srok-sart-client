/* eslint-disable @typescript-eslint/no-explicit-any */
import { Material, PostMaterial } from "@/app/interfaces/material";
import React from "react";
import Select from "react-select";

interface TagsMaterialsProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  materials: Material[];
  selectedMaterials: PostMaterial[];
  onMaterialsChange: (selectedMaterials: PostMaterial[]) => void;
  errors?: {
    materials?: string;
    tags?: string;
  };
}

const TagsMaterials: React.FC<TagsMaterialsProps> = ({
  selectedTags,
  toggleTag,
  materials,
  selectedMaterials,
  onMaterialsChange,
  errors,
}) => {
  const tags: string[] = [
    "Kids & Families",
    "All Age",
    "DIY Lover",
    "Trending",
  ];

  const handleMaterialsChange = (selectedOptions: any) => {
    const selectedMaterialObjects = selectedOptions.map((option: any) => {
      const material = materials.find((m) => m.id.toString() === option.value);
      const existingMaterial = selectedMaterials.find(
        (m) => m.materialId.toString() === option.value
      );

      return {
        materialId: material?.id || parseInt(option.value),
        material,
        quantityRequired: existingMaterial?.quantityRequired || 1,
      };
    });
    onMaterialsChange(selectedMaterialObjects);
  };

  const handleQuantityChange = (materialId: number, quantity: number) => {
    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.materialId === materialId) {
        return { ...material, quantityRequired: quantity };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const increaseQuantity = (materialId: number) => {
    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.materialId === materialId) {
        const currentQuantity = material.quantityRequired || 1;
        return { ...material, quantityRequired: currentQuantity + 1 };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const decreaseQuantity = (materialId: number) => {
    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.materialId === materialId) {
        const currentQuantity = material.quantityRequired || 1;
        return {
          ...material,
          quantityRequired: Math.max(1, currentQuantity - 1),
        };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const materialOptions = materials.map((material) => ({
    value: material.id.toString(),
    label: material.name,
  }));

  const selectedMaterialOptions = selectedMaterials.map((material) => ({
    value: material.materialId.toString(),
    label:
      material.material?.name ||
      materials.find((m) => m.id === material.materialId)?.name ||
      "Unknown",
  }));

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused
        ? "var(--primary-color)"
        : provided.borderColor,
      boxShadow: state.isFocused
        ? "0 0 0 1px var(--primary-color)"
        : provided.boxShadow,
      "&:hover": {
        borderColor: state.isFocused
          ? "var(--primary-color)"
          : provided.borderColor,
      },
    }),
  };

  return (
    <>
      <div className='mb-4'>
        <label className='block text-gray-800 font-medium'>
          Tags <span className='text-red-500'>*</span>
        </label>
        <div className='flex flex-wrap gap-3'>
          {tags.map((tag) => (
            <button
              type='button'
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        {errors?.tags && (
          <p className='text-red-500 text-sm mt-1'>{errors.tags}</p>
        )}
      </div>

      <div className='mb-4'>
        <label className='block text-gray-800 font-medium'>
          Required Materials <span className='text-red-500'>*</span>
        </label>
        <Select
          isMulti
          value={selectedMaterialOptions}
          onChange={handleMaterialsChange}
          options={materialOptions}
          styles={customStyles}
          className={`w-full ${
            errors?.materials ? "border-red-500 rounded-md" : ""
          }`}
          classNamePrefix='react-select'
          placeholder='Select materials needed for this project...'
        />
        {errors?.materials && (
          <p className='text-red-500 text-sm mt-1'>{errors.materials}</p>
        )}

        {selectedMaterials.length > 0 && (
          <div className='mt-2'>
            <h3 className='text-sm font-medium mb-2'>Material Quantities:</h3>
            <div className='space-y-2'>
              {selectedMaterials.map((material, index) => (
                <div key={index} className='flex items-center'>
                  <span className='flex-grow'>
                    {material.material?.name ||
                      materials.find((m) => m.id === material.materialId)
                        ?.name ||
                      "Unknown"}
                    :
                  </span>
                  <div className='flex items-center ml-2'>
                    <button
                      type='button'
                      onClick={() => decreaseQuantity(material.materialId)}
                      className='px-2 py-1 bg-[var(--primary-color)] text-white rounded-l-md hover:bg-opacity-80 focus:outline-none'
                      aria-label='Decrease quantity'
                    >
                      -
                    </button>
                    <input
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      value={material.quantityRequired || 1}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, "");
                        handleQuantityChange(
                          material.materialId,
                          parseInt(value) || 1
                        );
                      }}
                      placeholder='1'
                      className='w-12 px-2 py-1 border-t border-b border-gray-300 text-center'
                    />
                    <button
                      type='button'
                      onClick={() => increaseQuantity(material.materialId)}
                      className='px-2 py-1 bg-[var(--primary-color)] text-white rounded-r-md hover:bg-opacity-80 focus:outline-none'
                      aria-label='Increase quantity'
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className='text-xs text-gray-500 mt-1'>
              Use the +/- buttons to adjust quantities or enter a value
              directly.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TagsMaterials;
