import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/templates/AppLayout';
import { KpiGrid } from '../components/organisms/KpiGrid';
import { SalesTrendChart } from '../components/organisms/SalesTrendChart';
import { CriticalStockCard } from '../components/organisms/CriticalStockCard';
import { TopProductsCard } from '../components/organisms/TopProductsCard';
import { Alert } from '../components/atoms/Alert';
import { dashboardService } from '../services/dashboard';

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trendPoints, setTrendPoints] = useState([]);
  const [criticalStock, setCriticalStock] = useState([]);
  const [period, setPeriod] = useState('weekly');

  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTrend, setIsLoadingTrend] = useState(true);
  const [isLoadingStock, setIsLoadingStock] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadDashboardData() {
      setIsLoadingTrend(true);

      try {
        const [summaryRes, trendRes, stockRes] = await Promise.allSettled([
          dashboardService.getSummary(),
          dashboardService.getTrend(period),
          dashboardService.getCriticalStock(),
        ]);

        if (ignore) return;

        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value);
        } else {
          setErrorMessage('Gagal memuat ringkasan KPI dashboard.');
        }

        if (trendRes.status === 'fulfilled') {
          const res = trendRes.value;
          const points = res?.[period] || res?.points || [];
          setTrendPoints(points);
        }

        if (stockRes.status === 'fulfilled') {
          setCriticalStock(stockRes.value);
        }
      } catch {
        if (!ignore) {
          setErrorMessage('Terjadi kesalahan saat memuat data dashboard.');
        }
      } finally {
        if (!ignore) {
          setIsLoadingSummary(false);
          setIsLoadingTrend(false);
          setIsLoadingStock(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      ignore = true;
    };
  }, [period]);

  const navigate = useNavigate();

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleRestockClick = () => {
    navigate('/recommendations');
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {errorMessage && (
          <Alert type="error" message={errorMessage} className="mb-2" />
        )}

        {/* 1. Top KPI Cards Row */}
        <KpiGrid
          summary={summary || {}}
          isLoading={isLoadingSummary}
        />

        {/* 2. Main Grid: Trend Chart (8 cols) & Action Cards (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sales Trend SVG Chart */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <SalesTrendChart
              points={trendPoints}
              period={period}
              onPeriodChange={handlePeriodChange}
              isLoading={isLoadingTrend}
            />
          </div>

          {/* Right Column: Critical Stock & Top 5 Products */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CriticalStockCard
              items={criticalStock}
              isLoading={isLoadingStock}
              onRestockClick={handleRestockClick}
            />

            <TopProductsCard
              topProducts={summary?.top_products || []}
              isLoading={isLoadingSummary}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
