export function ProgressBar({ value = 0, max = 100, percentage, className = '' }) {
  const calcPercent =
    percentage !== undefined
      ? Math.min(100, Math.max(0, percentage))
      : max > 0
      ? Math.min(100, Math.max(0, (value / max) * 100))
      : 0;

  return (
    <div
      className={`w-full bg-[#eeeeee] h-2 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={calcPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="bg-[#6d28d9] h-full transition-all duration-300 rounded-full"
        style={{ width: `${calcPercent}%` }}
      />
    </div>
  );
}
