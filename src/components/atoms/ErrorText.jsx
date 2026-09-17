import { AlertCircle } from 'lucide-react';

export function ErrorText({ children, className = '' }) {
  if (!children) return null;

  return (
    <div className={`flex items-center gap-1.5 text-[12px] text-[#ba1a1a] mt-1.5 ${className}`}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
