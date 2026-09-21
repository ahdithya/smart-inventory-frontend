import { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { Alert } from '../atoms/Alert';
import { settingsService } from '../../services/settings';
import { UserPlus, CheckCircle2 } from 'lucide-react';

export function CreateUserModal({
  isOpen = false,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'staff',
    });
    setErrorMessage('');
    setFieldErrors({});
    setSuccessMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});
    setSuccessMessage('');

    if (formData.password.length < 8) {
      setErrorMessage('Kata sandi harus memiliki panjang minimal 8 karakter.');
      return;
    }

    setIsSubmitting(true);

    try {
      await settingsService.createUser(formData);
      setSuccessMessage(`Berhasil mendaftarkan pengguna baru "${formData.username}".`);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 800);
    } catch (err) {
      setErrorMessage(err?.message || 'Gagal menambahkan pengguna baru.');
      if (err?.fields) {
        setFieldErrors(err.fields);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah Pengguna Baru"
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-[12px] h-[36px]"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !!successMessage}
            className="text-[12px] h-[36px] flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Daftarkan Pengguna'}</span>
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {errorMessage && <Alert type="error" message={errorMessage} />}
        {successMessage && (
          <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-[6px] text-[13px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Username */}
        <FormField
          label="Username"
          id="new-username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="Contoh: kasir1"
          error={fieldErrors.username?.[0]}
          required
        />

        {/* Email */}
        <FormField
          label="Alamat Email"
          id="new-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="kasir1@kopikita.id"
          error={fieldErrors.email?.[0]}
          required
        />

        {/* Password */}
        <PasswordField
          label="Kata Sandi (Password)"
          id="new-password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Minimal 8 karakter"
          error={fieldErrors.password?.[0]}
          helperText="Gunakan kombinasi huruf dan angka yang aman."
          required
        />

        {/* Role Select */}
        <div>
          <label
            htmlFor="new-role"
            className="block text-[13px] font-medium text-[#1a1c1c] mb-1"
          >
            Peran Pengguna (Role) <span className="text-[#ba1a1a]">*</span>
          </label>
          <select
            id="new-role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full h-[38px] px-3 bg-white border border-[#e5e5e5] rounded-[4px] text-[13px] text-[#1a1c1c] focus:outline-none focus:border-[#6d28d9] transition-colors"
          >
            <option value="staff">Staff (Akses Kasir &amp; Stok Masuk)</option>
            <option value="owner">Owner (Akses Penuh Seluruh Sistem)</option>
          </select>
          <p className="text-[11px] text-[#7b7486] mt-1">
            Role Staff tidak memiliki izin untuk mengedit kategori atau profil usaha.
          </p>
        </div>
      </form>
    </Modal>
  );
}
