import { PostDifficulty } from "../enums/post-difficulty.enum";
import { PostType } from "../enums/post-type.enum";
import { Material } from "./material";

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
  postType?: PostType;
  imageUrls: string[];
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  postStatus: string;
  materials: Material[];
  estimatedTime: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
}

export type FileOrUrl = File | string;
