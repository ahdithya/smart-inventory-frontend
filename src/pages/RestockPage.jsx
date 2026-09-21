import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/templates/AppLayout';
import { RestockSummaryCards } from '../components/organisms/RestockSummaryCards';
import { RestockFilterBar } from '../components/molecules/RestockFilterBar';
import { RestockTable } from '../components/organisms/RestockTable';
import { RestockFormulaModal } from '../components/molecules/RestockFormulaModal';
import { QuickRestockModal } from '../components/molecules/QuickRestockModal';
import { Alert } from '../components/atoms/Alert';
import { Button } from '../components/atoms/Button';
import { restockService } from '../services/restock';
import { Sparkles, RefreshCw } from 'lucide-react';

export function RestockPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modals state
  const [formulaItem, setFormulaItem] = useState(null);
  const [restockItem, setRestockItem] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await restockService.getRecommendations();
        if (!ignore) {
          setRecommendations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setErrorMessage(
            err?.message || 'Gagal memuat daftar rekomendasi restock dari server.'
          );
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setErrorMessage('');

    try {
      const data = await restockService.getRecommendations();
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMessage(
        err?.message || 'Gagal memperbarui daftar rekomendasi restock.'
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  // Kalkulasi counter untuk tab filter
  const statusCounts = useMemo(() => {
    const counts = { all: recommendations.length, critical: 0, warning: 0, ok: 0 };
    recommendations.forEach((item) => {
      if (item.status === 'critical') counts.critical += 1;
      else if (item.status === 'warning') counts.warning += 1;
      else if (item.status === 'ok') counts.ok += 1;
    });
    return counts;
  }, [recommendations]);

  // Filter & Search
  const filteredItems = useMemo(() => {
    return recommendations.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (item.product_name || '').toLowerCase().includes(query);
        const skuMatch = (item.product_sku || '').toLowerCase().includes(query);
        const catMatch = (item.category_name || '').toLowerCase().includes(query);
        if (!nameMatch && !skuMatch && !catMatch) return false;
      }
      return true;
    });
  }, [recommendations, statusFilter, searchQuery]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[6px] bg-[#f5f3ff] border border-[#ddd6fe] flex items-center justify-center text-[#6d28d9]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-[20px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
                Rekomendasi Restock (Restock Recommendation)
              </h1>
            </div>
            <p className="text-[13px] text-[#5f5e5e] mt-1 pl-10">
              Prioritas kuantitas pemesanan ulang stok barang berbasis kalkulasi lead time, safety stock, dan proyeksi permintaan AI.
            </p>
          </div>

          {/* Action Header */}
          <div className="flex items-center gap-2 pl-10 md:pl-0">
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="text-[12px] h-[34px] px-3 font-medium flex items-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#6d28d9]' : ''}`}
              />
              <span>{isRefreshing ? 'Memperbarui...' : 'Segarkan Rekomendasi'}</span>
            </Button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && <Alert type="error" message={errorMessage} />}

        {/* 1. KPI Summary Cards */}
        <RestockSummaryCards items={recommendations} isLoading={isLoading} />

        {/* 2. Filter Bar & Search */}
        <RestockFilterBar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          counts={statusCounts}
        />

        {/* 3. Main Recommendations Table */}
        <RestockTable
          items={filteredItems}
          isLoading={isLoading}
          onShowFormula={(item) => setFormulaItem(item)}
          onQuickRestock={(item) => setRestockItem(item)}
        />

        {/* 4. Formula Breakdown Modal */}
        <RestockFormulaModal
          isOpen={Boolean(formulaItem)}
          onClose={() => setFormulaItem(null)}
          recommendation={formulaItem}
          onQuickRestock={(item) => setRestockItem(item)}
        />

        {/* 5. Quick Restock Action Modal */}
        {restockItem && (
          <QuickRestockModal
            key={restockItem.id}
            isOpen={Boolean(restockItem)}
            onClose={() => setRestockItem(null)}
            recommendation={restockItem}
            onSuccess={handleRefresh}
          />
        )}
      </div>
    </AppLayout>
  );
}
