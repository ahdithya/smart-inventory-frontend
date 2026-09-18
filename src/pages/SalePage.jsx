import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/templates/AppLayout';
import { SaleFilterBar } from '../components/molecules/SaleFilterBar';
import { SaleTable } from '../components/organisms/SaleTable';
import { SaleCreateModal } from '../components/organisms/SaleCreateModal';
import { SaleDetailModal } from '../components/organisms/SaleDetailModal';
import { Alert } from '../components/atoms/Alert';
import { saleService } from '../services/sale';
import { productService } from '../services/product';

export function SalePage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  // Feedback Notification
  const [feedback, setFeedback] = useState(null);

  const refreshProducts = async () => {
    try {
      const prods = await productService.getProducts({ is_active: 'true' });
      setProducts(prods);
    } catch {
      // ignore
    }
  };

  // Initial load & date filter trigger
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const [salesData, prodsData] = await Promise.all([
          saleService.getSales(params),
          productService.getProducts({ is_active: 'true' }),
        ]);

        if (!ignore) {
          setSales(salesData);
          setProducts(prodsData);
        }
      } catch {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: 'Gagal memuat riwayat transaksi penjualan.',
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [startDate, endDate]);

  // Client-side search filter (TRX ID or User)
  const filteredSales = useMemo(() => {
    if (!searchQuery.trim()) return sales;
    const q = searchQuery.toLowerCase();
    return sales.filter((s) => {
      const trxIdStr = `trx-#${String(s.id).padStart(4, '0')}`.toLowerCase();
      const matchTrx = trxIdStr.includes(q) || String(s.id).includes(q);
      const matchUser = s.user_username?.toLowerCase().includes(q);
      return matchTrx || matchUser;
    });
  }, [sales, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery || startDate || endDate);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  // Create Sale Submit
  const handleCreateSaleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const created = await saleService.createSale(payload);
      setSales((prev) => [
        {
          id: created.id,
          sale_date: created.sale_date,
          user: created.user,
          user_username: created.user_username,
          items_count: created.items?.length || payload.items?.length || 1,
          total: created.total,
          created_at: created.created_at,
        },
        ...prev,
      ]);

      // Refetch products to update current_stock
      refreshProducts();

      setFeedback({
        type: 'success',
        message: `Transaksi TRX-#${String(created.id).padStart(4, '0')} berhasil disimpan. Stok produk telah diperbarui.`,
      });
      setIsCreateOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Detail
  const handleOpenDetail = (sale) => {
    setSelectedSaleId(sale.id);
    setIsDetailOpen(true);
  };

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
              Penjualan
            </h1>
            <p className="text-[14px] text-[#5f5e5e] mt-1">
              Catat transaksi penjualan harian dan pantau riwayat transaksi kasir toko.
            </p>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div className="mb-6">
            <Alert
              type={feedback.type}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
          </div>
        )}

        {/* Filter Toolbar */}
        <SaleFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onResetFilters={handleResetFilters}
          onAddClick={() => {
            setIsCreateOpen(true);
            setFeedback(null);
          }}
        />

        {/* Sales Table */}
        <SaleTable
          sales={filteredSales}
          isLoading={isLoading}
          onDetail={handleOpenDetail}
          onAddClick={() => {
            setIsCreateOpen(true);
            setFeedback(null);
          }}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Modal: Transaksi Baru */}
        <SaleCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateSaleSubmit}
          products={products}
          isLoading={isSubmitting}
        />

        {/* Modal: Rincian Transaksi */}
        <SaleDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedSaleId(null);
          }}
          saleId={selectedSaleId}
        />
      </div>
    </AppLayout>
  );
}
