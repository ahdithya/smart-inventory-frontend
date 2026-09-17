import { Skeleton } from '../atoms/Skeleton';
import { Badge } from '../atoms/Badge';

export function KpiCard({
  title,
  value,
  icon: Icon,
  subtitle,
  badgeText,
  badgeStatus,
  isLoading = false,
  className = '',
}) {
  if (isLoading) {
    return (
      <div className={`border border-[#e5e5e5] rounded-[8px] p-5 sm:p-6 bg-white flex flex-col justify-between h-[126px] ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32" />
        {subtitle && <Skeleton className="h-3 w-20 mt-1" />}
      </div>
    );
  }

  return (
    <div
      className={`border border-[#e5e5e5] rounded-[8px] p-5 sm:p-6 bg-white flex flex-col justify-between transition-colors hover:border-[#d4d4d4] ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-[11px] tracking-[0.08em] uppercase text-[#5f5e5e]">
          {title}
        </span>
        {Icon && (
          <div className="text-[#6d28d9] p-1 rounded-[4px] bg-[#f4f3f3]">
            <Icon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[26px] sm:text-[28px] font-bold text-[#1a1c1c] tracking-[-0.03em] leading-none">
          {value}
        </span>
        {badgeText && (
          <Badge status={badgeStatus || 'neutral'}>{badgeText}</Badge>
        )}
      </div>

      {subtitle && (
        <span className="text-[12px] text-[#7b7486] mt-2 font-normal">
          {subtitle}
        </span>
      )}
    </div>
  );
}
