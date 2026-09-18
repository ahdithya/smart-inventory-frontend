import { CategoryRow } from '../molecules/CategoryRow';
import { Skeleton } from '../atoms/Skeleton';
import { FolderPlus } from 'lucide-react';

export function CategoryTable({
  categories = [],
  isLoading = false,
  isOwner = false,
  onEdit,
  onDelete,
  onAddClick,
  searchQuery = '',
}) {
  return (
    <div className="flex flex-col bg-white border border-[#e5e5e5] rounded-[8px] overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[44px_1.5fr_2.5fr_100px] items-center gap-4 px-5 py-3 bg-[#f9f9f9] border-b border-[#e5e5e5]">
        <div className="font-semibold text-[11px] tracking-[0.08em] uppercase text-[#7b7486]">
          Ikon
        </div>
        <div className="font-semibold text-[11px] tracking-[0.08em] uppercase text-[#7b7486]">
          Nama Kategori
        </div>
        <div className="font-semibold text-[11px] tracking-[0.08em] uppercase text-[#7b7486]">
          Deskripsi
        </div>
        <div className="font-semibold text-[11px] tracking-[0.08em] uppercase text-[#7b7486] text-right">
          Aksi
        </div>
      </div>

      {/* Table Body */}
      {isLoading ? (
        <div className="p-5 flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : categories.length === 0 ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#f4f3f3] border border-[#e5e5e5] flex items-center justify-center text-[#7b7486]">
            <FolderPlus className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1a1c1c]">
              {searchQuery ? 'Tidak ada kategori yang cocok' : 'Belum ada kategori'}
            </p>
            <p className="text-[13px] text-[#7b7486] mt-0.5">
              {searchQuery
                ? `Tidak ditemukan kategori dengan kata kunci "${searchQuery}".`
                : 'Mulai dengan menambahkan kategori produk pertama Anda.'}
            </p>
          </div>
          {!searchQuery && isOwner && (
            <button
              type="button"
              onClick={onAddClick}
              className="mt-2 text-[13px] font-semibold text-[#6d28d9] hover:underline"
            >
              + Tambah Kategori Baru
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          {categories.map((category, idx) => (
            <CategoryRow
              key={category.id}
              category={category}
              isOwner={isOwner}
              onEdit={onEdit}
              onDelete={onDelete}
              isLast={idx === categories.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
