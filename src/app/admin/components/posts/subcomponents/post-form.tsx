import { Material, PostMaterial } from '@/app/interfaces/material';
import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';
import { PostBasicFields } from './post-basic-field';

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
  onDifficultyChange: (value: PostDifficulty | string) => void;  // Updated to accept string
  onTypeChange: (value: PostType | string) => void;  // Updated to accept string
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
  
  // Create handler adapters that accept string values but pass them correctly to parent handlers
  const handleDifficultyChange = (value: PostDifficulty | string) => {
    // Convert to proper enum if needed
    if (Object.values(PostDifficulty).includes(value as PostDifficulty)) {
      onDifficultyChange(value as PostDifficulty);
    } else {
      onDifficultyChange(value);
    }
  };

  const handleTypeChange = (value: PostType | string) => {
    // Convert to proper enum if needed
    if (Object.values(PostType).includes(value as PostType)) {
      onTypeChange(value as PostType);
    } else {
      onTypeChange(value);
    }
  };

  return (
    <>
      <PostBasicFields
        title={title}
        description={description}
        postDifficulty={postDifficulty}
        postType={postType}
        estimatedTime={estimatedTime}
        timeUnit={timeUnit}
        materials={materials}
        selectedMaterials={selectedMaterials}
        errors={errors}
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
        onDifficultyChange={handleDifficultyChange}
        onTypeChange={handleTypeChange}
        onEstimatedTimeChange={onEstimatedTimeChange}
        onTimeUnitChange={onTimeUnitChange}
        onMaterialsChange={onMaterialsChange}
      />
    </>
  );
};