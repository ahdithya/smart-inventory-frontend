function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDayName(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { weekday: 'short' });
}

export function ForecastBreakdownTable({
  dailyItems = [],
  totalPredicted = 0,
  horizon = 7,
  unit = 'unit',
  className = '',
}) {
  const maxQty = Math.max(...dailyItems.map((item) => Number(item.qty) || 0), 1);
  const avgQty = dailyItems.length > 0 ? (totalPredicted / dailyItems.length).toFixed(1) : 0;

  return (
    <div className={`bg-white border border-[#e5e5e5] rounded-[6px] shadow-xs overflow-hidden ${className}`}>
      {/* Card Header */}
      <div className="p-4 border-b border-[#f4f3f3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-[14px] font-bold text-[#1a1c1c]">
            Rincian Proyeksi Harian ({horizon} Hari ke Depan)
          </h4>
          <p className="text-[12px] text-[#7b7486]">
            Estimasi kuantitas item yang diprediksi akan terjual pada masing-masing hari.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[12px]">
          <span className="bg-[#f5f3ff] text-[#6d28d9] px-2.5 py-1 rounded font-semibold border border-[#ddd6fe]">
            Total: {totalPredicted} {unit}
          </span>
          <span className="bg-[#f4f3f3] text-[#5f5e5e] px-2.5 py-1 rounded font-medium">
            Rata-rata: {avgQty} {unit}/hari
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#eeeeee] bg-[#fafafa] text-[#7b7486] font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-4 w-12 text-center">No</th>
              <th className="py-2.5 px-4 w-28">Hari</th>
              <th className="py-2.5 px-4">Tanggal</th>
              <th className="py-2.5 px-4 w-36 text-right">Estimasi Permintaan</th>
              <th className="py-2.5 px-4 w-44">Proporsi Harian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f3f3]">
            {dailyItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-[#7b7486]">
                  Tidak ada rincian data harian untuk horizon ini.
                </td>
              </tr>
            ) : (
              dailyItems.map((item, idx) => {
                const qty = Number(item.qty) || 0;
                const percent = Math.min(100, Math.round((qty / maxQty) * 100));

                return (
                  <tr key={item.date || idx} className="hover:bg-[#fcfcfc] transition-colors">
                    <td className="py-2.5 px-4 text-center text-[#9ca3af] font-mono text-[12px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-[#1a1c1c]">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#f4f3f3] text-[11px]">
                        {getDayName(item.date)}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[#475569]">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#1a1c1c]">
                      {qty} <span className="text-[11px] font-normal text-[#7b7486]">{unit}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#8b5cf6] h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-[#94a3b8] font-mono w-8 text-right">
                          {percent}%
                        </span>
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
