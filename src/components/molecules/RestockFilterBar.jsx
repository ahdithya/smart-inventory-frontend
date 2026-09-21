import { Search } from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'all', label: 'Semua Status' },
  { id: 'critical', label: 'Kritis' },
  { id: 'warning', label: 'Menipis' },
  { id: 'ok', label: 'Aman' },
];

export function RestockFilterBar({
  search = '',
  onSearchChange,
  status = 'all',
  onStatusChange,
  counts = {},
  className = '',
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 ${className}`}>
      {/* Status Segmented Tabs */}
      <div className="inline-flex rounded-[6px] border border-[#e5e5e5] p-0.5 bg-[#f4f3f3] text-[12px] font-medium overflow-x-auto select-none">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = status === opt.id;
          const count = counts[opt.id] ?? 0;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onStatusChange(opt.id)}
              className={`px-3 py-1.5 rounded-[4px] transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#1a1c1c] font-semibold shadow-xs'
                  : 'text-[#5f5e5e] hover:text-[#1a1c1c]'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? 'bg-[#f4f3f3] text-[#1a1c1c]'
                    : 'bg-[#e5e5e5] text-[#5f5e5e]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-64">
        <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari produk atau SKU..."
          className="w-full h-[36px] pl-9 pr-3 bg-white border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#6d28d9] transition-colors"
        />
      </div>
    </div>
  );
}
