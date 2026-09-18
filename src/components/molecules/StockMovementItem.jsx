import { ArrowDownToLine, SlidersHorizontal } from 'lucide-react';

export function StockMovementItem({ movement, isLast = false }) {
  const { type, qty, product_name, note, movement_date, created_at } = movement;
  const isIncoming = type === 'IN';

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : movement_date
    ? new Date(movement_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  const formattedTime = created_at
    ? new Date(created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const displayQty = qty > 0 ? `+${qty}` : `${qty}`;

  return (
    <div
      className={`flex items-start justify-between py-3.5 transition-colors hover:bg-[#fafafa] px-2 rounded-[4px] ${
        !isLast ? 'border-b border-[#eeeeee]' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon Badge */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
            isIncoming
              ? 'bg-[#f0fdf4] text-[#2e7d32] border-[#2e7d32]/30'
              : 'bg-[#fffbeb] text-[#b8860b] border-[#b8860b]/30'
          }`}
        >
          {isIncoming ? (
            <ArrowDownToLine className="w-4 h-4" />
          ) : (
            <SlidersHorizontal className="w-4 h-4" />
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-[13px] font-semibold text-[#1a1c1c] leading-snug">
            <span
              className={
                isIncoming
                  ? 'text-[#2e7d32] font-bold'
                  : 'text-[#b8860b] font-bold'
              }
            >
              {type} ({displayQty})
            </span>{' '}
            <span className="font-medium text-[#1a1c1c] ml-1">
              {product_name || 'Produk'}
            </span>
          </p>
          <p className="text-[12px] text-[#5f5e5e] mt-0.5">
            {note ? (
              <span>{note}</span>
            ) : (
              <span className="italic text-[#9ca3af]">Tanpa catatan</span>
            )}
          </p>
        </div>
      </div>

      {/* Date Timestamp */}
      <div className="text-right shrink-0 ml-3">
        <span className="text-[11px] text-[#5f5e5e] font-medium block">
          {formattedDate}
        </span>
        {formattedTime && (
          <span className="text-[10px] text-[#7b7486] font-mono block">
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
}
