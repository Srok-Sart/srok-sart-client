import { Post } from "./post";
import { User } from "./user"; // Make sure you have a User interface

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  postBookmarks?: PostBookmark[];
  createdAt: string;
  updatedAt: string;
  _user?: User;
  isDefault?: boolean; 
  saved?: number; 
  color?: string; 
}

export interface PaginationBookmarkCollection {
  data: BookmarkCollection[];
  total: number;
  page: number;
  limit: number;
}

export interface PostBookmark {
  id: number;
  post: Post;
  collection: BookmarkCollection;
  createdAt: string;
  updatedAt: string;
}