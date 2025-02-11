import SocialLoginButtons from './SocialLoginButtons';

export default function LoginForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <form className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">Login into account</h1>

        <label htmlFor="email" className="text-sm text-gray-600">Email</label>
        <input type="email" id="email" required className="w-full p-2 mb-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />

        <label htmlFor="password" className="text-sm text-gray-600">Password</label>
        <input type="password" id="password" required className="w-full p-2 mb-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />

        <p className="text-right mb-4 text-sm text-gray-600">
          <a href="/forgot-password" className="text-purple-600 hover:underline">Forgot password?</a>
        </p>

        <button type="submit" className="w-full p-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors">Login</button>

        <div className="text-center my-4 text-sm text-gray-600">Or Login with</div>

        <SocialLoginButtons />

        <p className="text-center mt-5 text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-purple-600 hover:underline">Create Account</a>
        </p>
      </form>
    </div>
  );
}