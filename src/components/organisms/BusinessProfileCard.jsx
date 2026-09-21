import { useState, useEffect } from 'react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { Skeleton } from '../atoms/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { settingsService } from '../../services/settings';
import { Store, Save, ShieldAlert } from 'lucide-react';

const BUSINESS_TYPE_OPTIONS = [
  { value: 'beverage', label: 'Minuman / Kedai Kopi (Beverage)' },
  { value: 'food', label: 'Makanan / Kuliner (Food)' },
  { value: 'retail', label: 'Ritel / Minimarket (Retail)' },
  { value: 'fashion', label: 'Mode & Pakaian (Fashion)' },
  { value: 'service', label: 'Jasa & Layanan (Service)' },
  { value: 'others', label: 'Lainnya (Others)' },
];

export function BusinessProfileCard({ className = '' }) {
  const { user, refreshUser } = useAuth();
  const isOwner = user?.role === 'owner';

  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'beverage',
    phone: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setIsLoading(true);
      setFeedback(null);

      try {
        const data = await settingsService.getBusinessProfile();
        if (!ignore && data) {
          setFormData({
            business_name: data.business_name || '',
            business_type: data.business_type || 'beverage',
            phone: data.phone || '',
            address: data.address || '',
          });
        }
      } catch (err) {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: err?.message || 'Gagal memuat profil bisnis dari server.',
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner) return;

    if (!formData.business_name.trim()) {
      setFeedback({
        type: 'error',
        message: 'Nama usaha tidak boleh kosong.',
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      await settingsService.updateBusinessProfile(formData);
      setFeedback({
        type: 'success',
        message: 'Profil bisnis berhasil diperbarui dan disinkronkan ke seluruh aplikasi.',
      });
      // Sinkronkan ke auth context agar TopHeader langsung terupdate
      await refreshUser?.();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Gagal menyimpan pembaruan profil bisnis.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white border border-[#e5e5e5] rounded-[6px] p-6 shadow-xs ${className}`}>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#e5e5e5] rounded-[6px] p-6 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#eeeeee]">
        <div className="w-8 h-8 rounded-[6px] bg-[#f5f3ff] border border-[#ddd6fe] flex items-center justify-center text-[#6d28d9]">
          <Store className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-[16px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
            Profil Bisnis UMKM
          </h2>
          <p className="text-[12px] text-[#7b7486]">
            Informasi identitas toko yang digunakan pada laporan, header, dan struk penjualan.
          </p>
        </div>
      </div>

      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          className="mb-5"
        />
      )}

      {!isOwner && (
        <div className="bg-[#fffbeb] border border-[#fde68a] text-[#92400e] px-4 py-2.5 rounded-[6px] text-[12px] flex items-center gap-2 mb-5">
          <ShieldAlert className="w-4 h-4 text-[#b45309] shrink-0" />
          <span>
            Anda masuk sebagai <strong>Staff</strong>. Formulir ini hanya dapat diubah oleh akun dengan hak akses <strong>Owner</strong>.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        {/* Nama Bisnis */}
        <FormField
          label="Nama Usaha / Toko"
          id="business-name"
          type="text"
          value={formData.business_name}
          onChange={(e) => handleChange('business_name', e.target.value)}
          placeholder="Contoh: Kopi Kita"
          disabled={!isOwner || isSaving}
          required
        />

        {/* Jenis Usaha */}
        <div>
          <label
            htmlFor="business-type"
            className="block text-[13px] font-medium text-[#1a1c1c] mb-1"
          >
            Jenis Usaha <span className="text-[#ba1a1a]">*</span>
          </label>
          <select
            id="business-type"
            value={formData.business_type}
            onChange={(e) => handleChange('business_type', e.target.value)}
            disabled={!isOwner || isSaving}
            className="w-full h-[38px] px-3 bg-white border border-[#e5e5e5] rounded-[4px] text-[13px] text-[#1a1c1c] focus:outline-none focus:border-[#6d28d9] disabled:bg-[#f4f3f3] disabled:text-[#9ca3af] disabled:cursor-not-allowed transition-colors"
          >
            {BUSINESS_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nomor Telepon / WhatsApp */}
        <FormField
          label="Nomor Telepon / WhatsApp"
          id="business-phone"
          type="text"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Contoh: 081234567890"
          disabled={!isOwner || isSaving}
        />

        {/* Alamat Toko */}
        <div>
          <label
            htmlFor="business-address"
            className="block text-[13px] font-medium text-[#1a1c1c] mb-1"
          >
            Alamat Lengkap Usaha
          </label>
          <textarea
            id="business-address"
            rows={3}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Contoh: Jl. Senopati No. 12, Jakarta Selatan"
            disabled={!isOwner || isSaving}
            className="w-full p-3 bg-white border border-[#e5e5e5] rounded-[4px] text-[13px] text-[#1a1c1c] focus:outline-none focus:border-[#6d28d9] disabled:bg-[#f4f3f3] disabled:text-[#9ca3af] disabled:cursor-not-allowed transition-colors resize-y"
          />
        </div>

        {/* Submit Button */}
        {isOwner && (
          <div className="pt-3 border-t border-[#eeeeee] flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="text-[13px] h-[38px] px-5 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Profil Toko'}</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
