export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-3">
      <button className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors">
        {/* <FcGoogle className="mr-2" /> */}
        <span>Log in with Google</span>
      </button>
    </div>
  );
}