import { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { SaleItemRow } from '../molecules/SaleItemRow';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { Plus } from 'lucide-react';
import { ApiError } from '../../services/api';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export function SaleCreateModal({
  isOpen = false,
  onClose,
  onSubmit,
  products = [],
  isLoading = false,
}) {
  const [saleDate, setSaleDate] = useState(getTodayDateString());
  const [items, setItems] = useState([{ product: '', qty: 1, unit_price: 0 }]);
  const [generalError, setGeneralError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Reset state when modal opens
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSaleDate(getTodayDateString());
      setItems([{ product: '', qty: 1, unit_price: 0 }]);
      setGeneralError('');
      setValidationErrors({});
    }
  }

  const handleAddItem = () => {
    setItems((prev) => [...prev, { product: '', qty: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (generalError) setGeneralError('');
    if (validationErrors.items) {
      setValidationErrors((prev) => ({ ...prev, items: '' }));
    }
  };

  // Grand Total Calculation
  const grandTotal = items.reduce((acc, itm) => {
    if (!itm.product) return acc;
    const qty = parseInt(itm.qty, 10) || 0;
    const price = parseFloat(itm.unit_price) || 0;
    return acc + qty * price;
  }, 0);

  const validateForm = () => {
    const errs = {};
    if (!saleDate) {
      errs.sale_date = 'Tanggal transaksi wajib diisi.';
    }

    const filledItems = items.filter((i) => Boolean(i.product));
    if (filledItems.length === 0) {
      errs.items = 'Pilih minimal satu produk untuk dicatat.';
      return errs;
    }

    // Check quantity & stock for each item
    for (let i = 0; i < filledItems.length; i++) {
      const itm = filledItems[i];
      const prod = products.find((p) => String(p.id) === String(itm.product));
      const qty = parseInt(itm.qty, 10);

      if (isNaN(qty) || qty < 1) {
        errs.items = `Kuantitas untuk produk "${prod?.name || 'Item'}" minimal 1.`;
        return errs;
      }

      if (prod && qty > prod.current_stock) {
        errs.items = `Stok untuk "${prod.name}" tidak mencukupi (Tersedia: ${prod.current_stock} ${prod.unit}, Diminta: ${qty}).`;
        return errs;
      }
    }

    // Check for duplicate products in single transaction
    const prodIds = filledItems.map((i) => i.product);
    const uniqueIds = new Set(prodIds);
    if (uniqueIds.size < prodIds.length) {
      errs.items = 'Terdapat produk yang dipilih lebih dari satu kali. Gabungkan kuantitasnya dalam satu baris.';
      return errs;
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (errors.items) setGeneralError(errors.items);
      return;
    }

    const validItems = items
      .filter((i) => Boolean(i.product))
      .map((i) => ({
        product: Number(i.product),
        qty: parseInt(i.qty, 10),
        unit_price: parseFloat(i.unit_price) || 0,
      }));

    const payload = {
      sale_date: saleDate,
      items: validItems,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && err.fields.items) {
          const msg = Array.isArray(err.fields.items)
            ? err.fields.items[0]
            : String(err.fields.items);
          setGeneralError(msg);
        } else {
          setGeneralError(err.message || 'Gagal mencatat transaksi penjualan.');
        }
      } else {
        setGeneralError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Transaksi Penjualan"
      maxWidth="max-w-[760px]"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {generalError && <Alert type="error" message={generalError} />}

        {/* Tanggal Penjualan */}
        <div className="flex flex-col gap-1.5 w-full sm:w-64">
          <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
            Tanggal Penjualan <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 bg-white border border-[#e5e5e5] rounded-[6px] text-[13px] text-[#1a1c1c] focus:outline-none focus:border-[#6d28d9] transition-colors"
          />
          {validationErrors.sale_date && (
            <span className="text-[12px] text-[#ba1a1a]">
              {validationErrors.sale_date}
            </span>
          )}
        </div>

        {/* Daftar Item Penjualan */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
              Daftar Item Transaksi <span className="text-[#ba1a1a]">*</span>
            </label>
            <span className="text-[12px] text-[#7b7486]">
              {items.length} baris item
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
            {items.map((item, index) => (
              <SaleItemRow
                key={index}
                item={item}
                index={index}
                products={products}
                onChange={handleItemChange}
                onRemove={handleRemoveItem}
                isOnly={items.length === 1}
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            disabled={isLoading}
            className="self-start mt-1 inline-flex items-center gap-2 text-[13px] font-medium text-[#6d28d9] hover:bg-[#6d28d9]/10 px-3 py-1.5 rounded-[4px] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item Lain</span>
          </button>
        </div>

        {/* Ringkasan Total & Actions */}
        <div className="pt-4 border-t border-[#e5e5e5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5e]">
              Total Transaksi
            </span>
            <span className="text-[22px] font-bold text-[#1a1c1c] tabular-nums">
              Rp {Number(grandTotal).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Simpan Transaksi
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
