"use client";

export const AUTH_COOKIE_NAME = "accessToken";

export const getClientAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!tokenCookie) return null;
  
  return tokenCookie.split('=')[1].trim();
};

export const setClientAuthToken = (token: string): void => {
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; secure; samesite=strict`;
};

export const isClientAuthenticated = (): boolean => {
  const token = getClientAuthToken();
  console.log('Authentication check - Token exists:', !!token);
  return !!token;
};

export const clearClientAuthToken = (): void => {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};