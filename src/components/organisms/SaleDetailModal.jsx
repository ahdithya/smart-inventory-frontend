import { useState, useEffect } from 'react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';
import { saleService } from '../../services/sale';

export function SaleDetailModal({ isOpen = false, onClose, saleId = null }) {
  const [saleDetail, setSaleDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [prevSaleId, setPrevSaleId] = useState(saleId);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (prevSaleId !== saleId || prevIsOpen !== isOpen) {
    setPrevSaleId(saleId);
    setPrevIsOpen(isOpen);
    if (isOpen && saleId) {
      setIsLoading(true);
      setError('');
      setSaleDetail(null);
    } else {
      setIsLoading(false);
      setError('');
      setSaleDetail(null);
    }
  }

  useEffect(() => {
    let ignore = false;

    if (isOpen && saleId) {
      saleService
        .getSale(saleId)
        .then((data) => {
          if (!ignore) {
            setSaleDetail(data);
          }
        })
        .catch(() => {
          if (!ignore) {
            setError('Gagal memuat rincian transaksi penjualan.');
          }
        })
        .finally(() => {
          if (!ignore) {
            setIsLoading(false);
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [isOpen, saleId]);

  const formattedDate = saleDetail?.sale_date
    ? new Date(saleDetail.sale_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={saleId ? `Rincian Transaksi TRX-#${String(saleId).padStart(4, '0')}` : 'Rincian Transaksi'}
      maxWidth="max-w-[680px]"
    >
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex flex-col gap-3 py-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full mt-2" />
          </div>
        ) : error ? (
          <div className="py-6 text-center text-[#ba1a1a] text-[14px]">
            {error}
          </div>
        ) : saleDetail ? (
          <>
            {/* Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#f9f9f9] border border-[#eeeeee] rounded-[6px]">
              <div>
                <span className="block text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em]">
                  Tanggal
                </span>
                <span className="text-[13px] text-[#1a1c1c] font-medium">
                  {formattedDate}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em]">
                  Kasir / Pencatat
                </span>
                <span className="text-[13px] text-[#1a1c1c] font-medium">
                  {saleDetail.user_username || 'Staff'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em]">
                  Total Item
                </span>
                <span className="text-[13px] text-[#1a1c1c] font-medium">
                  {saleDetail.items?.length || 0} Item
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-[#e5e5e5] rounded-[6px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em]">
                      Produk
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em] text-center w-16">
                      Qty
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em] text-right w-28">
                      Harga
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em] text-right w-32">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {saleDetail.items?.map((itm, idx) => (
                    <tr
                      key={itm.id || idx}
                      className="border-b border-[#eeeeee] last:border-b-0 hover:bg-[#fafafa]"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#1a1c1c] block">
                          {itm.product_name || 'Produk'}
                        </span>
                        {itm.product_sku && (
                          <span className="text-[11px] text-[#7b7486] font-mono">
                            {itm.product_sku}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-[#1a1c1c]">
                        {itm.qty}
                      </td>
                      <td className="py-3 px-4 text-right text-[#5f5e5e] tabular-nums">
                        Rp {Number(itm.unit_price || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-[#1a1c1c] tabular-nums">
                        Rp {Number(itm.subtotal || 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            <div className="flex justify-between items-center px-4 py-3 bg-[#fafafa] border border-[#e5e5e5] rounded-[6px]">
              <span className="text-[13px] font-semibold text-[#5f5e5e] uppercase tracking-[0.08em]">
                Total Pembayaran
              </span>
              <span className="text-[20px] font-bold text-[#1a1c1c] tabular-nums">
                Rp {Number(saleDetail.total || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </>
        ) : null}

        {/* Action button */}
        <div className="flex justify-end pt-2 border-t border-[#e5e5e5]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
