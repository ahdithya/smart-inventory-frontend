import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isLoading = false,
}) {
  const footer = (
    <>
      <Button
        variant="secondary"
        fullWidth={false}
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant="primary"
        fullWidth={false}
        onClick={onConfirm}
        isLoading={isLoading}
        className="!bg-[#ba1a1a] hover:!bg-[#991b1b] focus-visible:!ring-[#ba1a1a]"
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      maxWidth="max-w-sm"
    >
      <div className="flex items-start gap-3 py-1">
        <div className="w-9 h-9 rounded-full bg-[#fff5f5] border border-[#fca5a5] flex items-center justify-center text-[#ba1a1a] shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-[14px] text-[#5f5e5e] leading-relaxed">
          {message}
        </p>
      </div>
    </Modal>
  );
}
