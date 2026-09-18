import { useState, useMemo } from 'react';
import { CurrentStockRow } from '../molecules/CurrentStockRow';
import { Skeleton } from '../atoms/Skeleton';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ITEMS_PER_PAGE = 7;

export function CurrentStockTable({
  stockList = [],
  isLoading = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return stockList;
    const q = searchQuery.toLowerCase();
    return stockList.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        item.category_name?.toLowerCase().includes(q)
    );
  }, [stockList, searchQuery]);

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <section className="bg-white border border-[#e5e5e5] rounded-[8px] p-6 shadow-none flex flex-col min-h-[420px]">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-[#eeeeee] mb-4">
        <div>
          <h3 className="text-[17px] font-bold text-[#1a1c1c]">Stok Saat Ini</h3>
          <p className="text-[13px] text-[#5f5e5e] mt-0.5">
            Ringkasan ketersediaan barang di gudang.
          </p>
        </div>

        {/* Instant Filter Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-4 h-4 text-[#5f5e5e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari produk / SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9 pl-9 pr-8 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] placeholder-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#6d28d9] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1c1c] p-0.5"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[420px]">
          <thead>
            <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
              <th className="py-2.5 px-4 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase">
                Produk
              </th>
              <th className="py-2.5 px-4 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase text-right">
                Stok
              </th>
              <th className="py-2.5 px-4 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase text-center w-28">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-[#eeeeee]">
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20 mt-1" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </td>
                </tr>
              ))
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-[#5f5e5e]">
                  <p className="font-medium text-[13px]">
                    {searchQuery
                      ? 'Tidak ada produk yang cocok dengan pencarian.'
                      : 'Belum ada data produk di gudang.'}
                  </p>
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <CurrentStockRow key={item.id} item={item} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#eeeeee] flex justify-between items-center text-[12px] text-[#5f5e5e]">
          <span>
            Menampilkan <strong className="text-[#1a1c1c]">{startIndex + 1}</strong>-
            <strong className="text-[#1a1c1c]">{endIndex}</strong> dari{' '}
            <strong className="text-[#1a1c1c]">{totalItems}</strong> produk
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={safePage <= 1}
              className="p-1 border border-[#e5e5e5] rounded-[4px] bg-white text-[#5f5e5e] hover:text-[#1a1c1c] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-1 font-medium">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={safePage >= totalPages}
              className="p-1 border border-[#e5e5e5] rounded-[4px] bg-white text-[#5f5e5e] hover:text-[#1a1c1c] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
