import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Calculator, ArrowDownLeft } from 'lucide-react';
import { Skeleton } from '../atoms/Skeleton';

export function RestockTable({
  items = [],
  isLoading = false,
  onShowFormula,
  onQuickRestock,
  className = '',
}) {
  if (isLoading) {
    return (
      <div className={`bg-white border border-[#e5e5e5] rounded-[6px] p-4 shadow-xs ${className}`}>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#e5e5e5] rounded-[6px] shadow-xs overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#eeeeee] bg-[#fafafa] text-[#7b7486] font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4 min-w-[200px]">Produk</th>
              <th className="py-3 px-4 w-28 text-center">Status</th>
              <th className="py-3 px-4 w-36">Stok / Min</th>
              <th className="py-3 px-4 w-32">Permintaan</th>
              <th className="py-3 px-4 w-36">Estimasi Kebutuhan</th>
              <th className="py-3 px-4 w-32 text-right">Rekomendasi</th>
              <th className="py-3 px-4 w-44 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f3f3]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#7b7486]">
                  Tidak ada data rekomendasi restock yang sesuai kriteria pencarian atau filter.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const avgDemand = Number(item.avg_daily_demand) || 0;
                const detail = item.detail || {};
                const demand7Days = detail.demand_7_days ?? Math.round(avgDemand * 7);
                const demand14Days = detail.demand_14_days ?? Math.round(avgDemand * 14);
                const recommendedQty = Number(item.recommended_qty) || 0;

                return (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-[#fbfbfe] transition-colors"
                  >
                    {/* 1. No */}
                    <td className="py-3.5 px-4 text-center text-[#9ca3af] font-mono text-[12px]">
                      {idx + 1}
                    </td>

                    {/* 2. Produk */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1a1c1c] hover:text-[#6d28d9] transition-colors">
                          {item.product_name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-[#7b7486] mt-0.5">
                          <span className="font-mono">{item.product_sku}</span>
                          <span>•</span>
                          <span>{item.category_name || 'Umum'}</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Status Urgensi */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge status={item.status} />
                    </td>

                    {/* 4. Stok Saat Ini / Min / Safety */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-[12px]">
                        <span className="font-bold text-[#1a1c1c]">
                          {item.current_stock}{' '}
                          <span className="font-normal text-[#7b7486]">unit</span>
                        </span>
                        <span className="text-[11px] text-[#9ca3af]">
                          Min: {item.min_stock} | SS: {item.safety_stock}
                        </span>
                      </div>
                    </td>

                    {/* 5. Rata-rata Permintaan Harian */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-[12px]">
                        <span className="font-bold text-[#1a1c1c]">
                          {avgDemand.toFixed(1)}{' '}
                          <span className="font-normal text-[#7b7486]">/ hari</span>
                        </span>
                        <span className="text-[10px] text-[#9ca3af]">
                          Lead Time: {item.lead_time_days}h
                        </span>
                      </div>
                    </td>

                    {/* 6. Estimasi Kebutuhan 7 & 14 Hari */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-[11px]">
                        <span className="text-[#475569]">
                          7 Hari: <strong>{demand7Days}</strong> unit
                        </span>
                        <span className="text-[#64748b]">
                          14 Hari: <strong>{demand14Days}</strong> unit
                        </span>
                      </div>
                    </td>

                    {/* 7. Rekomendasi Restock Qty */}
                    <td className="py-3.5 px-4 text-right">
                      {recommendedQty > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[15px] text-[#6d28d9]">
                          +{recommendedQty}{' '}
                          <span className="text-[11px] font-normal text-[#7b7486]">unit</span>
                        </span>
                      ) : (
                        <span className="text-[#15803d] font-medium text-[12px]">
                          0 (Aman)
                        </span>
                      )}
                    </td>

                    {/* 8. Tombol Aksi */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Lihat Rumus */}
                        <button
                          type="button"
                          onClick={() => onShowFormula(item)}
                          title="Lihat Rincian Rumus Perhitungan"
                          className="h-[30px] px-2.5 rounded-[4px] border border-[#e5e5e5] hover:bg-[#f4f3f3] text-[#475569] hover:text-[#1a1c1c] text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <Calculator className="w-3.5 h-3.5 text-[#6d28d9]" />
                          <span>Rumus</span>
                        </button>

                        {/* Tombol Quick Restock */}
                        <Button
                          variant="primary"
                          onClick={() => onQuickRestock(item)}
                          disabled={recommendedQty <= 0 && item.status === 'ok'}
                          className="h-[30px] px-2.5 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Restock</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
