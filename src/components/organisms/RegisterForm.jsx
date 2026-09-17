import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FormField } from '../molecules/FormField';
import { PasswordField } from '../molecules/PasswordField';
import { Select } from '../atoms/Select';
import { Label } from '../atoms/Label';
import { ErrorText } from '../atoms/ErrorText';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { ApiError } from '../../services/api';

const BUSINESS_TYPES = [
  { value: 'beverage', label: 'Minuman / Kopi' },
  { value: 'food', label: 'Makanan / Kuliner' },
  { value: 'retail', label: 'Retail / Kelontong' },
  { value: 'fashion', label: 'Fashion / Busana' },
  { value: 'services', label: 'Jasa / Layanan' },
  { value: 'others', label: 'Lainnya' },
];

export function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    business_name: '',
    business_type: 'beverage',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Username wajib diisi.';
    } else if (formData.username.length < 3) {
      errors.username = 'Username minimal 3 karakter.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid.';
    }

    if (!formData.password) {
      errors.password = 'Password wajib diisi.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password minimal 8 karakter.';
    }

    if (!formData.confirm_password) {
      errors.confirm_password = 'Konfirmasi password wajib diisi.';
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Password dan konfirmasi password tidak cocok.';
    }

    if (!formData.business_name.trim()) {
      errors.business_name = 'Nama toko / bisnis wajib diisi.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        business_name: formData.business_name.trim(),
        business_type: formData.business_type,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && Object.keys(err.fields).length > 0) {
          const mappedErrors = {};
          for (const key in err.fields) {
            mappedErrors[key] = Array.isArray(err.fields[key])
              ? err.fields[key][0]
              : err.fields[key];
          }
          setFieldErrors(mappedErrors);
        }
        const displayError =
          err.fields?.non_field_errors?.[0] ||
          err.fields?.detail?.[0] ||
          err.message ||
          'Gagal mendaftar. Periksa input data Anda.';
        setGeneralError(displayError);
      } else {
        setGeneralError('Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
      {generalError && <Alert type="error" message={generalError} />}

      <FormField
        label="Username"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Pilih username unik"
        error={fieldErrors.username}
        autoComplete="username"
        required
        disabled={isLoading}
      />

      <FormField
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="nama@email.com"
        error={fieldErrors.email}
        autoComplete="email"
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PasswordField
          label="Password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min. 8 karakter"
          error={fieldErrors.password}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />

        <PasswordField
          label="Konfirmasi"
          id="confirm_password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Ulangi password"
          error={fieldErrors.confirm_password}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />
      </div>

      <div className="h-px w-full bg-[#eeeeee] my-2" />

      <FormField
        label="Nama Toko / Bisnis"
        id="business_name"
        name="business_name"
        value={formData.business_name}
        onChange={handleChange}
        placeholder="Contoh: Kopi Kita, Berkah Retail"
        error={fieldErrors.business_name}
        required
        disabled={isLoading}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="business_type" required>
          Jenis Usaha
        </Label>
        <Select
          id="business_type"
          name="business_type"
          value={formData.business_type}
          onChange={handleChange}
          isError={!!fieldErrors.business_type}
          disabled={isLoading}
        >
          {BUSINESS_TYPES.map((bt) => (
            <option key={bt.value} value={bt.value}>
              {bt.label}
            </option>
          ))}
        </Select>
        {fieldErrors.business_type && <ErrorText>{fieldErrors.business_type}</ErrorText>}
      </div>

      <div className="pt-3">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Daftar Akun
        </Button>
      </div>
    </form>
  );
}
