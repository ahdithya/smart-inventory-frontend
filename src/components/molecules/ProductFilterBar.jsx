import { Search, X, Plus, ChevronDown } from 'lucide-react';
import { Button } from '../atoms/Button';

export function ProductFilterBar({
  searchQuery = '',
  onSearchChange,
  categoryFilter = '',
  onCategoryChange,
  categories = [],
  statusFilter = '',
  onStatusChange,
  onAddClick,
  isOwner = false,
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[8px] p-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Filters Group */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-[#5f5e5e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama atau SKU..."
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

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-48">
            <label className="absolute -top-2 left-2 bg-white px-1 font-semibold text-[10px] tracking-[0.08em] text-[#5f5e5e] uppercase z-10">
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full h-10 pl-3 pr-8 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] appearance-none focus:bg-white focus:outline-none focus:border-[#6d28d9] transition-colors"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#5f5e5e] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-40">
            <label className="absolute -top-2 left-2 bg-white px-1 font-semibold text-[10px] tracking-[0.08em] text-[#5f5e5e] uppercase z-10">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full h-10 pl-3 pr-8 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] appearance-none focus:bg-white focus:outline-none focus:border-[#6d28d9] transition-colors"
            >
              <option value="">Semua Status</option>
              <option value="aman">Aman</option>
              <option value="menipis">Menipis</option>
              <option value="kritis">Kritis</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#5f5e5e] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Action Button: Tambah Produk (Owner only) */}
        {isOwner && (
          <div className="shrink-0">
            <Button
              type="button"
              variant="primary"
              onClick={onAddClick}
              className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
