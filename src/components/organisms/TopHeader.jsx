import { useAuth } from '../../hooks/useAuth';
import { Button } from '../atoms/Button';
import { User, LogOut } from 'lucide-react';

export function TopHeader({ className = '' }) {
  const { user, logout } = useAuth();

  const businessName = user?.business_profile?.business_name || 'Smartify UMKM';
  const roleLabel = user?.role === 'owner' ? 'Owner' : 'Staff';

  return (
    <header
      className={`h-16 border-b border-[#e5e5e5] bg-white px-6 sm:px-8 flex justify-between items-center z-10 shrink-0 select-none ${className}`}
    >
      {/* Store Name Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-[18px] sm:text-[20px] font-bold text-[#1a1c1c] tracking-[-0.02em] truncate max-w-[280px] sm:max-w-md">
          {businessName}
        </h1>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[13px] text-[#5f5e5e]">
          <div className="w-8 h-8 rounded-full bg-[#f4f3f3] border border-[#e5e5e5] flex items-center justify-center text-[#5f5e5e]">
            <User className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold text-[#1a1c1c] leading-tight">
              {user?.username}
            </span>
            <span className="text-[11px] text-[#7b7486] font-medium leading-none">
              {roleLabel}
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          fullWidth={false}
          onClick={logout}
          className="h-8 px-3 text-[12px] gap-1.5"
          title="Keluar dari sistem"
        >
          <LogOut className="w-3.5 h-3.5 text-[#5f5e5e]" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
