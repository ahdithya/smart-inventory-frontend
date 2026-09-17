import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FormField } from '../molecules/FormField';
import { PasswordField } from '../molecules/PasswordField';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { ApiError } from '../../services/api';

export function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      errors.username = 'Username atau email wajib diisi.';
    }
    if (!formData.password) {
      errors.password = 'Password wajib diisi.';
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
      await login({
        username: formData.username.trim(),
        password: formData.password,
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
          'Username atau password salah.';
        setGeneralError(displayError);
      } else {
        setGeneralError('Gagal masuk. Periksa jaringan Anda dan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {generalError && <Alert type="error" message={generalError} />}

      <FormField
        label="Username / Email"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Masukkan username atau email"
        error={fieldErrors.username}
        autoComplete="username"
        required
        disabled={isLoading}
      />

      <PasswordField
        label="Password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Masukkan password"
        error={fieldErrors.password}
        autoComplete="current-password"
        required
        disabled={isLoading}
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Masuk
        </Button>
      </div>
    </form>
  );
}
