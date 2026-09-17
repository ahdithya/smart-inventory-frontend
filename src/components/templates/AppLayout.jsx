import { SidebarNav } from '../organisms/SidebarNav';
import { TopHeader } from '../organisms/TopHeader';

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex text-[#1a1c1c]">
      {/* Fixed Left Sidebar (220px) */}
      <SidebarNav className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[220px] flex flex-col min-w-0 min-h-screen">
        {/* Sticky Top Header */}
        <TopHeader />

        {/* Scrollable Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
