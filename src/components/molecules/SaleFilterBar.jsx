import { Search, X, Plus, RotateCcw } from 'lucide-react';
import { Button } from '../atoms/Button';

export function SaleFilterBar({
  searchQuery = '',
  onSearchChange,
  startDate = '',
  onStartDateChange,
  endDate = '',
  onEndDateChange,
  onResetFilters,
  onAddClick,
}) {
  const hasFilters = Boolean(searchQuery || startDate || endDate);

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[8px] p-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Filters Group */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-wrap">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-[#5f5e5e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari ID transaksi atau kasir..."
              className="w-full h-10 pl-9 pr-8 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[6px] text-[14px] text-[#1a1c1c] placeholder-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#6d28d9] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1c1c] p-0.5"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Start Date */}
          <div className="relative w-full sm:w-44">
            <label className="absolute -top-2 left-2 bg-white px-1 font-semibold text-[10px] tracking-[0.08em] text-[#5f5e5e] uppercase z-10">
              Dari Tanggal
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] focus:bg-white focus:outline-none focus:border-[#6d28d9] transition-colors"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="relative w-full sm:w-44">
            <label className="absolute -top-2 left-2 bg-white px-1 font-semibold text-[10px] tracking-[0.08em] text-[#5f5e5e] uppercase z-10">
              Sampai Tanggal
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] focus:bg-white focus:outline-none focus:border-[#6d28d9] transition-colors"
              />
            </div>
          </div>

          {/* Reset Filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 h-10 text-[13px] text-[#5f5e5e] hover:text-[#1a1c1c] hover:bg-[#f4f3f3] rounded-[6px] transition-colors"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Action Button: Transaksi Baru */}
        <div className="shrink-0">
          <Button
            type="button"
            variant="primary"
            onClick={onAddClick}
            className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Transaksi Baru</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
