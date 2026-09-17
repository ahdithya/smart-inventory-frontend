import { BrandIcon } from '../atoms/BrandIcon';

export function AuthHeader({ title, subtitle, showLogo = true, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-2 mb-6 ${className}`}>
      {showLogo && (
        <div className="mb-1">
          <BrandIcon size="lg" />
        </div>
      )}
      <h1 className="text-[22px] font-bold text-[#1a1c1c] tracking-[-0.02em] leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[14px] text-[#5f5e5e] font-normal leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
