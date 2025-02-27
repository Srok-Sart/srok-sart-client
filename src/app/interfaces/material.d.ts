import { MaterialCategory } from '../enums/material-category.enum';
import { MaterialUnit } from '../enums/material-unit.enum';

export interface Material {
  id: number;
  name: string;
  weightPerUnit: string;
  environmentalImpact: number;
  category: MaterialCategory;
  unit: MaterialUnit;
  createdAt: Date;
  updatedAt: Date;
}