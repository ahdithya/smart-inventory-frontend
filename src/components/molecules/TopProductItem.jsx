import { ProgressBar } from '../atoms/ProgressBar';

export function TopProductItem({ name, totalSold, maxSold = 100, rank }) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-medium text-[#1a1c1c] truncate max-w-[200px] sm:max-w-[240px]">
          {rank ? <span className="text-[#7b7486] mr-1.5 font-normal">#{rank}</span> : null}
          {name}
        </span>
        <span className="font-semibold text-[#5f5e5e] shrink-0 text-[12px]">
          {totalSold} <span className="font-normal text-[#7b7486]">Terjual</span>
        </span>
      </div>
      <ProgressBar value={totalSold} max={maxSold} />
    </div>
  );
}
