import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppLayout } from '../components/templates/AppLayout';
import { StockInCard } from '../components/organisms/StockInCard';
import { StockAdjustCard } from '../components/organisms/StockAdjustCard';
import { CurrentStockTable } from '../components/organisms/CurrentStockTable';
import { StockMovementHistory } from '../components/organisms/StockMovementHistory';
import { Alert } from '../components/atoms/Alert';
import { stockService } from '../services/stock';
import { productService } from '../services/product';

export function StockPage() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  // Data states
  const [stockList, setStockList] = useState([]);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingIn, setIsSubmittingIn] = useState(false);
  const [isSubmittingAdjust, setIsSubmittingAdjust] = useState(false);

  // Notification banner
  const [feedback, setFeedback] = useState(null);

  // Initial load
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [stocks, prods, movs] = await Promise.all([
          stockService.getStockList({ is_active: 'true' }),
          productService.getProducts({ is_active: 'true' }),
          stockService.getStockMovements(),
        ]);

        if (!ignore) {
          setStockList(stocks);
          setProducts(prods);
          setMovements(movs);
        }
      } catch {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: 'Gagal memuat data inventaris stok dari server.',
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
  }, []);

  // Background refresh helper
  const refreshData = async () => {
    try {
      const [stocks, prods, movs] = await Promise.all([
        stockService.getStockList({ is_active: 'true' }),
        productService.getProducts({ is_active: 'true' }),
        stockService.getStockMovements(),
      ]);
      setStockList(stocks);
      setProducts(prods);
      setMovements(movs);
    } catch {
      // Background refresh failure handled silently
    }
  };

  // Submit Stok Masuk
  const handleStockIn = async (payload) => {
    setIsSubmittingIn(true);
    try {
      const res = await stockService.createStockMovement(payload);
      await refreshData();

      const prodName = res?.product_name || 'Produk';
      setFeedback({
        type: 'success',
        message: `Stok masuk sebanyak ${payload.qty} unit untuk "${prodName}" berhasil dicatat.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Gagal mencatat stok masuk.',
      });
      throw err;
    } finally {
      setIsSubmittingIn(false);
    }
  };

  // Submit Adjustment Stok
  const handleStockAdjust = async (payload) => {
    setIsSubmittingAdjust(true);
    try {
      const res = await stockService.createStockMovement(payload);
      await refreshData();

      const prodName = res?.product_name || 'Produk';
      const deltaSign = payload.qty > 0 ? `+${payload.qty}` : `${payload.qty}`;
      setFeedback({
        type: 'success',
        message: `Penyesuaian stok (${deltaSign}) untuk "${prodName}" berhasil diperbarui.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Gagal melakukan penyesuaian stok.',
      });
      throw err;
    } finally {
      setIsSubmittingAdjust(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
              Manajemen Stok
            </h1>
            <p className="text-[14px] text-[#5f5e5e] mt-1">
              Pantau ketersediaan barang dan catat mutasi stok masuk maupun penyesuaian gudang.
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

        {/* 2-Column Responsive Grid Layout (Stitch Halaman Stok v3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Actions (Stok Masuk & Adjustment) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <StockInCard
              products={products}
              onSubmit={handleStockIn}
              isLoading={isSubmittingIn}
            />

            <StockAdjustCard
              products={products}
              isOwner={isOwner}
              onSubmit={handleStockAdjust}
              isLoading={isSubmittingAdjust}
            />
          </div>

          {/* Right Column: Data Summaries (Stok Saat Ini & Riwayat Pergerakan) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <CurrentStockTable
              stockList={stockList}
              isLoading={isLoading}
            />

            <StockMovementHistory
              movements={movements}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
