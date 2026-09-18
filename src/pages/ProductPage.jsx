import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppLayout } from '../components/templates/AppLayout';
import { ProductFilterBar } from '../components/molecules/ProductFilterBar';
import { ProductTable } from '../components/organisms/ProductTable';
import { ProductModal } from '../components/organisms/ProductModal';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { Alert } from '../components/atoms/Alert';
import { productService } from '../services/product';
import { categoryService } from '../services/category';

export function ProductPage() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Notification
  const [feedback, setFeedback] = useState(null);

  // Fetch initial data
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [prodList, catList] = await Promise.all([
          productService.getProducts({ is_active: 'true' }),
          categoryService.getCategories(),
        ]);
        if (!ignore) {
          setProducts(prodList);
          setCategories(catList);
        }
      } catch {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: 'Gagal memuat data produk atau kategori dari server.',
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

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Search Query (name or SKU)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = prod.name?.toLowerCase().includes(q);
        const matchSku = prod.sku?.toLowerCase().includes(q);
        if (!matchName && !matchSku) return false;
      }

      // 2. Category Filter
      if (categoryFilter) {
        if (String(prod.category) !== String(categoryFilter)) return false;
      }

      // 3. Status Filter
      if (statusFilter) {
        if (prod.stock_status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const hasActiveFilters = Boolean(searchQuery || categoryFilter || statusFilter);

  // Modal handlers
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (payload, productId) => {
    setIsSubmitting(true);
    try {
      if (productId) {
        const updated = await productService.updateProduct(productId, payload);
        setProducts((prev) =>
          prev.map((item) => (item.id === productId ? { ...item, ...updated } : item))
        );
        setFeedback({
          type: 'success',
          message: `Produk "${updated.name || payload.name}" berhasil diperbarui.`,
        });
      } else {
        const created = await productService.createProduct(payload);
        // Find category name if returned product doesn't have it filled yet
        const categoryObj = categories.find((c) => c.id === created.category);
        const enriched = {
          ...created,
          category_name: created.category_name || categoryObj?.name || '',
        };
        setProducts((prev) => [enriched, ...prev]);
        setFeedback({
          type: 'success',
          message: `Produk "${created.name}" berhasil ditambahkan ke katalog.`,
        });
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handlers
  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
    setFeedback(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    try {
      await productService.deleteProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((item) => item.id !== deletingProduct.id));
      setFeedback({
        type: 'success',
        message: `Produk "${deletingProduct.name}" berhasil dinonaktifkan.`,
      });
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    } catch {
      setFeedback({
        type: 'error',
        message: 'Gagal menonaktifkan produk. Silakan coba lagi.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
              Daftar Produk
            </h1>
            <p className="text-[14px] text-[#5f5e5e] mt-1">
              Kelola inventaris, harga jual & modal, dan batas stok produk Anda.
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
        <ProductFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onAddClick={handleOpenAdd}
          isOwner={isOwner}
        />

        {/* Data Table */}
        <ProductTable
          products={filteredProducts}
          isLoading={isLoading}
          isOwner={isOwner}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddClick={handleOpenAdd}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Modal: Tambah / Edit Produk */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitProduct}
          product={editingProduct}
          categories={categories}
          isLoading={isSubmitting}
        />

        {/* Modal: Konfirmasi Hapus (Soft Delete) */}
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Nonaktifkan Produk"
          message={
            deletingProduct
              ? `Apakah Anda yakin ingin menonaktifkan produk "${deletingProduct.name}" (SKU: ${deletingProduct.sku})? Produk ini tidak akan muncul di form penjualan baru, namun riwayat transaksi lama tetap tersimpan.`
              : 'Apakah Anda yakin ingin menonaktifkan produk ini?'
          }
          confirmText="Ya, Nonaktifkan"
          cancelText="Batal"
          isLoading={isDeleting}
        />
      </div>
    </AppLayout>
  );
}
