import { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { FormField } from './FormField';
import { Alert } from '../atoms/Alert';
import { stockService } from '../../services/stock';
import { ArrowDownLeft, CheckCircle2 } from 'lucide-react';

export function QuickRestockModal({
  isOpen = false,
  onClose,
  recommendation = null,
  onSuccess,
}) {
  const [qty, setQty] = useState(
    recommendation ? String(recommendation.recommended_qty || 10) : ''
  );
  const [note, setNote] = useState(
    recommendation ? `Restock rekomendasi AI (${recommendation.product_sku})` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!recommendation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numQty = parseInt(qty, 10);

    if (isNaN(numQty) || numQty <= 0) {
      setErrorMessage('Jumlah stok masuk harus berupa angka positif lebih dari 0.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await stockService.createStockMovement({
        product: recommendation.product,
        type: 'IN',
        qty: numQty,
        note: note.trim() || 'Restock rekomendasi sistem',
      });

      setSuccessMessage(`Berhasil menambahkan ${numQty} unit stok masuk.`);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } catch (err) {
      setErrorMessage(
        err?.message || 'Gagal menyimpan transaksi stok masuk ke server.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aksi Cepat Restock (Stok Masuk)"
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[12px] h-[36px]"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !!successMessage}
            className="text-[12px] h-[36px] flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Konfirmasi Stok Masuk'}</span>
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMessage && <Alert type="error" message={errorMessage} />}
        {successMessage && (
          <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-[6px] text-[13px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Product Info Banner */}
        <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px]">
          <div className="text-[11px] font-bold text-[#6d28d9] font-mono">
            {recommendation.product_sku}
          </div>
          <div className="text-[14px] font-bold text-[#1a1c1c]">
            {recommendation.product_name}
          </div>
          <div className="text-[12px] text-[#64748b] mt-1 flex items-center gap-3">
            <span>Stok Terkini: <strong>{recommendation.current_stock}</strong></span>
            <span>Safety Stock: <strong>{recommendation.safety_stock}</strong></span>
          </div>
        </div>

        {/* Quantity Field */}
        <FormField
          label="Jumlah Kuantitas Restock"
          id="restock-qty"
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Masukkan jumlah unit"
          helperText={`Rekomendasi AI: ${recommendation.recommended_qty} unit`}
          required
        />

        {/* Note Field */}
        <FormField
          label="Catatan / Keterangan Transaksi"
          id="restock-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: Pengiriman dari Supplier A"
        />
      </form>
    </Modal>
  );
}
