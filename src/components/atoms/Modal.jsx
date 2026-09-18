import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${maxWidth} bg-white border border-[#e5e5e5] rounded-[8px] shadow-lg flex flex-col max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeeeee]">
          <h2 className="text-[17px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7b7486] hover:text-[#1a1c1c] hover:bg-[#f4f3f3] p-1.5 rounded-[4px] transition-colors focus:outline-none"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-[14px] text-[#1a1c1c]">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-[#eeeeee] flex items-center justify-end gap-3 bg-[#fdfdfd]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
