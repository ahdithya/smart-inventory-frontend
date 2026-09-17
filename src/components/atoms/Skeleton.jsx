export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-[#eeeeee] animate-pulse rounded-[4px] ${className}`}
      aria-hidden="true"
    />
  );
}
