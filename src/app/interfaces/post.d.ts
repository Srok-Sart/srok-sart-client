import { PostType } from '../enums/post-type.enum';
import { PostDifficulty } from '../enums/post-difficulty.enum';
import { Material } from './material';
export interface Post {
  id: number;
  title: string;
  description?: string;
  postDifficulty?: PostDifficulty;
  postType?: PostType;
  imageUrls: string[];
  thumbnailUrl: string;
  postStatus: string;
  materials: Material[];
  estimatedTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FileOrUrl = File | string;