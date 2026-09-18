import { useState } from 'react';
import { ProductRow } from '../molecules/ProductRow';
import { Skeleton } from '../atoms/Skeleton';
import { Button } from '../atoms/Button';
import { Package, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export function ProductTable({
  products = [],
  isLoading = false,
  isOwner = false,
  onEdit,
  onDelete,
  onAddClick,
  hasActiveFilters = false,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculation
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[8px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
              <th className="py-3.5 px-6 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase">
                Nama Produk
              </th>
              <th className="py-3.5 px-6 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase">
                SKU
              </th>
              <th className="py-3.5 px-6 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase">
                Kategori
              </th>
              <th className="py-3.5 px-6 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase text-right">
                Harga Jual
              </th>
              <th className="py-3.5 px-6 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase text-right">
                Stok (Satuan)
              </th>
              <th className="py-3.5 px-6 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase">
                Status
              </th>
              {isOwner && (
                <th className="py-3.5 px-6 font-semibold text-[11px] tracking-[0.08em] text-[#5f5e5e] uppercase text-center w-20">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-[#eeeeee]">
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-36" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  {isOwner && (
                    <td className="py-4 px-6 text-center">
                      <Skeleton className="h-4 w-10 mx-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : products.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={isOwner ? 7 : 6}
                  className="py-16 text-center text-[#5f5e5e]"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#f4f3f3] flex items-center justify-center text-[#5f5e5e]">
                      <Package className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    {hasActiveFilters ? (
                      <>
                        <p className="font-semibold text-[15px] text-[#1a1c1c]">
                          Tidak ada produk yang cocok
                        </p>
                        <p className="text-[13px] text-[#5f5e5e] max-w-sm">
                          Coba sesuaikan kata kunci pencarian, pilihan kategori, atau filter status.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-[15px] text-[#1a1c1c]">
                          Belum ada data produk
                        </p>
                        <p className="text-[13px] text-[#5f5e5e] max-w-sm">
                          Mulai tambahkan produk ke dalam inventaris katalog toko Anda.
                        </p>
                        {isOwner && (
                          <Button
                            type="button"
                            variant="primary"
                            onClick={onAddClick}
                            className="mt-2 flex items-center gap-2 text-[13px]"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Produk Sekarang</span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Rows
              currentProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isOwner={isOwner}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && products.length > 0 && (
        <div className="px-6 py-3.5 flex items-center justify-between border-t border-[#e5e5e5] bg-[#fafafa]">
          <span className="text-[13px] text-[#5f5e5e]">
            Menampilkan{' '}
            <span className="font-medium text-[#1a1c1c]">{startIndex + 1}</span>-
            <span className="font-medium text-[#1a1c1c]">{endIndex}</span> dari{' '}
            <span className="font-medium text-[#1a1c1c]">{totalItems}</span> produk
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={safePage <= 1}
              className="p-1.5 border border-[#e5e5e5] rounded-[4px] bg-white text-[#5f5e5e] hover:text-[#1a1c1c] hover:bg-[#f4f3f3] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[12px] px-2 font-medium text-[#5f5e5e]">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={safePage >= totalPages}
              className="p-1.5 border border-[#e5e5e5] rounded-[4px] bg-white text-[#5f5e5e] hover:text-[#1a1c1c] hover:bg-[#f4f3f3] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
