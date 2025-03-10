"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getClientAuthToken, isClientAuthenticated } from '@/lib/client-auth';

interface LikeContextType {
  likedPosts: number[];
  isPostLiked: (postId: number) => boolean;
  toggleLike: (postId: number) => Promise<{ success: boolean; likeCount: number } | null>;
  isLoading: boolean;
  refreshLikedPosts: () => Promise<void>;
  isAuthenticated: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

interface LikeProviderProps {
  children: ReactNode;
}

export const LikeProvider: React.FC<LikeProviderProps> = ({ children }) => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check authentication status and token on mount and set up interval to check periodically
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isClientAuthenticated();
      const token = getClientAuthToken();
      
      if (authStatus !== isAuthenticated) {
        setIsAuthenticated(authStatus);
      }
      
      if (token !== accessToken) {
        setAccessToken(token);
      }
    };

    // Check immediately
    checkAuth();

    // Set up interval to check periodically
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken]);

  // Fetch liked posts when authentication status or token changes
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      console.log('User is authenticated with token, fetching liked posts');
      refreshLikedPosts();
    } else {
      console.log('User is not authenticated or no token available, clearing liked posts');
      setLikedPosts([]);
    }
  }, [isAuthenticated, accessToken]);

  const refreshLikedPosts = async (): Promise<void> => {
    const token = getClientAuthToken();
    console.log('refreshLikedPosts - Token exists:', !!token);
    console.log('Token value (first 10 chars):', token ? token.substring(0, 10) + '...' : 'none');
    
    if (!token) {
      console.log('No token available, cannot fetch liked posts');
      setLikedPosts([]);
      return;
    }

    try {
      console.log('Fetching liked posts from endpoint: /posts/liked');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      console.log('Base URL for API:', baseUrl);
      
      // Use direct fetch instead of clientFetcher for more control
      const response = await fetch(`${baseUrl}/posts/liked`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      console.log('Liked posts response status:', response.status);
      
      if (!response.ok) {
        console.error('Error fetching liked posts:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        setLikedPosts([]);
        return;
      }
      
      const posts = await response.json();
      console.log('Fetched liked posts:', posts);
      setLikedPosts(posts);
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
      // If there's an error (like unauthorized), clear the liked posts
      setLikedPosts([]);
    }
  };

  const isPostLiked = (postId: number): boolean => {
    return likedPosts.includes(postId);
  };

  const toggleLike = async (postId: number): Promise<{ success: boolean; likeCount: number } | null> => {
    // Get the latest token
    const token = getClientAuthToken();
    console.log('Toggle like - Token exists:', !!token);
    console.log('Token value (first 10 chars):', token ? token.substring(0, 10) + '...' : 'none');
    
    if (!token) {
      console.log('User not authenticated, cannot toggle like');
      return null;
    }

    setIsLoading(true);
    try {
      const isLiked = isPostLiked(postId);
      console.log('Current like status for post', postId, ':', isLiked);
      
      const endpoint = `/posts/${postId}/like`;
      const method = isLiked ? 'DELETE' : 'POST';
      console.log('Using method:', method, 'for endpoint:', endpoint);

      // Use a custom fetch to avoid the automatic redirect in clientFetcher
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      console.log('Base URL:', baseUrl);
      
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log('Full request URL:', fullUrl);
      console.log('Making request with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        
        // If unauthorized, update authentication state
        if (response.status === 401 || response.status === 403) {
          setIsAuthenticated(false);
          setAccessToken(null);
        }
        
        return null;
      }

      const result = await response.json();
      console.log('Toggle like result:', result);

      // Update the local state based on the result
      if (result.success) {
        if (isLiked) {
          console.log('Removing post', postId, 'from liked posts');
          setLikedPosts(prev => prev.filter(id => id !== postId));
        } else {
          console.log('Adding post', postId, 'to liked posts');
          setLikedPosts(prev => [...prev, postId]);
        }
      }

      return result;
    } catch (error) {
      console.error('Error toggling like:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    likedPosts,
    isPostLiked,
    toggleLike,
    isLoading,
    refreshLikedPosts,
    isAuthenticated,
  };

  return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>;
};

export const useLike = (): LikeContextType => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
};
