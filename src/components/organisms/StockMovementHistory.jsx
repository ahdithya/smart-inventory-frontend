import { useState, useMemo } from 'react';
import { StockMovementItem } from '../molecules/StockMovementItem';
import { Skeleton } from '../atoms/Skeleton';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export function StockMovementHistory({
  movements = [],
  isLoading = false,
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMovements = useMemo(() => {
    if (filterType === 'ALL') return movements;
    return movements.filter((m) => m.type === filterType);
  }, [movements, filterType]);

  // Pagination calculation
  const totalItems = filteredMovements.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentMovements = filteredMovements.slice(startIndex, endIndex);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <section className="bg-white border border-[#e5e5e5] rounded-[8px] p-6 shadow-none flex flex-col">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-[#eeeeee] mb-4">
        <div>
          <h3 className="text-[17px] font-bold text-[#1a1c1c] flex items-center gap-2">
            <History className="w-5 h-5 text-[#5f5e5e]" />
            <span>Riwayat Pergerakan</span>
          </h3>
          <p className="text-[13px] text-[#5f5e5e] mt-0.5">
            Log mutasi stok masuk dan penyesuaian terkini.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#f4f3f3] p-1 rounded-[6px] text-[12px] font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setFilterType('ALL');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-[4px] transition-colors ${
              filterType === 'ALL'
                ? 'bg-white text-[#1a1c1c] font-semibold shadow-xs'
                : 'text-[#5f5e5e] hover:text-[#1a1c1c]'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterType('IN');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-[4px] transition-colors ${
              filterType === 'IN'
                ? 'bg-white text-[#2e7d32] font-semibold shadow-xs'
                : 'text-[#5f5e5e] hover:text-[#2e7d32]'
            }`}
          >
            Masuk (IN)
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterType('ADJUST');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-[4px] transition-colors ${
              filterType === 'ADJUST'
                ? 'bg-white text-[#b8860b] font-semibold shadow-xs'
                : 'text-[#5f5e5e] hover:text-[#b8860b]'
            }`}
          >
            Adjust
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="flex flex-col flex-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="py-3 border-b border-[#eeeeee] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28 mt-1" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : filteredMovements.length === 0 ? (
          <div className="py-12 text-center text-[#5f5e5e]">
            <p className="font-medium text-[13px]">
              Belum ada data pergerakan stok untuk kategori ini.
            </p>
          </div>
        ) : (
          currentMovements.map((movement, idx) => (
            <StockMovementItem
              key={movement.id || idx}
              movement={movement}
              isLast={idx === currentMovements.length - 1}
            />
          ))
        )}
      </div>

      {/* Footer Pagination */}
      {!isLoading && filteredMovements.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#eeeeee] flex justify-between items-center text-[12px] text-[#5f5e5e]">
          <span>
            Menampilkan <strong className="text-[#1a1c1c]">{startIndex + 1}</strong>-
            <strong className="text-[#1a1c1c]">{endIndex}</strong> dari{' '}
            <strong className="text-[#1a1c1c]">{totalItems}</strong> catatan mutasi
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
