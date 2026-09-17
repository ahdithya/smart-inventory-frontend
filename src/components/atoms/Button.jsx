import { Loader2 } from 'lucide-react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = true,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium text-[14px] leading-tight rounded-[6px] h-11 px-4 transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

  const variants = {
    primary:
      'bg-[#6d28d9] text-white hover:bg-[#5b21b6] active:scale-[0.99] focus-visible:ring-[#6d28d9] disabled:bg-[#a78bfa] disabled:cursor-not-allowed disabled:active:scale-100 shadow-none',
    secondary:
      'bg-white border border-[#e5e5e5] text-[#1a1c1c] hover:bg-[#f9f9f9] hover:border-[#d4d4d4] active:bg-[#eeeeee] focus-visible:ring-[#7b7486] disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'bg-transparent text-[#5f5e5e] hover:text-[#1a1c1c] hover:bg-[#eeeeee] active:bg-[#e2e2e2] disabled:opacity-50',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Memproses...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
