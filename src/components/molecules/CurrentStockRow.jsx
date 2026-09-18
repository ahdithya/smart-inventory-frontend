import { Badge } from '../atoms/Badge';

export function CurrentStockRow({ item }) {
  const { name, sku, category_name, current_stock, unit, stock_status } = item;

  return (
    <tr className="border-b border-[#eeeeee] hover:bg-[#fafafa] transition-colors">
      <td className="py-3 px-4">
        <span className="font-medium text-[#1a1c1c] block text-[13px]">
          {name}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-[#5f5e5e]">
          {sku && <span className="font-mono text-[#7b7486]">{sku}</span>}
          {sku && category_name && <span>•</span>}
          {category_name && <span>{category_name}</span>}
        </div>
      </td>
      <td className="py-3 px-4 text-right tabular-nums">
        <span className="font-bold text-[#1a1c1c] text-[14px]">
          {current_stock ?? 0}
        </span>{' '}
        <span className="text-[12px] text-[#5f5e5e] font-normal">{unit}</span>
      </td>
      <td className="py-3 px-4 text-center">
        <Badge status={stock_status?.toLowerCase()} />
      </td>
    </tr>
  );
}
