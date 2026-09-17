import { Store } from 'lucide-react';

export function BrandIcon({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`inline-flex items-center justify-center text-[#6d28d9] select-none ${className}`}
      aria-hidden="true"
    >
      <Store className={`${sizes[size] || sizes.md} stroke-[1.75]`} />
    </div>
  );
}
