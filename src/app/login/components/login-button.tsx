import { useRouter } from "next/navigation";

interface ButtonProps {
  isLoading: boolean;
}

export function ForgotPassword({ disabled }: { disabled: boolean }) {
  const router = useRouter();

  return (
    <div className='text-right'>
      <button
        type='button'
        onClick={() => router.push("/forgot-password")}
        className='text-sm text-gray-600 hover:text-primary'
        disabled={disabled}
      >
        Forgot password?
      </button>
    </div>
  );
}

export function SubmitButton({ isLoading }: ButtonProps) {
  return (
    <button
      type='submit'
      className='w-full p-3 bg-primary text-white rounded-lg hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed'
      disabled={isLoading}
    >
      {isLoading ? "Logging in..." : "Login"}
    </button>
  );
}

export function CreateAccount({ isLoading }: ButtonProps) {
  const router = useRouter();

  return (
    <p className='text-center text-sm text-gray-600 mt-4'>
      Dont have an account?{" "}
      <button
        type='button'
        onClick={() => router.push("/register")}
        className='text-primary hover:underline disabled:opacity-50'
        disabled={isLoading}
      >
        Create Account
      </button>
    </p>
  );
}
