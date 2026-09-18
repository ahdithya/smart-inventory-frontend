import { Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../atoms/Badge';

export function ProductRow({
  product,
  isOwner = false,
  onEdit,
  onDelete,
}) {
  const {
    name,
    sku,
    category_name,
    selling_price,
    current_stock,
    unit,
    stock_status,
  } = product;

  const formattedPrice = `Rp ${Number(selling_price || 0).toLocaleString('id-ID')}`;

  return (
    <tr className="border-b border-[#eeeeee] hover:bg-[#fafafa] transition-colors group">
      <td className="py-4 px-6 font-medium text-[#1a1c1c]">
        {name}
      </td>
      <td className="py-4 px-6 text-[#5f5e5e] font-mono text-[13px]">
        {sku}
      </td>
      <td className="py-4 px-6 text-[#5f5e5e] text-[13px]">
        {category_name || <span className="text-[#9ca3af] italic">Tanpa Kategori</span>}
      </td>
      <td className="py-4 px-6 text-right font-medium text-[#1a1c1c] tabular-nums">
        {formattedPrice}
      </td>
      <td className="py-4 px-6 text-right tabular-nums">
        <span className="font-semibold text-[#1a1c1c]">{current_stock ?? 0}</span>{' '}
        <span className="text-[#5f5e5e] text-[12px] ml-1">{unit}</span>
      </td>
      <td className="py-4 px-6">
        <Badge status={stock_status?.toLowerCase()} />
      </td>
      {isOwner && (
        <td className="py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="p-1.5 text-[#5f5e5e] hover:text-[#6d28d9] hover:bg-[#f4f3f3] rounded-[4px] transition-colors focus:outline-none"
              title="Edit Produk"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="p-1.5 text-[#5f5e5e] hover:text-[#ba1a1a] hover:bg-[#fff5f5] rounded-[4px] transition-colors focus:outline-none"
              title="Hapus / Nonaktifkan Produk"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
