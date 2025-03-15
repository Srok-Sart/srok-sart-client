import { Material } from "@/app/interfaces/material";
import { MaterialFormFields } from './material-form';
import { useMaterialSubmission } from '@/hooks/use-material-submission';

type AddNewMaterialProps = {
  setShowAddNewMaterial: (show: boolean) => void;
  onAddNewMaterial: (material: Material) => void;
  token: string;
};

const AddNewMaterial = ({ setShowAddNewMaterial, onAddNewMaterial, token }: AddNewMaterialProps) => {
  const {
    formState: { name, weightPerUnit, environmentalImpact, category, unit },
    updateField,
    handleSubmit,
    isLoading,
    error,
    validationErrors,
  } = useMaterialSubmission({
    onAddNewMaterial,
    setShowAddNewMaterial,
    token,
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Material</h2>
      {error && (
        <div className="text-red-500 mb-4">
          {error.includes('Unauthorized') 
            ? 'Your session has expired. Please log in again.'
            : error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <MaterialFormFields
          name={name}
          weightPerUnit={weightPerUnit}
          environmentalImpact={environmentalImpact}
          category={category}
          unit={unit}
          onNameChange={(value) => updateField('name', value)}
          onWeightPerUnitChange={(value) => updateField('weightPerUnit', value)}
          onEnvironmentalImpactChange={(value) => updateField('environmentalImpact', value)}
          onCategoryChange={(value) => updateField('category', value)}
          onUnitChange={(value) => updateField('unit', value)}
          errors={validationErrors}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowAddNewMaterial(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
          >
            {isLoading ? "Submitting..." : "Add Material"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewMaterial;