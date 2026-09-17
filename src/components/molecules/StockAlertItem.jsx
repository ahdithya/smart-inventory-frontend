import { Badge } from '../atoms/Badge';

export function StockAlertItem({
  name,
  currentStock,
  unit = 'unit',
  minStock,
  status = 'menipis',
  isLast = false,
}) {
  const isKritis = status === 'kritis' || currentStock <= 0;
  const statusLabel = isKritis ? 'KRITIS' : 'MENIPIS';

  return (
    <div
      className={`flex justify-between items-center py-3.5 ${
        !isLast ? 'border-b border-[#eeeeee]' : ''
      }`}
    >
      <div className="flex flex-col gap-0.5 pr-3">
        <p className="text-[14px] font-semibold text-[#1a1c1c] leading-tight line-clamp-1">
          {name}
        </p>
        <p className="text-[12px] text-[#5f5e5e] font-normal">
          Sisa: <span className="font-semibold text-[#1a1c1c]">{currentStock}</span> {unit}
          {minStock !== undefined && (
            <span className="text-[#7b7486] ml-1.5">(Min: {minStock})</span>
          )}
        </p>
      </div>

      <Badge status={isKritis ? 'kritis' : 'menipis'}>
        {statusLabel}
      </Badge>
    </div>
  );
}
