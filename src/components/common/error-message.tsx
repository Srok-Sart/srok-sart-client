interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
      {message}
    </div>
  );
}
