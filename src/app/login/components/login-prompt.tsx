"use client";

import { useRouter } from "next/navigation";

export default function LoginPrompt() {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center py-20 px-4 text-center'>
      <div className='bg-gray-50 p-10 rounded-lg shadow-sm max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-4'>
          Sign in to view your profile
        </h2>
        <p className='text-gray-600 mb-6'>
          Create an account or sign in to view and manage your profile.
        </p>
        <div className='space-y-3'>
          <button
            onClick={() => router.push("/login")}
            className='w-full px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90'
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/register")}
            className='w-full px-6 py-3 rounded-full font-semibold border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-gray-50'
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
