import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Calculator, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

export function RestockFormulaModal({
  isOpen = false,
  onClose,
  recommendation = null,
  onQuickRestock,
}) {
  if (!recommendation) return null;

  const detail = recommendation.detail || {};
  const avgDemand = Number(recommendation.avg_daily_demand) || 0;
  const leadTime = Number(recommendation.lead_time_days) || 0;
  const safetyStock = Number(recommendation.safety_stock) || 0;
  const currentStock = Number(recommendation.current_stock) || 0;
  const recommendedQty = Number(recommendation.recommended_qty) || 0;

  const demand7Days = detail.demand_7_days ?? Math.round(avgDemand * 7);
  const demand14Days = detail.demand_14_days ?? Math.round(avgDemand * 14);
  const leadTimeDemand = detail.lead_time_demand ?? Math.round(avgDemand * leadTime);

  const formulaCalculation = `(${avgDemand.toFixed(1)} × ${leadTime}) + ${safetyStock} − ${currentStock}`;
  const rawSubtotal = leadTimeDemand + safetyStock - currentStock;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rincian Rumus & Perhitungan Restock"
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" onClick={onClose} className="text-[12px] h-[36px]">
            Tutup
          </Button>
          {onQuickRestock && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onQuickRestock(recommendation);
              }}
              className="text-[12px] h-[36px] flex items-center gap-1.5"
            >
              <span>Restock {recommendedQty} Unit Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Product Identity Header */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#6d28d9] font-mono tracking-wider">
              {recommendation.product_sku}
            </div>
            <h3 className="text-[15px] font-bold text-[#1a1c1c]">
              {recommendation.product_name}
            </h3>
            <span className="text-[12px] text-[#7b7486]">
              Kategori: {recommendation.category_name || 'Umum'}
            </span>
          </div>
          <Badge status={recommendation.status} />
        </div>

        {/* Formula Display Box */}
        <div className="bg-[#fdfdfd] border border-[#e5e5e5] rounded-[6px] p-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6d28d9] uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>Formula Baku Rekomendasi Restock</span>
          </div>
          <div className="font-mono text-[13px] bg-[#f4f3f3] p-2.5 rounded text-[#1a1c1c] text-center font-medium overflow-x-auto">
            Rekomendasi = max(0, (Permintaan Harian × Lead Time) + Safety Stock − Stok Terkini)
          </div>
        </div>

        {/* Variable Values Breakdown */}
        <div>
          <h4 className="text-[12px] font-semibold text-[#7b7486] uppercase tracking-wider mb-2.5">
            Komponen Variabel Produk
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[12px]">
            <div className="bg-white border border-[#eeeeee] p-2.5 rounded-[4px]">
              <span className="text-[#7b7486] block text-[11px]">Permintaan Harian (D)</span>
              <strong className="text-[14px] text-[#1a1c1c]">
                {avgDemand.toFixed(1)} <span className="font-normal text-[11px] text-[#7b7486]">unit/hari</span>
              </strong>
            </div>
            <div className="bg-white border border-[#eeeeee] p-2.5 rounded-[4px]">
              <span className="text-[#7b7486] block text-[11px]">Lead Time (L)</span>
              <strong className="text-[14px] text-[#1a1c1c]">
                {leadTime} <span className="font-normal text-[11px] text-[#7b7486]">hari</span>
              </strong>
            </div>
            <div className="bg-white border border-[#eeeeee] p-2.5 rounded-[4px]">
              <span className="text-[#7b7486] block text-[11px]">Kebutuhan Lead Time (D×L)</span>
              <strong className="text-[14px] text-[#1a1c1c]">
                {leadTimeDemand} <span className="font-normal text-[11px] text-[#7b7486]">unit</span>
              </strong>
            </div>
            <div className="bg-white border border-[#eeeeee] p-2.5 rounded-[4px]">
              <span className="text-[#7b7486] block text-[11px]">Safety Stock (SS)</span>
              <strong className="text-[14px] text-[#1a1c1c]">
                {safetyStock} <span className="font-normal text-[11px] text-[#7b7486]">unit</span>
              </strong>
            </div>
            <div className="bg-white border border-[#eeeeee] p-2.5 rounded-[4px]">
              <span className="text-[#7b7486] block text-[11px]">Stok Terkini (S)</span>
              <strong className={`text-[14px] ${currentStock <= 0 ? 'text-[#ba1a1a]' : 'text-[#1a1c1c]'}`}>
                {currentStock} <span className="font-normal text-[11px] text-[#7b7486]">unit</span>
              </strong>
            </div>
            <div className="bg-white border border-[#eeeeee] p-2.5 rounded-[4px]">
              <span className="text-[#7b7486] block text-[11px]">Batas Stok Minimum</span>
              <strong className="text-[14px] text-[#1a1c1c]">
                {recommendation.min_stock} <span className="font-normal text-[11px] text-[#7b7486]">unit</span>
              </strong>
            </div>
          </div>
        </div>

        {/* Calculation Step & Result */}
        <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col gap-2">
          <div className="text-[12px] font-semibold text-[#1a1c1c]">
            Perhitungan Angka Nyata:
          </div>
          <div className="font-mono text-[12px] text-[#475569]">
            = max(0, {formulaCalculation})
          </div>
          <div className="font-mono text-[12px] text-[#475569]">
            = max(0, {rawSubtotal})
          </div>
          <div className="pt-2 border-t border-[#eeeeee] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#1a1c1c]">
              Hasil Kuantitas yang Disarankan:
            </span>
            <span className="text-[18px] font-bold text-[#6d28d9]">
              {recommendedQty} Unit
            </span>
          </div>
        </div>

        {/* Horizon 7 & 14 Days Forecast Estimates */}
        <div className="border border-[#e5e5e5] rounded-[6px] p-3.5 bg-white">
          <span className="text-[11px] font-semibold text-[#7b7486] uppercase tracking-wider block mb-2">
            Estimasi Kebutuhan Berdasarkan Horizon Permintaan
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="text-[11px] text-[#64748b]">Horizon 7 Hari (Mingguan)</div>
              <div className="text-[15px] font-bold text-[#1e293b]">
                {demand7Days} Unit
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5">
                Estimasi kebutuhan konsumsi 1 minggu ke depan
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="text-[11px] text-[#64748b]">Horizon 14 Hari (Dua Mingguan)</div>
              <div className="text-[15px] font-bold text-[#1e293b]">
                {demand14Days} Unit
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5">
                Estimasi kebutuhan konsumsi 2 minggu ke depan
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Logic Clarification */}
        <div className="text-[12px] text-[#5f5e5e] flex items-start gap-2 bg-[#f4f3f3] p-3 rounded">
          {recommendation.status === 'critical' ? (
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
          ) : recommendation.status === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
          )}
          <div>
            <strong className="text-[#1a1c1c]">Penjelasan Status: </strong>
            {recommendation.status === 'critical'
              ? 'Stok produk telah habis atau kosong (≤ 0). Wajib restock sekarang agar tidak kehilangan potensi penjualan.'
              : recommendation.status === 'warning'
              ? 'Stok produk berada pada atau di bawah batas stok minimum. Segera buat pesanan restock sebelum lead time habis.'
              : 'Stok masih di atas batas minimum dan mencukupi kebutuhan lead time serta safety stock.'}
          </div>
        </div>
      </div>
    </Modal>
  );
}
