import { useState } from 'react';
import { SlidersHorizontal, ShieldAlert, Plus, Minus } from 'lucide-react';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { ErrorText } from '../atoms/ErrorText';

export function StockAdjustCard({
  products = [],
  isOwner = false,
  onSubmit,
  isLoading = false,
}) {
  const [productId, setProductId] = useState('');
  const [qtyDelta, setQtyDelta] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  const selectedProduct = products.find((p) => String(p.id) === String(productId));
  const currentStock = selectedProduct ? selectedProduct.current_stock : 0;
  const numDelta = parseInt(qtyDelta, 10) || 0;
  const resultingStock = currentStock + numDelta;

  const validate = () => {
    const errs = {};
    if (!productId) {
      errs.product = 'Pilih produk yang akan disesuaikan.';
    }
    if (!qtyDelta || numDelta === 0) {
      errs.qty = 'Perubahan stok tidak boleh 0 (gunakan nilai minus atau plus).';
    } else if (resultingStock < 0) {
      errs.qty = `Stok akhir tidak boleh negatif (Tersedia: ${currentStock}, Penyesuaian: ${numDelta}).`;
    }
    if (!reason.trim()) {
      errs.reason = 'Alasan penyesuaian stok wajib diisi.';
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
      type: 'ADJUST',
      qty: numDelta,
      note: reason.trim(),
    };

    try {
      await onSubmit(payload);
      // Reset form
      setProductId('');
      setQtyDelta('');
      setReason('');
    } catch {
      // Handled by parent
    }
  };

  const handleStep = (step) => {
    setQtyDelta((prev) => {
      const cur = parseInt(prev, 10) || 0;
      return String(cur + step);
    });
    if (errors.qty) setErrors((prev) => ({ ...prev, qty: '' }));
  };

  return (
    <section className="bg-white border border-[#e5e5e5] rounded-[8px] p-6 shadow-none">
      <div className="mb-5 pb-3 border-b border-[#eeeeee]">
        <h3 className="text-[17px] font-bold text-[#1a1c1c] flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#b8860b]" />
          <span>Adjustment Stok</span>
        </h3>
        <p className="text-[13px] text-[#5f5e5e] mt-0.5">
          Koreksi jumlah stok karena rusak, hilang, atau selisih opname.
        </p>
      </div>

      {!isOwner ? (
        <div className="p-4 bg-[#fffbeb] border border-[#b8860b]/30 rounded-[6px] flex items-start gap-3 text-[#b8860b]">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[13px]">
            <p className="font-semibold text-[#1a1c1c]">Akses Terbatas</p>
            <p className="text-[#5f5e5e] mt-0.5">
              Hanya akun dengan peran <strong className="text-[#1a1c1c]">Owner</strong> yang berwenang melakukan koreksi dan penyesuaian stok opname.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Produk Selection */}
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
                  {p.name} (Stok Saat Ini: {p.current_stock} {p.unit})
                </option>
              ))}
            </Select>
            {errors.product && <ErrorText>{errors.product}</ErrorText>}
          </div>

          {/* Delta Qty Controls */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
              Perubahan Stok (±) <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={isLoading || !productId}
                className="w-10 h-10 border border-[#e5e5e5] rounded-[6px] flex items-center justify-center text-[#5f5e5e] hover:text-[#ba1a1a] hover:bg-[#fff5f5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Kurangi stok"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                placeholder="0"
                value={qtyDelta}
                onChange={(e) => {
                  setQtyDelta(e.target.value);
                  if (errors.qty) setErrors((prev) => ({ ...prev, qty: '' }));
                }}
                disabled={isLoading || !productId}
                className={`flex-1 h-10 px-3 text-center bg-white border rounded-[6px] text-[14px] font-bold text-[#1a1c1c] focus:outline-none transition-colors ${
                  errors.qty
                    ? 'border-[#ba1a1a] focus:border-[#ba1a1a]'
                    : 'border-[#e5e5e5] focus:border-[#6d28d9]'
                }`}
              />
              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={isLoading || !productId}
                className="w-10 h-10 border border-[#e5e5e5] rounded-[6px] flex items-center justify-center text-[#5f5e5e] hover:text-[#2e7d32] hover:bg-[#f0fdf4] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Tambah stok"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {selectedProduct && qtyDelta && !errors.qty && (
              <span className="text-[12px] text-[#5f5e5e] mt-0.5">
                Stok Akhir:{' '}
                <strong
                  className={
                    resultingStock < 0 ? 'text-[#ba1a1a]' : 'text-[#1a1c1c]'
                  }
                >
                  {resultingStock} {selectedProduct.unit}
                </strong>
              </span>
            )}
            {errors.qty && <ErrorText>{errors.qty}</ErrorText>}
          </div>

          {/* Alasan Penyesuaian */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
              Alasan Penyesuaian <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              placeholder="Misal: Barang rusak / Tumpah / Selisih opname"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) setErrors((prev) => ({ ...prev, reason: '' }));
              }}
              disabled={isLoading}
              className={`w-full h-10 px-3 bg-white border rounded-[6px] text-[13px] text-[#1a1c1c] placeholder-[#9ca3af] focus:outline-none transition-colors ${
                errors.reason
                  ? 'border-[#ba1a1a] focus:border-[#ba1a1a]'
                  : 'border-[#e5e5e5] focus:border-[#6d28d9]'
              }`}
            />
            {errors.reason && <ErrorText>{errors.reason}</ErrorText>}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              isLoading={isLoading}
              className="w-full h-10 text-[13px] border-[#e5e5e5] hover:border-[#6d28d9]"
            >
              Update Penyesuaian
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
