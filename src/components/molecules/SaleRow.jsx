import { Eye } from 'lucide-react';

export function SaleRow({ sale, onDetail }) {
  const { id, sale_date, user_username, items_count, total } = sale;

  const formattedDate = sale_date
    ? new Date(sale_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  const formattedTotal = `Rp ${Number(total || 0).toLocaleString('id-ID')}`;

  return (
    <tr className="border-b border-[#eeeeee] hover:bg-[#fafafa] transition-colors group">
      <td className="py-4 px-6 font-mono text-[13px] font-medium text-[#1a1c1c]">
        TRX-#{String(id).padStart(4, '0')}
      </td>
      <td className="py-4 px-6 text-[#5f5e5e] text-[13px]">
        {formattedDate}
      </td>
      <td className="py-4 px-6 text-[#1a1c1c] text-[13px] font-medium">
        {user_username || 'Kasir'}
      </td>
      <td className="py-4 px-6 text-[#5f5e5e] text-[13px]">
        {items_count ?? 1} Item
      </td>
      <td className="py-4 px-6 text-right font-semibold text-[#1a1c1c] tabular-nums">
        {formattedTotal}
      </td>
      <td className="py-4 px-6 text-center">
        <button
          type="button"
          onClick={() => onDetail(sale)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium text-[#6d28d9] hover:bg-[#6d28d9]/10 rounded-[4px] transition-colors focus:outline-none"
          title="Lihat rincian transaksi"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Detail</span>
        </button>
      </td>
    </tr>
  );
}
