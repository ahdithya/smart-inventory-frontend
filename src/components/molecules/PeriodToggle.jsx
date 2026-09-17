export function PeriodToggle({ period = 'weekly', onChange }) {
  return (
    <div className="inline-flex rounded-[6px] border border-[#e5e5e5] p-0.5 bg-[#f4f3f3] text-[12px] font-medium">
      <button
        type="button"
        onClick={() => onChange('weekly')}
        className={`px-3 py-1 rounded-[4px] transition-all ${
          period === 'weekly'
            ? 'bg-white text-[#6d28d9] font-semibold shadow-xs'
            : 'text-[#5f5e5e] hover:text-[#1a1c1c]'
        }`}
      >
        7 Hari
      </button>
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={`px-3 py-1 rounded-[4px] transition-all ${
          period === 'monthly'
            ? 'bg-white text-[#6d28d9] font-semibold shadow-xs'
            : 'text-[#5f5e5e] hover:text-[#1a1c1c]'
        }`}
      >
        30 Hari
      </button>
    </div>
  );
}
