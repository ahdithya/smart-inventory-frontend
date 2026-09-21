import { Skeleton } from '../atoms/Skeleton';
import { UserCheck, UserX, ArrowUpDown } from 'lucide-react';

export function UserManagementTable({
  users = [],
  currentUserId,
  isLoading = false,
  onToggleRole,
  onToggleActive,
  className = '',
}) {
  if (isLoading) {
    return (
      <div className={`bg-white border border-[#e5e5e5] rounded-[6px] p-4 shadow-xs ${className}`}>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#e5e5e5] rounded-[6px] shadow-xs overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#eeeeee] bg-[#fafafa] text-[#7b7486] font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4 min-w-[180px]">Pengguna</th>
              <th className="py-3 px-4 w-32 text-center">Peran (Role)</th>
              <th className="py-3 px-4 w-28 text-center">Status Akun</th>
              <th className="py-3 px-4 w-52 text-center">Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f3f3]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#7b7486]">
                  Tidak ada data pengguna yang ditemukan.
                </td>
              </tr>
            ) : (
              users.map((u, idx) => {
                const isCurrentSelf = String(u.id) === String(currentUserId);
                const isOwner = u.role === 'owner';
                const isActive = u.is_active !== false;

                return (
                  <tr
                    key={u.id || idx}
                    className="hover:bg-[#fbfbfe] transition-colors"
                  >
                    {/* No */}
                    <td className="py-3 px-4 text-center text-[#9ca3af] font-mono text-[12px]">
                      {idx + 1}
                    </td>

                    {/* Identitas Pengguna */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#1a1c1c]">
                            {u.username}
                          </span>
                          {isCurrentSelf && (
                            <span className="text-[10px] bg-[#f5f3ff] text-[#6d28d9] px-1.5 py-0.2 rounded border border-[#ddd6fe] font-semibold">
                              Anda
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#7b7486]">
                          {u.email}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          isOwner
                            ? 'bg-[#f5f3ff] text-[#6d28d9] border border-[#ddd6fe]'
                            : 'bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]'
                        }`}
                      >
                        {isOwner ? 'Owner' : 'Staff'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]'
                            : 'bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]'
                        }`}
                      >
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Aksi Manajemen */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Ubah Role */}
                        <button
                          type="button"
                          onClick={() => onToggleRole(u)}
                          disabled={isCurrentSelf}
                          title={
                            isCurrentSelf
                              ? 'Anda tidak dapat mengubah role akun sendiri'
                              : `Ubah peran menjadi ${isOwner ? 'Staff' : 'Owner'}`
                          }
                          className="h-[28px] px-2 rounded border border-[#e5e5e5] hover:bg-[#f4f3f3] text-[#475569] hover:text-[#1a1c1c] text-[11px] font-medium flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ArrowUpDown className="w-3 h-3 text-[#6d28d9]" />
                          <span>Jadikan {isOwner ? 'Staff' : 'Owner'}</span>
                        </button>

                        {/* Toggle Status Aktif / Nonaktif */}
                        <button
                          type="button"
                          onClick={() => onToggleActive(u)}
                          disabled={isCurrentSelf}
                          title={
                            isCurrentSelf
                              ? 'Anda tidak dapat menonaktifkan akun sendiri'
                              : isActive
                              ? 'Nonaktifkan akun user ini'
                              : 'Aktifkan kembali akun user ini'
                          }
                          className={`h-[28px] px-2 rounded border text-[11px] font-medium flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            isActive
                              ? 'border-[#fecaca] text-[#ba1a1a] hover:bg-[#fff5f5]'
                              : 'border-[#bbf7d0] text-[#15803d] hover:bg-[#f0fdf4]'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>Nonaktifkan</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Aktifkan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
