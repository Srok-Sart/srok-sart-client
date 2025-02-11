import SocialLoginButtons from './SocialLoginButtons';

export default function RegisterForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <form className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">Register Account</h1>

        <label htmlFor="username" className="block text-sm text-gray-600 mb-1">Username</label>
        <input
          type="text"
          id="username"
          required
          className="w-full p-2 mb-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          id="email"
          required
          className="w-full p-2 mb-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password"
          id="password"
          required
          className="w-full p-2 mb-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          required
          className="w-full p-2 mb-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          type="submit"
          className="w-full p-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
        >
          Register
        </button>

        <div className="text-center my-4 text-sm text-gray-600">Or Register with</div>

        <SocialLoginButtons />

        <p className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}