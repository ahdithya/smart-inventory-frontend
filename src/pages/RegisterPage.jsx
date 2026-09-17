import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/templates/AuthLayout';
import { AuthHeader } from '../components/molecules/AuthHeader';
import { RegisterForm } from '../components/organisms/RegisterForm';

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSuccess = () => {
    navigate('/', { replace: true });
  };

  const footer = (
    <span>
      Sudah punya akun?{' '}
      <Link
        to="/login"
        className="font-semibold text-[#1a1c1c] hover:text-[#6d28d9] transition-colors inline-block"
      >
        Masuk di Sini
      </Link>
    </span>
  );

  return (
    <AuthLayout maxWidth="max-w-[460px]" footer={footer}>
      <AuthHeader
        title="Buat Akun Baru"
        subtitle="Daftarkan profil bisnis UMKM Anda untuk memulai"
      />
      <RegisterForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
