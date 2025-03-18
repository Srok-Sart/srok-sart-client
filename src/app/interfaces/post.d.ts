import { PostDifficulty } from "../enums/post-difficulty.enum";
import { PostType } from "../enums/post-type.enum";

export interface PaginationPost {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface Post {
  id: number;
  title: string;
  description?: string;
  postDifficulty?: PostDifficulty;
  completionCount: number;
  postType?: PostType;
  imageUrls: string[];
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  postStatus: string;
  postMaterials?: PostMaterial[];
  estimatedTime: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  user?: User;
}

export type FileOrUrl = File | string;
