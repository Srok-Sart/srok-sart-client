/* eslint-disable @typescript-eslint/no-explicit-any */
import { Material, PostMaterial } from "@/app/interfaces/material";
import Select from "react-select";

interface PostMaterialsSelectorProps {
  materials: Material[];
  selectedMaterials: PostMaterial[];
  errors?: Record<string, string>;
  onMaterialsChange: (selectedMaterials: PostMaterial[]) => void;
}

export const PostMaterialsSelector = ({
  materials,
  selectedMaterials,
  errors = {},
  onMaterialsChange,
}: PostMaterialsSelectorProps) => {
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

  // Custom styles for react-select (removed focus styles)
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "purple" : provided.borderColor,
      boxShadow: "none", // Removed boxShadow
      "&:hover": {
        borderColor: state.isFocused ? "purple" : provided.borderColor,
      },
    }),
  };

  return (
    <div className='mb-4'>
      <label className='block text-gray-700'>
        Materials <span className='text-red-500'>*</span>
      </label>
      <Select
        isMulti
        value={selectedMaterialOptions}
        onChange={handleMaterialsChange}
        options={materialOptions}
        styles={customStyles}
        className={`w-full ${
          errors.materials ? "border-red-500 rounded-md" : ""
        }`}
        classNamePrefix='react-select'
        placeholder='Select materials needed for this project...'
      />
      {errors.materials && (
        <p className='text-red-500 text-sm mt-1'>{errors.materials}</p>
      )}

      {selectedMaterials.length > 0 && (
        <MaterialQuantityEditor
          materials={materials}
          selectedMaterials={selectedMaterials}
          onMaterialsChange={onMaterialsChange}
          maxQuantity={10}
        />
      )}
    </div>
  );
};

interface MaterialQuantityEditorProps {
  materials: Material[];
  selectedMaterials: PostMaterial[];
  onMaterialsChange: (selectedMaterials: PostMaterial[]) => void;
  maxQuantity?: number;
}

const MaterialQuantityEditor = ({
  materials,
  selectedMaterials,
  onMaterialsChange,
  maxQuantity = 10,
}: MaterialQuantityEditorProps) => {
  const handleQuantityChange = (materialId: number, quantity: number) => {
    // Ensure quantity doesn't exceed maxQuantity
    const limitedQuantity = Math.min(Math.max(1, quantity), maxQuantity);

    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.materialId === materialId) {
        return { ...material, quantityRequired: limitedQuantity };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const increaseQuantity = (materialId: number) => {
    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.materialId === materialId) {
        const currentQuantity = material.quantityRequired || 1;
        // Prevent increasing beyond maxQuantity
        return {
          ...material,
          quantityRequired: Math.min(currentQuantity + 1, maxQuantity),
        };
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

  return (
    <div className='mt-2'>
      <h3 className='text-sm font-medium mb-2'>Material Quantities:</h3>
      <div className='space-y-2'>
        {selectedMaterials.map((material, index) => (
          <div key={index} className='flex items-center'>
            <span className='flex-grow'>
              {material.material?.name ||
                materials.find((m) => m.id === material.materialId)?.name ||
                "Unknown"}
              :
            </span>
            <div className='flex items-center ml-2'>
              <button
                type='button'
                onClick={() => decreaseQuantity(material.materialId)}
                className='px-2 py-1 bg-primary text-white rounded-l-md hover:bg-primary/80'
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
                className={`px-2 py-1 bg-primary text-white rounded-r-md ${
                  (material.quantityRequired || 1) >= maxQuantity
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/80"
                }`}
                aria-label='Increase quantity'
                disabled={(material.quantityRequired || 1) >= maxQuantity}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className='text-xs text-gray-500 mt-1'>
        Use the +/- buttons to adjust quantities (max: {maxQuantity}) or enter a
        value directly.
      </p>
    </div>
  );
};
