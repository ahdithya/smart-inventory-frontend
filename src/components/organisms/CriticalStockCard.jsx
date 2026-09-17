import { StockAlertItem } from '../molecules/StockAlertItem';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function CriticalStockCard({
  items = [],
  isLoading = false,
  onRestockClick,
  className = '',
}) {
  const displayItems = items.slice(0, 4);

  return (
    <div
      className={`border border-[#e5e5e5] rounded-[8px] p-5 sm:p-6 bg-white flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
              Stok Kritis
            </h2>
            {items.length > 0 && (
              <span className="text-[11px] font-semibold text-[#ba1a1a] bg-[#fff5f5] border border-[#fca5a5] px-1.5 py-0.5 rounded-[4px]">
                {items.length}
              </span>
            )}
          </div>
        </div>

        {/* Content List */}
        {isLoading ? (
          <div className="flex flex-col gap-3 py-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : displayItems.length === 0 ? (
          <div className="py-6 text-center flex flex-col items-center justify-center gap-2 text-[#15803d]">
            <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
            <p className="text-[14px] font-medium">Semua stok berada dalam batas aman.</p>
            <p className="text-[12px] text-[#7b7486]">Tidak ada produk yang perlu restock saat ini.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {displayItems.map((item, idx) => (
              <StockAlertItem
                key={item.id || idx}
                name={item.name}
                currentStock={item.current_stock}
                unit={item.unit}
                minStock={item.min_stock}
                status={item.status || (item.current_stock <= 0 ? 'kritis' : 'menipis')}
                isLast={idx === displayItems.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-3 border-t border-[#eeeeee]">
        <Button
          variant="primary"
          onClick={onRestockClick}
          className="gap-2"
          disabled={isLoading || displayItems.length === 0}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Rekomendasi Restock</span>
        </Button>
      </div>
    </div>
  );
}
