import { Search, X } from 'lucide-react';

export function SearchBar({
  value = '',
  onChange,
  placeholder = 'Cari kategori...',
  className = '',
}) {
  return (
    <div className={`relative flex items-center w-full max-w-sm ${className}`}>
      <Search className="w-4 h-4 absolute left-3 text-[#7b7486] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-8 bg-white border border-[#e5e5e5] rounded-[6px] text-[14px] text-[#1a1c1c] placeholder:text-[#9ca3af] focus:border-[#6d28d9] focus:outline-none transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 text-[#7b7486] hover:text-[#1a1c1c] p-0.5 rounded-full"
          aria-label="Bersihkan pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
