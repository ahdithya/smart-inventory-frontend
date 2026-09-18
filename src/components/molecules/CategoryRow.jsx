import { Folder, Edit2, Trash2 } from 'lucide-react';

export function CategoryRow({
  category,
  isOwner = false,
  onEdit,
  onDelete,
  isLast = false,
}) {
  const { name, description } = category;

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[44px_1.5fr_2.5fr_100px] items-center gap-3 md:gap-4 px-5 py-3.5 transition-colors group hover:bg-[#fcfcfc] ${
        !isLast ? 'border-b border-[#eeeeee]' : ''
      }`}
    >
      {/* Icon */}
      <div className="hidden md:flex w-9 h-9 rounded-[6px] bg-[#f4f3f3] border border-[#e5e5e5] items-center justify-center text-[#6d28d9] shrink-0">
        <Folder className="w-4 h-4 stroke-[1.8]" />
      </div>

      {/* Name */}
      <div className="flex items-center gap-2">
        <div className="md:hidden w-7 h-7 rounded-[4px] bg-[#f4f3f3] border border-[#e5e5e5] flex items-center justify-center text-[#6d28d9] shrink-0">
          <Folder className="w-3.5 h-3.5 stroke-[1.8]" />
        </div>
        <span className="font-semibold text-[14px] text-[#1a1c1c] truncate">
          {name}
        </span>
      </div>

      {/* Description */}
      <div className="text-[13px] text-[#5f5e5e] line-clamp-1">
        {description || <span className="text-[#9ca3af] italic">Tanpa deskripsi</span>}
      </div>

      {/* Actions (Owner Only) */}
      <div className="flex items-center justify-end gap-1.5">
        {isOwner ? (
          <>
            <button
              type="button"
              onClick={() => onEdit(category)}
              className="p-1.5 text-[#5f5e5e] hover:text-[#6d28d9] hover:bg-[#f4f3f3] rounded-[4px] transition-colors focus:outline-none"
              title="Edit Kategori"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(category)}
              className="p-1.5 text-[#5f5e5e] hover:text-[#ba1a1a] hover:bg-[#fff5f5] rounded-[4px] transition-colors focus:outline-none"
              title="Hapus Kategori"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <span className="text-[11px] text-[#9ca3af] font-medium uppercase tracking-wider">
            Read Only
          </span>
        )}
      </div>
    </div>
  );
}
