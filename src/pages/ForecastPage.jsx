import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/templates/AppLayout';
import { ForecastMetricCard } from '../components/molecules/ForecastMetricCard';
import { HorizonToggle } from '../components/molecules/HorizonToggle';
import { ForecastChart } from '../components/organisms/ForecastChart';
import { ForecastBreakdownTable } from '../components/organisms/ForecastBreakdownTable';
import { Alert } from '../components/atoms/Alert';
import { Button } from '../components/atoms/Button';
import { Skeleton } from '../components/atoms/Skeleton';
import { forecastService } from '../services/forecast';
import { productService } from '../services/product';
import {
  LineChart,
  RefreshCw,
  Package,
  CalendarX,
  AlertTriangle,
  Info,
} from 'lucide-react';

export function ForecastPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [horizon, setHorizon] = useState(7); // 7 atau 14

  const [forecastData, setForecastData] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Ambil daftar produk aktif
  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const prodList = await productService.getProducts({ is_active: true });
        if (ignore) return;
        const activeList = Array.isArray(prodList) ? prodList : [];
        setProducts(activeList);

        if (activeList.length > 0) {
          setSelectedProductId(String(activeList[0].id));
        }
      } catch {
        if (!ignore) {
          setErrorMessage('Gagal memuat daftar produk.');
        }
      } finally {
        if (!ignore) {
          setIsLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  // 2. Ambil peramalan untuk produk terpilih
  useEffect(() => {
    let ignore = false;
    if (!selectedProductId) return;

    async function loadForecast() {
      setIsLoadingForecast(true);
      setErrorMessage('');

      try {
        const data = await forecastService.getProductForecast(selectedProductId, false);
        if (!ignore) {
          setForecastData(data);
        }
      } catch (err) {
        if (!ignore) {
          setErrorMessage(
            err?.message || 'Gagal memuat data peramalan untuk produk ini.'
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingForecast(false);
        }
      }
    }

    loadForecast();

    return () => {
      ignore = true;
    };
  }, [selectedProductId]);

  const handleRefresh = async () => {
    if (!selectedProductId) return;
    setIsRefreshing(true);
    setErrorMessage('');

    try {
      const data = await forecastService.getProductForecast(selectedProductId, true);
      setForecastData(data);
    } catch (err) {
      setErrorMessage(
        err?.message || 'Gagal memuat data peramalan untuk produk ini.'
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(selectedProductId));
  }, [products, selectedProductId]);

  // Ekstrak data spesifik horizon yang sedang dipilih (7 atau 14 hari)
  const activeHorizonData = useMemo(() => {
    if (!forecastData || !forecastData.horizons) return null;
    return (
      forecastData.horizons.find((h) => Number(h.horizon_days) === Number(horizon)) ||
      forecastData.horizons[0] ||
      null
    );
  }, [forecastData, horizon]);

  const isInsufficientData = forecastData?.status === 'INSUFFICIENT_DATA';
  const isStale = Boolean(forecastData?.stale);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[6px] bg-[#f5f3ff] border border-[#ddd6fe] flex items-center justify-center text-[#6d28d9]">
                <LineChart className="w-4 h-4" />
              </div>
              <h1 className="text-[20px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
                Prediksi Permintaan (Demand Forecasting)
              </h1>
            </div>
            <p className="text-[13px] text-[#5f5e5e] mt-1 pl-10">
              Peramalan kebutuhan stok masa depan berbasis model statistik &amp; Machine Learning (Horizon 7 &amp; 14 Hari).
            </p>
          </div>

          {/* Action Header: Force Refresh */}
          <div className="flex items-center gap-2 pl-10 md:pl-0">
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={isLoadingForecast || isRefreshing || !selectedProductId}
              className="text-[12px] h-[34px] px-3 font-medium flex items-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#6d28d9]' : ''}`}
              />
              <span>{isRefreshing ? 'Menghitung Ulang...' : 'Segarkan Data AI'}</span>
            </Button>
          </div>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <Alert type="error" message={errorMessage} className="mb-1" />
        )}

        {/* Stale Warning Banner (BR-15) */}
        {isStale && !isInsufficientData && (
          <div className="bg-[#fffbeb] border border-[#fde68a] text-[#92400e] px-4 py-3 rounded-[6px] flex items-start gap-3 shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
            <div className="text-[13px]">
              <span className="font-bold">Mode Cadangan Aktif (Data Stale):</span> Layanan AI eksternal sedang tidak dapat dijangkau. Menampilkan snapshot hasil peramalan terakhir yang tersimpan di basis data lokal.
            </div>
          </div>
        )}

        {/* Product Selector & Horizon Controls Bar */}
        <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          {/* Product Picker */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="w-7 h-7 rounded bg-[#f4f3f3] flex items-center justify-center text-[#7b7486] shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <label htmlFor="product-select" className="block text-[11px] font-semibold text-[#7b7486] uppercase tracking-wider mb-1">
                Pilih Produk yang Ingin Diprediksi
              </label>
              {isLoadingProducts ? (
                <Skeleton className="h-[36px] w-full rounded" />
              ) : (
                <select
                  id="product-select"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full h-[36px] px-3 bg-[#fafafa] border border-[#e5e5e5] rounded-[4px] text-[13px] font-medium text-[#1a1c1c] focus:outline-none focus:border-[#6d28d9] focus:bg-white transition-colors cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} — {p.name} (Stok: {p.current_stock} {p.unit || 'unit'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Horizon Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#f4f3f3]">
            <span className="text-[11px] font-semibold text-[#7b7486] uppercase tracking-wider">
              Jangka Waktu:
            </span>
            <HorizonToggle horizon={horizon} onChange={setHorizon} />
          </div>
        </div>

        {/* Main Content Area */}
        {isLoadingForecast ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-[6px]" />
              ))}
            </div>
            <Skeleton className="h-[280px] rounded-[6px]" />
            <Skeleton className="h-[220px] rounded-[6px]" />
          </div>
        ) : isInsufficientData ? (
          /* INSUFFICIENT_DATA Empty State (BR-11) */
          <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-8 flex flex-col items-center text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#dc2626] mb-4">
              <CalendarX className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="text-[17px] font-bold text-[#1a1c1c] mb-2">
              Riwayat Penjualan Belum Mencukupi (&lt; 30 Hari)
            </h3>
            <p className="text-[13px] text-[#5f5e5e] max-w-lg mb-4 leading-relaxed">
              Model peramalan membutuhkan minimal <strong>30 hari data transaksi kontinu</strong> untuk dapat menghasilkan proyeksi permintaan dan metrik evaluasi yang akurat. Produk <strong>{forecastData?.product_name || selectedProduct?.name}</strong> saat ini baru memiliki <strong>{forecastData?.sales_history?.length || 0} hari</strong> riwayat penjualan.
            </p>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] p-4 max-w-md text-left text-[12px] text-[#475569] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
              <span>
                Peramalan otomatis akan aktif setelah produk memiliki transaksi penjualan yang mencukupi ambang batas 30 hari kalender.
              </span>
            </div>
          </div>
        ) : forecastData ? (
          /* Valid Forecast Results */
          <div className="flex flex-col gap-6">
            {/* 1. Evaluation Metric Cards */}
            <ForecastMetricCard
              metrics={activeHorizonData?.metrics || {}}
              modelName={forecastData.model}
              generatedAt={forecastData.generated_at}
              stale={isStale}
            />

            {/* 2. Interactive SVG Forecast Chart */}
            <ForecastChart
              historyPoints={forecastData.sales_history || []}
              forecastPoints={activeHorizonData?.daily || []}
              horizon={horizon}
              unit={selectedProduct?.unit || 'unit'}
            />

            {/* 3. Daily Breakdown Table */}
            <ForecastBreakdownTable
              dailyItems={activeHorizonData?.daily || []}
              totalPredicted={activeHorizonData?.total_predicted || 0}
              horizon={horizon}
              unit={selectedProduct?.unit || 'unit'}
            />
          </div>
        ) : (
          <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-10 text-center text-[#7b7486]">
            Pilih produk di atas untuk melihat proyeksi permintaan.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
