import { useAuth } from '../hooks/useAuth';
import { BrandIcon } from '../components/atoms/BrandIcon';
import { Button } from '../components/atoms/Button';
import { LogOut, User, ShieldCheck } from 'lucide-react';

export function HomePlaceholder() {
  const { user, logout } = useAuth();

  const businessName = user?.business_profile?.business_name || 'Bisnis Anda';
  const businessType = user?.business_profile?.business_type || 'UMKM';
  const roleLabel = user?.role === 'owner' ? 'Pemilik (Owner)' : 'Staf (Staff)';

  return (
    <div className="min-h-screen bg-[#f4f3f3] flex flex-col">
      {/* Header bar */}
      <header className="h-16 bg-white border-b border-[#e5e5e5] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandIcon size="sm" />
          <span className="font-bold text-[16px] text-[#1a1c1c] tracking-tight">Smartify UMKM</span>
          <span className="text-[#d4d4d4]">|</span>
          <span className="text-[14px] text-[#5f5e5e] font-medium">{businessName}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[13px] text-[#5f5e5e]">
            <User className="w-4 h-4 text-[#7b7486]" />
            <span className="font-medium text-[#1a1c1c]">{user?.username}</span>
            <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-[#eeeeee] text-[#4a4455] rounded-[4px]">
              {roleLabel}
            </span>
          </div>

          <Button
            variant="secondary"
            fullWidth={false}
            onClick={logout}
            className="h-9 px-3 text-[13px] gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </Button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center">
        <div className="bg-white border border-[#e5e5e5] rounded-[8px] p-8 sm:p-10 flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-[#eeeeee] pb-6">
            <div className="w-12 h-12 rounded-[6px] bg-[#f4f3f3] border border-[#e5e5e5] flex items-center justify-center text-[#6d28d9]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-[#1a1c1c] tracking-tight">
                Sesi Autentikasi Aktif
              </h1>
              <p className="text-[14px] text-[#5f5e5e] mt-0.5">
                Anda berhasil masuk ke sistem Smartify UMKM.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
            <div className="p-4 bg-[#f9f9f9] border border-[#eeeeee] rounded-[6px] flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7b7486]">
                Profil Bisnis
              </span>
              <span className="font-bold text-[#1a1c1c] text-[16px]">{businessName}</span>
              <span className="text-[13px] text-[#5f5e5e] capitalize">Kategori: {businessType}</span>
            </div>

            <div className="p-4 bg-[#f9f9f9] border border-[#eeeeee] rounded-[6px] flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7b7486]">
                Akun Pengguna
              </span>
              <span className="font-bold text-[#1a1c1c] text-[16px]">{user?.email || user?.username}</span>
              <span className="text-[13px] text-[#5f5e5e]">Hak Akses: {roleLabel}</span>
            </div>
          </div>

          <div className="bg-[#f0fdf4] border border-[#86efac] text-[#15803d] rounded-[6px] p-4 text-[13px] leading-relaxed">
            <strong>Status Tiket 16 & 17 Selesai:</strong> Fondasi React Router, integrasi Tailwind CSS v4, Context Autentikasi JWT, HTTP fetch wrapper, serta antarmuka Login dan Register berhasil terhubung secara end-to-end dengan backend Django.
          </div>
        </div>
      </main>
    </div>
  );
}
