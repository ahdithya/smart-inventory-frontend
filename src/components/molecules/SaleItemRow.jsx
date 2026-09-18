import { Trash2 } from 'lucide-react';
import { Select } from '../atoms/Select';

export function SaleItemRow({
  item,
  index,
  products = [],
  onChange,
  onRemove,
  isOnly = false,
  disabled = false,
}) {
  const selectedProduct = products.find((p) => String(p.id) === String(item.product));
  const availableStock = selectedProduct ? selectedProduct.current_stock : 0;
  const isOverStock = selectedProduct && item.qty > availableStock;
  const unitPrice = item.unit_price !== undefined && item.unit_price !== null
    ? item.unit_price
    : (selectedProduct ? selectedProduct.selling_price : 0);
  const subtotal = (parseInt(item.qty, 10) || 0) * (parseFloat(unitPrice) || 0);

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    const prod = products.find((p) => String(p.id) === String(prodId));
    onChange(index, 'product', prodId ? Number(prodId) : '');
    if (prod) {
      onChange(index, 'unit_price', prod.selling_price);
    }
  };

  const handleQtyChange = (e) => {
    const val = parseInt(e.target.value, 10);
    onChange(index, 'qty', isNaN(val) ? '' : val);
  };

  return (
    <div className="flex flex-col gap-1 p-3 bg-[#fcfcfc] border border-[#eeeeee] rounded-[6px]">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Product Select */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e] mb-1 md:hidden">
            Produk
          </label>
          <Select
            value={item.product || ''}
            onChange={handleProductChange}
            disabled={disabled}
            className="text-[13px] h-10"
          >
            <option value="">-- Pilih Produk --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Sisa: {p.current_stock} {p.unit})
              </option>
            ))}
          </Select>
        </div>

        {/* Quantity Input */}
        <div className="w-full md:w-24">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e] mb-1 md:hidden">
            Kuantitas
          </label>
          <input
            type="number"
            min="1"
            max={selectedProduct ? availableStock : undefined}
            value={item.qty}
            onChange={handleQtyChange}
            disabled={disabled || !item.product}
            placeholder="Qty"
            className={`w-full h-10 px-3 text-center bg-white border rounded-[6px] text-[13px] text-[#1a1c1c] focus:outline-none transition-colors ${
              isOverStock
                ? 'border-[#ba1a1a] focus:border-[#ba1a1a] text-[#ba1a1a]'
                : 'border-[#e5e5e5] focus:border-[#6d28d9]'
            }`}
          />
        </div>

        {/* Unit Price Display */}
        <div className="w-full md:w-32 flex md:flex-col justify-between md:justify-center text-left md:text-right">
          <span className="text-[11px] text-[#7b7486] md:hidden">Harga:</span>
          <span className="text-[13px] text-[#5f5e5e] tabular-nums font-medium">
            Rp {Number(unitPrice || 0).toLocaleString('id-ID')}
          </span>
        </div>

        {/* Subtotal Display */}
        <div className="w-full md:w-36 flex md:flex-col justify-between md:justify-center text-left md:text-right">
          <span className="text-[11px] text-[#7b7486] md:hidden">Subtotal:</span>
          <span className="text-[14px] text-[#1a1c1c] font-semibold tabular-nums">
            Rp {Number(subtotal || 0).toLocaleString('id-ID')}
          </span>
        </div>

        {/* Remove Button */}
        <div className="flex justify-end md:justify-center">
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={isOnly || disabled}
            className="p-2 text-[#5f5e5e] hover:text-[#ba1a1a] hover:bg-[#fff5f5] rounded-[4px] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Hapus baris item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Warning if requested Qty > Current Stock */}
      {isOverStock && (
        <div className="text-[11px] text-[#ba1a1a] font-medium mt-1">
          Kuantitas melebihi stok tersedia (Maksimal: {availableStock} {selectedProduct.unit}).
        </div>
      )}
    </div>
  );
}
