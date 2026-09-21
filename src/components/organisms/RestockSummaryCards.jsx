import { AlertOctagon, AlertTriangle, CheckCircle2, Boxes } from 'lucide-react';
import { Skeleton } from '../atoms/Skeleton';

export function RestockSummaryCards({
  items = [],
  isLoading = false,
  className = '',
}) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-[6px]" />
        ))}
      </div>
    );
  }

  const criticalCount = items.filter((i) => i.status === 'critical').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;
  const okCount = items.filter((i) => i.status === 'ok').length;
  const totalRecommendedQty = items.reduce(
    (acc, curr) => acc + (Number(curr.recommended_qty) || 0),
    0
  );

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 ${className}`}>
      {/* 1. Total Unit Restock Disarankan */}
      <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7b7486]">
            Total Unit Restock
          </span>
          <div className="w-7 h-7 rounded bg-[#f5f3ff] flex items-center justify-center text-[#6d28d9]">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-[26px] font-bold text-[#6d28d9] tracking-tight">
            {totalRecommendedQty} <span className="text-[13px] font-normal text-[#7b7486]">Unit</span>
          </div>
          <p className="text-[11px] text-[#7b7486] mt-0.5">
            Akumulasi kebutuhan seluruh produk toko
          </p>
        </div>
      </div>

      {/* 2. Produk Kritis */}
      <div className="bg-white border border-[#fca5a5] rounded-[6px] p-4 flex flex-col justify-between shadow-xs bg-[#fffafa]/50">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#ba1a1a]">
            Produk Kritis
          </span>
          <div className="w-7 h-7 rounded bg-[#fee2e2] flex items-center justify-center text-[#dc2626]">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-[26px] font-bold text-[#ba1a1a] tracking-tight">
            {criticalCount} <span className="text-[13px] font-normal text-[#ba1a1a]/80">SKU</span>
          </div>
          <p className="text-[11px] text-[#ba1a1a]/80 mt-0.5">
            Stok habis (≤ 0), butuh restock segera
          </p>
        </div>
      </div>

      {/* 3. Produk Menipis */}
      <div className="bg-white border border-[#fde68a] rounded-[6px] p-4 flex flex-col justify-between shadow-xs bg-[#fffdf5]/50">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#b45309]">
            Produk Menipis
          </span>
          <div className="w-7 h-7 rounded bg-[#fef3c7] flex items-center justify-center text-[#d97706]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-[26px] font-bold text-[#b45309] tracking-tight">
            {warningCount} <span className="text-[13px] font-normal text-[#b45309]/80">SKU</span>
          </div>
          <p className="text-[11px] text-[#b45309]/80 mt-0.5">
            Di bawah atau sama dengan stok minimum
          </p>
        </div>
      </div>

      {/* 4. Produk Aman */}
      <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#15803d]">
            Stok Terpenuhi (Aman)
          </span>
          <div className="w-7 h-7 rounded bg-[#dcfce7] flex items-center justify-center text-[#16a34a]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-[26px] font-bold text-[#15803d] tracking-tight">
            {okCount} <span className="text-[13px] font-normal text-[#15803d]/80">SKU</span>
          </div>
          <p className="text-[11px] text-[#7b7486] mt-0.5">
            Stok masih mencukupi masa tunggu lead time
          </p>
        </div>
      </div>
    </div>
  );
}
