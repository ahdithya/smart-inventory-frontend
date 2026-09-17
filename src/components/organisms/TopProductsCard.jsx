import { TopProductItem } from '../molecules/TopProductItem';
import { Skeleton } from '../atoms/Skeleton';
import { Award } from 'lucide-react';

export function TopProductsCard({
  topProducts = [],
  isLoading = false,
  className = '',
}) {
  const maxSold = topProducts.length > 0 ? Number(topProducts[0].total_sold) || 100 : 100;

  return (
    <div
      className={`border border-[#e5e5e5] rounded-[8px] p-5 sm:p-6 bg-white flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
              Top 5 Produk Terlaris
            </h2>
          </div>
          <div className="text-[#6d28d9]">
            <Award className="w-4 h-4 stroke-[2]" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 py-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : topProducts.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-[#7b7486]">
            Belum ada data penjualan produk.
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-1">
            {topProducts.slice(0, 5).map((item, idx) => (
              <TopProductItem
                key={item.id || idx}
                name={item.name}
                totalSold={item.total_sold}
                maxSold={maxSold}
                rank={idx + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
