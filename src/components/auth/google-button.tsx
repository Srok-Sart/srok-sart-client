import Image from "next/image";

interface GoogleProps {
  isLoading: boolean;
}

export function GoogleButton({ isLoading }: GoogleProps) {
  return (
    <button
      type='button'
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
