interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function EmailInput({ value, onChange, disabled }: InputProps) {
  return (
    <div>
      <label htmlFor='email' className='text-gray-600 block mb-1'>
        Email
      </label>
      <input
        id='email'
        type='email'
        name='email'
        placeholder='Enter your email'
        value={value}
        onChange={onChange}
        className='w-full p-3 border text-black rounded-lg focus:ring-2 focus:ring-primary focus:outline-none'
        required
        disabled={disabled}
      />
    </div>
  );
}

export function PasswordInput({ value, onChange, disabled }: InputProps) {
  return (
    <div>
      <label htmlFor='password' className='text-gray-600 block mb-1'>
        Password
      </label>
      <input
        id='password'
        type='password'
        name='password'
        placeholder='Enter your password'
        value={value}
        onChange={onChange}
        className='w-full p-3 border text-black rounded-lg focus:ring-2 focus:ring-primary focus:outline-none'
        required
        disabled={disabled}
      />
    </div>
  );
}
