import { useRouter } from "next/navigation";

interface ButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: ButtonProps) {
  return (
    <button
      type='submit'
      className='w-full p-3 bg-primary text-white rounded-lg hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed'
      disabled={isLoading}
    >
      {isLoading ? "Registering..." : "Register"}
    </button>
  );
}

export function LoginLink({ isLoading }: ButtonProps) {
  const router = useRouter();

  return (
    <p className='text-center text-sm text-gray-600 mt-4'>
      Already have an account?{" "}
      <button
        type='button'
        onClick={() => router.push("/login")}
        className='text-primary hover:underline disabled:opacity-50'
        disabled={isLoading}
      >
        Login
      </button>
    </p>
  );
}
