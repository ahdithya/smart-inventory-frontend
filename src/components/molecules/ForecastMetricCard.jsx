import { CheckCircle, AlertTriangle, Cpu } from 'lucide-react';

function formatNumber(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(Number(val))) return '-';
  return Number(val).toFixed(decimals);
}

function getMapeQuality(mape) {
  if (mape === null || mape === undefined || isNaN(Number(mape))) {
    return { label: 'Tidak Ada Data', color: 'text-[#7b7486] bg-[#f4f3f3]' };
  }
  const val = Number(mape);
  if (val < 20) {
    return { label: 'Sangat Akurat', color: 'text-[#15803d] bg-[#f0fdf4] border-[#bbf7d0]' };
  }
  if (val <= 30) {
    return { label: 'Akurat (Target Baseline)', color: 'text-[#b45309] bg-[#fffbeb] border-[#fde68a]' };
  }
  return { label: 'Perlu Kalibrasi', color: 'text-[#b91c1c] bg-[#fef2f2] border-[#fecaca]' };
}

function formatModelName(name) {
  if (!name) return 'Standar Baseline';
  const clean = String(name).toLowerCase();
  if (clean.includes('champion') || clean.includes('rf') || clean.includes('forest')) {
    return 'Champion Model (Random Forest)';
  }
  if (clean.includes('exponential')) {
    return 'Exponential Smoothing';
  }
  if (clean.includes('moving_average')) {
    return 'Moving Average';
  }
  return name;
}

export function ForecastMetricCard({
  metrics = {},
  modelName = '',
  generatedAt = null,
  stale = false,
  className = '',
}) {
  const mape = metrics?.mape;
  const mae = metrics?.mae;
  const rmse = metrics?.rmse;
  const wape = metrics?.wape;

  const quality = getMapeQuality(mape);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-3.5 ${className}`}>
      {/* 1. Primary Highlight: MAPE */}
      <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7b7486]">
            MAPE (Metrik Utama)
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${quality.color}`}
          >
            {quality.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-[28px] font-bold tracking-tight text-[#1a1c1c]">
            {formatNumber(mape, 1)}%
          </span>
        </div>
        <p className="text-[11px] text-[#7b7486] mt-2">
          Rata-rata persentase deviasi peramalan terhadap penjualan historis (Target: &lt; 30%).
        </p>
      </div>

      {/* 2. MAE & RMSE */}
      <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col justify-between shadow-xs">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7b7486]">
          MAE &amp; RMSE
        </span>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <div className="text-[11px] text-[#7b7486]">MAE</div>
            <div className="text-[20px] font-bold text-[#1a1c1c]">
              {formatNumber(mae, 2)}
            </div>
            <div className="text-[10px] text-[#9ca3af]">Unit / Hari</div>
          </div>
          <div>
            <div className="text-[11px] text-[#7b7486]">RMSE</div>
            <div className="text-[20px] font-bold text-[#1a1c1c]">
              {formatNumber(rmse, 2)}
            </div>
            <div className="text-[10px] text-[#9ca3af]">Penalti Deviasi</div>
          </div>
        </div>
        <p className="text-[11px] text-[#7b7486] mt-2">
          Besaran absolut selisih kuantitas prediksi.
        </p>
      </div>

      {/* 3. WAPE */}
      <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col justify-between shadow-xs">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7b7486]">
          WAPE (Weighted Error)
        </span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-[28px] font-bold tracking-tight text-[#1a1c1c]">
            {formatNumber(wape, 1)}%
          </span>
        </div>
        <p className="text-[11px] text-[#7b7486] mt-2">
          Kesalahan absolut tertimbang terhadap total volume transaksi riil.
        </p>
      </div>

      {/* 4. Model AI & Status Cache */}
      <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7b7486]">
            Model Aktif
          </span>
          <Cpu className="w-4 h-4 text-[#6d28d9]" />
        </div>
        <div className="mt-2">
          <div className="text-[14px] font-bold text-[#6d28d9] truncate">
            {formatModelName(modelName)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#7b7486]">
            {stale ? (
              <span className="inline-flex items-center gap-1 text-[#b45309] font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Snapshot Cache Tersimpan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#15803d] font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Prediksi Segar (&lt; 6 Jam)
              </span>
            )}
          </div>
        </div>
        <p className="text-[10px] text-[#9ca3af] mt-2 truncate">
          Diperbarui: {generatedAt ? new Date(generatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Baru saja'}
        </p>
      </div>
    </div>
  );
}
