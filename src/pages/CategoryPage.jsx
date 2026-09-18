import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppLayout } from '../components/templates/AppLayout';
import { CategoryTable } from '../components/organisms/CategoryTable';
import { CategoryModal } from '../components/organisms/CategoryModal';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { SearchBar } from '../components/molecules/SearchBar';
import { Button } from '../components/atoms/Button';
import { Alert } from '../components/atoms/Alert';
import { categoryService } from '../services/category';
import { Plus } from 'lucide-react';

export function CategoryPage() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';
  const businessName = user?.business_profile?.business_name || 'Bisnis Anda';

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Notification
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      try {
        const data = await categoryService.getCategories();
        if (!ignore) {
          setCategories(data);
        }
      } catch {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: 'Gagal memuat daftar kategori.',
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // Modal open triggers
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleOpenDelete = (category) => {
    setDeletingCategory(category);
    setIsDeleteOpen(true);
    setFeedback(null);
  };

  // Submit Add / Edit
  const handleSubmitCategory = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory.id, payload);
        setCategories((prev) =>
          prev.map((item) => (item.id === editingCategory.id ? updated : item))
        );
        setFeedback({
          type: 'success',
          message: `Kategori "${updated.name}" berhasil diperbarui.`,
        });
      } else {
        const created = await categoryService.createCategory(payload);
        setCategories((prev) => [created, ...prev]);
        setFeedback({
          type: 'success',
          message: `Kategori "${created.name}" berhasil ditambahkan.`,
        });
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setFeedback({
        type: 'success',
        message: `Kategori "${deletingCategory.name}" berhasil dihapus.`,
      });
      setIsDeleteOpen(false);
      setDeletingCategory(null);
    } catch {
      setFeedback({
        type: 'error',
        message: 'Gagal menghapus kategori. Pastikan kategori tidak digunakan oleh produk aktif.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Feedback Alert */}
        {feedback && (
          <Alert
            type={feedback.type}
            message={feedback.message}
            className="animate-in fade-in duration-200"
          />
        )}

        {/* Page Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1a1c1c] tracking-[-0.03em] leading-tight">
              Kategori
            </h1>
            <p className="text-[14px] text-[#5f5e5e] mt-1">
              Kelola pengelompokan produk untuk inventaris {businessName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari nama atau deskripsi..."
            />

            {/* Add Category Button (Owner Only) */}
            {isOwner && (
              <Button
                variant="primary"
                fullWidth={false}
                onClick={handleOpenAdd}
                className="gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Kategori</span>
              </Button>
            )}
          </div>
        </div>

        {/* Categories Table List */}
        <CategoryTable
          categories={filteredCategories}
          isLoading={isLoading}
          isOwner={isOwner}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddClick={handleOpenAdd}
          searchQuery={searchQuery}
        />

        {/* Modal: Tambah / Edit Kategori */}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitCategory}
          category={editingCategory}
          isLoading={isSubmitting}
        />

        {/* Modal: Konfirmasi Hapus */}
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Hapus Kategori"
          message={
            deletingCategory
              ? `Apakah Anda yakin ingin menghapus kategori "${deletingCategory.name}"? Produk yang terkait dengan kategori ini dapat terpengaruh.`
              : 'Apakah Anda yakin ingin menghapus kategori ini?'
          }
          confirmText="Ya, Hapus"
          cancelText="Batal"
          isLoading={isDeleting}
        />
      </div>
    </AppLayout>
  );
}
