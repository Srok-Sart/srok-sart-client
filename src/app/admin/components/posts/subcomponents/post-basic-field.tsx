import { PostDifficulty } from '@/enums/post-difficulty.enum';
import { PostType } from '@/enums/post-type.enum';
import { Material, PostMaterial } from '@/app/interfaces/material';
import { PostMaterialsSelector } from './post-material-selector';

interface PostBasicFieldsProps {
    title: string;
    description: string;
    postDifficulty: PostDifficulty | string;
    postType: PostType | string;
    estimatedTime: string;
    timeUnit: 'minutes' | 'hours';
    materials: Material[];
    selectedMaterials: PostMaterial[];
    errors?: Record<string, string>;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDifficultyChange: (value: PostDifficulty | string) => void;
    onTypeChange: (value: PostType | string) => void;
    onEstimatedTimeChange: (value: string) => void;
    onTimeUnitChange: (value: 'minutes' | 'hours') => void;
    onMaterialsChange: (materials: PostMaterial[]) => void;
  }

export const PostBasicFields = ({
  title,
  description,
  postDifficulty,
  postType,
  estimatedTime,
  timeUnit,
  errors = {},
  materials,
  selectedMaterials,
  onTitleChange,
  onDescriptionChange,
  onDifficultyChange,
  onTypeChange,
  onEstimatedTimeChange,
  onTimeUnitChange,
  onMaterialsChange,
}: PostBasicFieldsProps) => {
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? 'border-red-500' : ''}`}
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
            className={`w-36 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary h-10 ${errors.estimatedTime ? 'border-red-500' : ''}`}
            aria-label="Estimated time value"
          />
          <select
            value={timeUnit}
            onChange={(e) => onTimeUnitChange(e.target.value as 'minutes' | 'hours')}
            className={`px-3 py-2 border-t border-r border-b rounded-r-md border-l-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary h-10 ${errors.estimatedTime ? 'border-red-500' : ''}`}
            aria-label="Time unit"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
        {errors.estimatedTime && <p className="text-red-500 text-sm mt-1">{errors.estimatedTime}</p>}
        <p className="text-xs text-gray-500 mt-1">Enter the estimated time as a number only.</p>
      </div>

      <PostMaterialsSelector
        materials={materials}
        selectedMaterials={selectedMaterials}
        errors={errors}
        onMaterialsChange={onMaterialsChange}
      />
      
      <div className="mb-4">
        <label className="block text-gray-700">
          Difficulty Level <span className="text-red-500">*</span>
        </label>
        <select
          value={postDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary ${errors.difficultyLevel ? 'border-red-500' : ''}`}
          aria-required="true"
        >
          <option value="">Select the difficulty level of your project</option>
          {Object.values(PostDifficulty).map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        {errors.difficultyLevel && <p className="text-red-500 text-sm mt-1">{errors.difficultyLevel}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          value={postType}
          onChange={(e) => onTypeChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary ${errors.type ? 'border-red-500' : ''}`}
          aria-required="true"
        >
          <option value="">Select the type of post</option>
          {Object.values(PostType).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
      </div>
    </>
  );
};