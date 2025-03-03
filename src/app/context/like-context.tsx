"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/api/get-user-profile";
import { clientFetcher } from "@/api/client-fetcher";

// Define types to match backend DTOs
interface PostLikeResponseDto {
  success: boolean;
  likeCount: number;
}

interface UserAuth {
  isAuthenticated: boolean;
  user?: any;
}

interface LikeState {
  likedPosts: Record<number, boolean>;
  likeCounts: Record<number, number>;
  likedPostIds: number[];
}

interface LikeContextType {
  likedPosts: Record<number, boolean>;
  likedPostIds: number[];
  isPostLiked: (postId: number) => boolean;
  toggleLike: (postId: number, currentCount: number) => Promise<{
    success: boolean;
    newCount: number;
  }>;
  getLikeCount: (postId: number, defaultCount: number) => number;
  checkIsLiked: (postId: number) => Promise<boolean>;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  refreshLikedPosts: () => Promise<void>;
}

// Actions
type LikeAction =
  | { type: "INITIALIZE"; payload: { likedPosts: Record<number, boolean>; likedPostIds: number[] } }
  | { type: "SET_LIKED_POST"; payload: { postId: number; isLiked: boolean } }
  | { type: "LIKE_POST"; payload: { postId: number; count: number } }
  | { type: "UNLIKE_POST"; payload: { postId: number; count: number } }
  | { type: "SET_LIKE_COUNT"; payload: { postId: number; count: number } };

// Initial state
const initialState: LikeState = {
  likedPosts: {},
  likeCounts: {},
  likedPostIds: []
};

// Reducer function
function likeReducer(state: LikeState, action: LikeAction): LikeState {
  switch (action.type) {
    case "INITIALIZE":
      const likedPostsMap: Record<number, boolean> = {};
      action.payload.likedPostIds.forEach(id => {
        likedPostsMap[id] = true;
      });
      
      return {
        ...state,
        likedPosts: likedPostsMap,
        likedPostIds: action.payload.likedPostIds
      };
    case "SET_LIKED_POST": 
      return {
        ...state,
        likedPosts: {
          ...state.likedPosts,
          [action.payload.postId]: action.payload.isLiked
        },
        likedPostIds: action.payload.isLiked 
          ? [...state.likedPostIds, action.payload.postId]
          : state.likedPostIds.filter(id => id !== action.payload.postId)
      };
    case "LIKE_POST":
      return {
        ...state,
        likedPosts: {
          ...state.likedPosts,
          [action.payload.postId]: true
        },
        likeCounts: {
          ...state.likeCounts,
          [action.payload.postId]: action.payload.count
        },
        likedPostIds: state.likedPostIds.includes(action.payload.postId)
          ? state.likedPostIds
          : [...state.likedPostIds, action.payload.postId]
      };
    case "UNLIKE_POST":
      return {
        ...state,
        likedPosts: {
          ...state.likedPosts,
          [action.payload.postId]: false
        },
        likeCounts: {
          ...state.likeCounts,
          [action.payload.postId]: action.payload.count
        },
        likedPostIds: state.likedPostIds.filter(id => id !== action.payload.postId)
      };
    case "SET_LIKE_COUNT":
      return {
        ...state,
        likeCounts: {
          ...state.likeCounts,
          [action.payload.postId]: action.payload.count
        }
      };
    default:
      return state;
  }
}

// Create context
const LikeContext = createContext<LikeContextType | undefined>(undefined);

// Safe localStorage access
const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

const LikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(likeReducer, initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Try to refresh the auth token
  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, 
        { 
          method: 'POST',
          credentials: 'include'
        }
      );
      
      return refreshResponse.ok;
    } catch (error) {
      console.error("Error refreshing auth token:", error);
      return false;
    }
  };

  // Handle authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthLoading(true);
        
        // First check if we have stored auth data
        const storedAuth = getLocalStorage('auth');
        if (storedAuth) {
          try {
            const parsedAuth = JSON.parse(storedAuth) as UserAuth;
            if (parsedAuth?.isAuthenticated && parsedAuth?.user) {
              setIsAuthenticated(true);
              setUserProfile(parsedAuth.user);
              await refreshLikedPosts();
              return;
            }
          } catch (e) {
            console.error("Error parsing stored auth:", e);
            removeLocalStorage('auth');
          }
        }
        
        // If not, check with the server
        try {
          const profile = await getUserProfile();
          if (profile && profile.id) {
            setIsAuthenticated(true);
            setUserProfile(profile);
            setLocalStorage('auth', JSON.stringify({
              isAuthenticated: true,
              user: profile
            }));
            await refreshLikedPosts();
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Don't redirect here, just set isAuthenticated to false
          setIsAuthenticated(false);
          removeLocalStorage('auth');
        }
      } finally {
        setIsAuthLoading(false);
      }
    };
    
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, []);

  const refreshLikedPosts = async () => {
    if (typeof window === 'undefined' || !isAuthenticated) return;
    
    try {
      try {
        const likedPostIds = await clientFetcher<number[]>('/posts/liked');
        dispatch({
          type: "INITIALIZE",
          payload: { likedPosts: {}, likedPostIds }
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('Authentication required')) {
          // Token might be expired, try refreshing
          const refreshSuccessful = await refreshAuthToken();
          
          if (refreshSuccessful) {
            // Try again after refresh
            const likedPostIds = await clientFetcher<number[]>('/posts/liked');
            dispatch({
              type: "INITIALIZE",
              payload: { likedPosts: {}, likedPostIds }
            });
          } else {
            // Refresh failed, user needs to login again
            setIsAuthenticated(false);
            removeLocalStorage('auth');
            // Don't redirect here
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  const isPostLiked = (postId: number): boolean => {
    return !!state.likedPosts[postId];
  };

  const checkIsLiked = async (postId: number): Promise<boolean> => {
    // First check local state
    if (state.likedPostIds.includes(postId)) return true;
    
    if (!isAuthenticated) return false;
    
    try {
      try {
        const data = await clientFetcher<{isLiked: boolean}>(`/posts/${postId}/liked`);
        
        // Update the state with this information
        dispatch({
          type: "SET_LIKED_POST",
          payload: { postId, isLiked: data.isLiked }
        });
        
        return data.isLiked;
      } catch (error) {
        if (error instanceof Error && error.message.includes('Authentication required')) {
          const refreshSuccessful = await refreshAuthToken();
          if (!refreshSuccessful) {
            setIsAuthenticated(false);
            removeLocalStorage('auth');
            return false;
          }
          
          // Try again after refresh
          const data = await clientFetcher<{isLiked: boolean}>(`/posts/${postId}/liked`);
          dispatch({
            type: "SET_LIKED_POST",
            payload: { postId, isLiked: data.isLiked }
          });
          return data.isLiked;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error checking if post is liked:", error);
      return false;
    }
  };

  // Get like count from state or fallback to default
  const getLikeCount = (postId: number, defaultCount: number): number => {
    return state.likeCounts[postId] !== undefined 
      ? state.likeCounts[postId]
      : defaultCount;
  };

  const toggleLike = async (postId: number, currentCount: number) => {
    // If not authenticated, return early instead of redirecting
    if (!isAuthenticated) {
      return {
        success: false,
        newCount: currentCount
      };
    }
    
    try {
      const isLiked = isPostLiked(postId);
      
      try {
        const data: PostLikeResponseDto = await clientFetcher<PostLikeResponseDto>(
          `/posts/${postId}/like`,
          { 
            method: isLiked ? 'DELETE' : 'POST'
          }
        );
        
        dispatch({
          type: isLiked ? "UNLIKE_POST" : "LIKE_POST",
          payload: { postId, count: data.likeCount }
        });
        
        return {
          success: data.success,
          newCount: data.likeCount
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes('Authentication required')) {
          // Try to refresh token
          const refreshSuccessful = await refreshAuthToken();
          if (!refreshSuccessful) {
            setIsAuthenticated(false);
            removeLocalStorage('auth');
            router.push('/login');
            return { success: false, newCount: currentCount };
          }
          
          // Try again after refresh
          return toggleLike(postId, currentCount);
        } else if (error instanceof Error && error.message.includes('409')) {
          // Conflict - user already liked/unliked the post
          await refreshLikedPosts();
        }
        throw error;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return {
        success: false,
        newCount: currentCount
      };
    }
  };

  // For server-side rendering, provide a fallback
  if (typeof window === 'undefined') {
    return (
      <LikeContext.Provider
        value={{
          likedPosts: {},
          likedPostIds: [],
          isPostLiked: () => false,
          toggleLike: async () => ({
            success: false,
            newCount: 0
          }),
          getLikeCount: () => 0,
          checkIsLiked: async () => false,
          isAuthenticated: false,
          isAuthLoading: true,
          refreshLikedPosts: async () => {}
        }}
      >
        {children}
      </LikeContext.Provider>
    );
  }

  return (
    <LikeContext.Provider
      value={{
        likedPosts: state.likedPosts,
        likedPostIds: state.likedPostIds,
        isPostLiked,
        toggleLike,
        getLikeCount,
        checkIsLiked,
        isAuthenticated,
        isAuthLoading,
        refreshLikedPosts
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

const useLikeContext = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLikeContext must be used within a LikeProvider');
  }
  return context;
};

export { LikeProvider, useLikeContext };