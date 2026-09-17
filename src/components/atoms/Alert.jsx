import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function Alert({ type = 'error', message, className = '' }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 p-3 rounded-[6px] border text-[13px] leading-snug ${
        isError
          ? 'bg-[#fff5f5] border-[#fca5a5] text-[#ba1a1a]'
          : 'bg-[#f0fdf4] border-[#86efac] text-[#15803d]'
      } ${className}`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      <div className="flex-1">{message}</div>
    </div>
  );
}
