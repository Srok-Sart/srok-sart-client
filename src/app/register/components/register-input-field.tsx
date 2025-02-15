interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

export function InputField({
  label,
  name,
  type,
  value,
  onChange,
  disabled,
  required,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className='text-gray-600 block mb-1'>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className='w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-primary focus:outline-none'
        disabled={disabled}
        required={required}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
}
