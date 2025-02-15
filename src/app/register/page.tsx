import RegisterForm from "./components/register-form";

export default function RegisterPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md md:max-w-lg bg-white p-8 shadow-lg rounded-xl'>
        <h2 className='text-center text-2xl font-bold text-gray-900'>
          Register Account
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
}
