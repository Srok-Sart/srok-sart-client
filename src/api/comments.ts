import { fetcher } from "./use-fetcher";

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    profileImageUrl?: string;
  };
  post?: {
    id: number;
    title: string;
  };
}

export interface CreateCommentDto {
  content: string;
  postId: number;
}

export interface UpdateCommentDto {
  content: string;
}

/**
 * Creates a new comment on a post
 */
export const createComment = async (comment: CreateCommentDto, token: string): Promise<Comment> => {
  return fetcher<Comment>('/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(comment),
    credentials: 'include',
  });
};

/**
 * Fetches all comments
 */
export const getAllComments = async (token?: string): Promise<Comment[]> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetcher<Comment[]>(`/comments`, {
    headers,
    credentials: 'include',
  });
};

/**
 * Fetches a specific comment by ID
 */
export const getComment = async (commentId: number, token?: string): Promise<Comment> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetcher<Comment>(`/comments/${commentId}`, {
    headers,
    credentials: 'include',
  });
};

/**
 * Updates an existing comment
 */
export const updateComment = async (
  commentId: number, 
  updateDto: UpdateCommentDto, 
  token: string
): Promise<Comment> => {
  return fetcher<Comment>(`/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateDto),
    credentials: 'include',
  });
};

/**
 * Deletes a comment
 */
export const deleteComment = async (commentId: number, token: string): Promise<void> => {
  return fetcher<void>(`/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
};