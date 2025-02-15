interface DividerProps {
  text: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <div className='flex items-center space-x-2 my-4'>
      <hr className='flex-grow border-gray-300' />
      <span className='text-gray-500 text-sm'>{text}</span>
      <hr className='flex-grow border-gray-300' />
    </div>
  );
}
