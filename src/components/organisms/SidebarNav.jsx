import { NavLink } from 'react-router-dom';
import { BrandIcon } from '../atoms/BrandIcon';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Receipt,
  Warehouse,
  LineChart,
  Sparkles,
  Settings,
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', to: '/', icon: LayoutDashboard, isImplemented: true },
  { id: 'products', label: 'Produk', to: '/products', icon: Package, isImplemented: true },
  { id: 'categories', label: 'Kategori', to: '/categories', icon: FolderTree, isImplemented: true },
  { id: 'sales', label: 'Penjualan', to: '/sales', icon: Receipt, isImplemented: false },
  { id: 'stock', label: 'Stok', to: '/stock', icon: Warehouse, isImplemented: false },
  { id: 'forecast', label: 'Prediksi', to: '/forecast', icon: LineChart, isImplemented: false },
  { id: 'recommendations', label: 'Rekomendasi', to: '/recommendations', icon: Sparkles, isImplemented: false },
];

export function SidebarNav({ className = '' }) {
  return (
    <aside
      className={`w-[220px] h-screen fixed left-0 top-0 border-r border-[#e5e5e5] flex flex-col py-6 px-0 bg-white z-20 select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="px-5 mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <BrandIcon size="sm" />
          <span className="text-[17px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
            Smartify UMKM
          </span>
        </div>
        <p className="text-[11px] font-normal text-[#5f5e5e] pl-0.5">
          Inventory & Prediction
        </p>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex flex-col flex-1 w-full gap-0.5 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          if (item.isImplemented) {
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center px-5 py-2.5 text-[14px] transition-colors duration-150 ${
                    isActive
                      ? 'text-[#6d28d9] border-l-2 border-[#6d28d9] bg-[#f4f3f3]/50 font-semibold'
                      : 'text-[#5f5e5e] hover:text-[#1a1c1c] hover:bg-[#f9f9f9] border-l-2 border-transparent font-medium'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] mr-3 shrink-0 stroke-[1.8]" />
                <span>{item.label}</span>
              </NavLink>
            );
          }

          // Modular Scope Protection: Unimplemented routes are clearly marked and non-breaking
          return (
            <div
              key={item.id}
              className="flex items-center justify-between px-5 py-2.5 text-[14px] text-[#9ca3af] hover:text-[#7b7486] transition-colors border-l-2 border-transparent group cursor-not-allowed select-none"
              title="Modul akan hadir pada tiket berikutnya"
            >
              <div className="flex items-center">
                <Icon className="w-[18px] h-[18px] mr-3 shrink-0 stroke-[1.75]" />
                <span>{item.label}</span>
              </div>
            </div>
          );
        })}

        {/* Bottom Settings Link */}
        <div className="mt-auto pt-4 border-t border-[#eeeeee]">
          <div
            className="flex items-center px-5 py-2.5 text-[14px] text-[#9ca3af] cursor-not-allowed border-l-2 border-transparent"
            title="Pengaturan akan aktif pada tiket berikutnya"
          >
            <Settings className="w-[18px] h-[18px] mr-3 shrink-0 stroke-[1.75]" />
            <span>Pengaturan</span>
          </div>
        </div>
      </nav>
    </aside>
  );
}
