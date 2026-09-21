import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '../components/templates/AppLayout';
import { BusinessProfileCard } from '../components/organisms/BusinessProfileCard';
import { UserManagementTable } from '../components/organisms/UserManagementTable';
import { CreateUserModal } from '../components/molecules/CreateUserModal';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { Alert } from '../components/atoms/Alert';
import { Button } from '../components/atoms/Button';
import { useAuth } from '../hooks/useAuth';
import { settingsService } from '../services/settings';
import { Settings, Store, Users, UserPlus, ShieldAlert } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [activeTab, setActiveTab] = useState('business'); // 'business' | 'users'
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const reloadUsers = useCallback(async () => {
    if (!isOwner) return;
    try {
      const data = await settingsService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Gagal memuat daftar pengguna.',
      });
    }
  }, [isOwner]);

  useEffect(() => {
    let ignore = false;
    if (activeTab !== 'users' || !isOwner) return;

    async function fetchUsers() {
      setIsLoadingUsers(true);
      try {
        const data = await settingsService.getUsers();
        if (!ignore) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: err?.message || 'Gagal memuat daftar pengguna.',
          });
        }
      } finally {
        if (!ignore) {
          setIsLoadingUsers(false);
        }
      }
    }

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, [activeTab, isOwner]);

  const handleToggleRole = (targetUser) => {
    const newRole = targetUser.role === 'owner' ? 'staff' : 'owner';
    setConfirmDialog({
      isOpen: true,
      title: 'Ubah Peran Pengguna',
      message: `Apakah Anda yakin ingin mengubah peran pengguna "${targetUser.username}" menjadi "${newRole.toUpperCase()}"?`,
      onConfirm: async () => {
        try {
          await settingsService.updateUser(targetUser.id, { role: newRole });
          setFeedback({
            type: 'success',
            message: `Berhasil mengubah peran "${targetUser.username}" menjadi ${newRole.toUpperCase()}.`,
          });
          reloadUsers();
        } catch (err) {
          setFeedback({
            type: 'error',
            message: err?.message || 'Gagal memperbarui peran pengguna.',
          });
        }
      },
    });
  };

  const handleToggleActive = (targetUser) => {
    const newActiveState = targetUser.is_active === false;
    const actionLabel = newActiveState ? 'mengaktifkan kembali' : 'menonaktifkan';

    setConfirmDialog({
      isOpen: true,
      title: `${newActiveState ? 'Aktifkan' : 'Nonaktifkan'} Akun Pengguna`,
      message: `Apakah Anda yakin ingin ${actionLabel} akun "${targetUser.username}"? ${
        !newActiveState ? 'Pengguna tidak akan dapat login ke sistem selama akun nonaktif.' : ''
      }`,
      onConfirm: async () => {
        try {
          await settingsService.updateUser(targetUser.id, { is_active: newActiveState });
          setFeedback({
            type: 'success',
            message: `Akun "${targetUser.username}" berhasil ${actionLabel}.`,
          });
          reloadUsers();
        } catch (err) {
          setFeedback({
            type: 'error',
            message: err?.message || 'Gagal mengubah status akun pengguna.',
          });
        }
      },
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[6px] bg-[#f5f3ff] border border-[#ddd6fe] flex items-center justify-center text-[#6d28d9]">
                <Settings className="w-4 h-4" />
              </div>
              <h1 className="text-[20px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
                Pengaturan Sistem (Settings)
              </h1>
            </div>
            <p className="text-[13px] text-[#5f5e5e] mt-1 pl-10">
              Kelola profil bisnis UMKM dan hak akses akun staf toko.
            </p>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <Alert
            type={feedback.type}
            message={feedback.message}
            className="mb-1"
          />
        )}

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-[#e5e5e5] gap-4 select-none">
          <button
            type="button"
            onClick={() => {
              setActiveTab('business');
              setFeedback(null);
            }}
            className={`pb-3 px-1 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'business'
                ? 'border-[#6d28d9] text-[#6d28d9]'
                : 'border-transparent text-[#7b7486] hover:text-[#1a1c1c]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Profil Toko &amp; Usaha</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('users');
              setFeedback(null);
            }}
            className={`pb-3 px-1 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-[#6d28d9] text-[#6d28d9]'
                : 'border-transparent text-[#7b7486] hover:text-[#1a1c1c]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Pengguna (Staf)</span>
          </button>
        </div>

        {/* Tab Content: Business Profile */}
        {activeTab === 'business' && <BusinessProfileCard />}

        {/* Tab Content: User Management */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4">
            {!isOwner ? (
              <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-8 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-[#b45309] mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-[16px] font-bold text-[#1a1c1c] mb-1">
                  Akses Terbatas
                </h3>
                <p className="text-[13px] text-[#5f5e5e] max-w-md">
                  Manajemen pengguna dan pengaturan hak akses staf hanya dapat dibuka oleh akun dengan peran <strong>Owner</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[15px] font-bold text-[#1a1c1c]">
                      Daftar Pengguna Sistem
                    </h2>
                    <p className="text-[12px] text-[#7b7486]">
                      Kelola hak akses dan status aktif staf yang beroperasi di toko Anda.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="text-[12px] h-[36px] px-3 flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Tambah Pengguna Baru</span>
                  </Button>
                </div>

                <UserManagementTable
                  users={users}
                  currentUserId={user?.id}
                  isLoading={isLoadingUsers}
                  onToggleRole={handleToggleRole}
                  onToggleActive={handleToggleActive}
                />
              </>
            )}
          </div>
        )}

        {/* Modal: Tambah User Baru */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={reloadUsers}
        />

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={() => {
            confirmDialog.onConfirm?.();
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          }}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
      </div>
    </AppLayout>
  );
}
