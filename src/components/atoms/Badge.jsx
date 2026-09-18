export function Badge({ status = 'aman', children, className = '' }) {
  const statusKey = String(status).toLowerCase();

  const styles = {
    kritis: 'border-[#ba1a1a] text-[#ba1a1a] bg-[#fff5f5]/60',
    menipis: 'border-[#b8860b] text-[#b8860b] bg-[#fffbeb]/60',
    aman: 'border-[#2e7d32] text-[#2e7d32] bg-[#f0fdf4]/60',
    neutral: 'border-[#e5e5e5] text-[#5f5e5e] bg-[#f9f9f9]',
  };

  const defaultLabels = {
    kritis: 'KRITIS',
    menipis: 'MENIPIS',
    aman: 'AMAN',
    neutral: 'INFO',
  };

  const badgeStyle = styles[statusKey] || styles.neutral;
  const label = children || defaultLabels[statusKey] || statusKey.toUpperCase();

  return (
    <span
      className={`inline-flex items-center justify-center w-[74px] h-[22px] font-semibold text-[11px] tracking-[0.08em] uppercase border rounded-[4px] text-center select-none ${badgeStyle} ${className}`}
    >
      {label}
    </span>
  );
}
