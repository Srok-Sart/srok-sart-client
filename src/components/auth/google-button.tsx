import Image from "next/image";
import { useEffect, useState } from "react";

interface GoogleProps {
  isLoading: boolean;
  onLoginSuccess?: () => void;
}

export function GoogleButton({ isLoading, onLoginSuccess }: GoogleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for token in URL params on component mount
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store token
      setAuthToken(token);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Notify parent component if callback provided
      onLoginSuccess?.();
    }
  }, [onLoginSuccess]);

  const handleGoogleLogin = () => {
    const GOOGLE_LOGIN_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
    window.location.href = GOOGLE_LOGIN_URL;
  };

  if (!mounted) return null;

  return (
    <button
      type='button'
      onClick={handleGoogleLogin}
      className='flex w-full items-center justify-center space-x-3 border py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50'
      disabled={isLoading}
    >
      <div className='relative h-5 w-5'>
        <Image
          src='/google.svg'
          alt='Google Logo'
          fill
          sizes='20px'
          className='object-contain'
          priority
        />
      </div>
      <span className='text-gray-700'>Register with Google</span>
    </button>
  );
}

// utils/auth.ts
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};
