import { KpiCard } from '../molecules/KpiCard';
import { Package, AlertTriangle, Wallet, TrendingUp } from 'lucide-react';

function formatRupiah(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function KpiGrid({ summary = {}, isLoading = false }) {
  const totalProducts = summary.total_products || 0;
  const lowStock = summary.low_stock_count || 0;
  const criticalStock = summary.critical_stock_count || 0;
  const totalStockAlerts = lowStock + criticalStock;

  const stockValueFormatted = formatRupiah(summary.total_stock_value);
  const todaySalesFormatted = formatRupiah(summary.today_sales_total);
  const todayItemsSold = summary.today_items_sold || 0;
  const todaySalesCount = summary.today_sales_count || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {/* 1. Total Produk */}
      <KpiCard
        title="Total Produk"
        value={totalProducts}
        icon={Package}
        subtitle="Item aktif dalam katalog"
        isLoading={isLoading}
      />

      {/* 2. Stok Menipis & Kritis */}
      <KpiCard
        title="Peringatan Stok"
        value={totalStockAlerts}
        icon={AlertTriangle}
        badgeText={criticalStock > 0 ? `${criticalStock} Kritis` : lowStock > 0 ? `${lowStock} Menipis` : 'Aman'}
        badgeStatus={criticalStock > 0 ? 'kritis' : lowStock > 0 ? 'menipis' : 'aman'}
        subtitle={`${lowStock} menipis, ${criticalStock} kritis`}
        isLoading={isLoading}
      />

      {/* 3. Nilai Stok Modal */}
      <KpiCard
        title="Nilai Stok"
        value={stockValueFormatted}
        icon={Wallet}
        subtitle="Estimasi aset modal gudang"
        isLoading={isLoading}
      />

      {/* 4. Penjualan Hari Ini */}
      <KpiCard
        title="Penjualan Hari Ini"
        value={todaySalesFormatted}
        icon={TrendingUp}
        subtitle={`${todayItemsSold} item (${todaySalesCount} transaksi)`}
        isLoading={isLoading}
      />
    </div>
  );
}
