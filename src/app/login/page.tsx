import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md md:max-w-lg bg-white p-8 shadow-lg rounded-xl'>
        <h2 className='text-center text-2xl font-bold text-gray-900'>
          Login to your account
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
