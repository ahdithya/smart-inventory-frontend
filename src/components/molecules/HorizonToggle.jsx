export function HorizonToggle({ horizon = 7, onChange, className = '' }) {
  return (
    <div className={`inline-flex rounded-[6px] border border-[#e5e5e5] p-0.5 bg-[#f4f3f3] text-[12px] font-medium ${className}`}>
      <button
        type="button"
        onClick={() => onChange(7)}
        className={`px-3.5 py-1 rounded-[4px] transition-all flex items-center gap-1.5 ${
          horizon === 7
            ? 'bg-white text-[#6d28d9] font-semibold shadow-xs'
            : 'text-[#5f5e5e] hover:text-[#1a1c1c]'
        }`}
      >
        <span>Horizon 7 Hari</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f4f3f3] text-[#7b7486]">
          Mingguan
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange(14)}
        className={`px-3.5 py-1 rounded-[4px] transition-all flex items-center gap-1.5 ${
          horizon === 14
            ? 'bg-white text-[#6d28d9] font-semibold shadow-xs'
            : 'text-[#5f5e5e] hover:text-[#1a1c1c]'
        }`}
      >
        <span>Horizon 14 Hari</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f4f3f3] text-[#7b7486]">
          Dua Mingguan
        </span>
      </button>
    </div>
  );
}
