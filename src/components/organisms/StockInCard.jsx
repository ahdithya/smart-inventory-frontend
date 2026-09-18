import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { ErrorText } from '../atoms/ErrorText';

const getTodayDate = () => new Date().toISOString().split('T')[0];

export function StockInCard({
  products = [],
  onSubmit,
  isLoading = false,
}) {
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('');
  const [movementDate, setMovementDate] = useState(getTodayDate());
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  const selectedProduct = products.find((p) => String(p.id) === String(productId));

  const validate = () => {
    const errs = {};
    if (!productId) {
      errs.product = 'Pilih produk yang masuk.';
    }
    const numQty = parseInt(qty, 10);
    if (isNaN(numQty) || numQty <= 0) {
      errs.qty = 'Jumlah stok masuk harus lebih dari 0.';
    }
    if (!movementDate) {
      errs.movement_date = 'Tanggal penerimaan barang wajib diisi.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const payload = {
      product: Number(productId),
      type: 'IN',
      qty: parseInt(qty, 10),
      movement_date: movementDate,
      note: note.trim() || undefined,
    };

    try {
      await onSubmit(payload);
      // Reset form on success
      setProductId('');
      setQty('');
      setNote('');
      setMovementDate(getTodayDate());
    } catch {
      // Handled by parent notification
    }
  };

  return (
    <section className="bg-white border border-[#e5e5e5] rounded-[8px] p-6 shadow-none">
      <div className="mb-5 pb-3 border-b border-[#eeeeee]">
        <h3 className="text-[17px] font-bold text-[#1a1c1c] flex items-center gap-2">
          <PackagePlus className="w-5 h-5 text-[#6d28d9]" />
          <span>Stok Masuk</span>
        </h3>
        <p className="text-[13px] text-[#5f5e5e] mt-0.5">
          Catat penambahan stok baru dari supplier.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Row 1: Produk Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
            Pilih Produk <span className="text-[#ba1a1a]">*</span>
          </label>
          <Select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              if (errors.product) setErrors((prev) => ({ ...prev, product: '' }));
            }}
            disabled={isLoading}
            isError={!!errors.product}
            className="h-10 text-[13px]"
          >
            <option value="">-- Pilih Produk --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Sisa: {p.current_stock} {p.unit})
              </option>
            ))}
          </Select>
          {errors.product && <ErrorText>{errors.product}</ErrorText>}
        </div>

        {/* Row 2: Qty & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
              Kuantitas Masuk <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                placeholder="0"
                value={qty}
                onChange={(e) => {
                  setQty(e.target.value);
                  if (errors.qty) setErrors((prev) => ({ ...prev, qty: '' }));
                }}
                disabled={isLoading}
                className={`w-full h-10 px-3 pr-10 bg-white border rounded-[6px] text-[13px] text-[#1a1c1c] focus:outline-none transition-colors ${
                  errors.qty
                    ? 'border-[#ba1a1a] focus:border-[#ba1a1a]'
                    : 'border-[#e5e5e5] focus:border-[#6d28d9]'
                }`}
              />
              {selectedProduct && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#7b7486]">
                  {selectedProduct.unit}
                </span>
              )}
            </div>
            {errors.qty && <ErrorText>{errors.qty}</ErrorText>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
              Tanggal Penerimaan <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="date"
              value={movementDate}
              onChange={(e) => {
                setMovementDate(e.target.value);
                if (errors.movement_date) setErrors((prev) => ({ ...prev, movement_date: '' }));
              }}
              disabled={isLoading}
              className="w-full h-10 px-3 bg-white border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] focus:outline-none focus:border-[#6d28d9] transition-colors"
            />
            {errors.movement_date && <ErrorText>{errors.movement_date}</ErrorText>}
          </div>
        </div>

        {/* Row 3: Catatan / Supplier */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
            Catatan / Supplier <span className="text-[#7b7486] font-normal lowercase">(opsional)</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Supplier CV Kopi Nusantara / PO-2026-09"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 bg-white border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] placeholder-[#9ca3af] focus:outline-none focus:border-[#6d28d9] transition-colors"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full h-10 text-[13px]"
          >
            Simpan Stok Masuk
          </Button>
        </div>
      </form>
    </section>
  );
}
