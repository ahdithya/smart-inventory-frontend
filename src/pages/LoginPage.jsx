import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/templates/AuthLayout';
import { AuthHeader } from '../components/molecules/AuthHeader';
import { LoginForm } from '../components/organisms/LoginForm';

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  const footer = (
    <span>
      Belum punya akun?{' '}
      <Link
        to="/register"
        className="font-semibold text-[#1a1c1c] hover:text-[#6d28d9] transition-colors inline-block"
      >
        Daftar Sekarang
      </Link>
    </span>
  );

  return (
    <AuthLayout footer={footer}>
      <AuthHeader
        title="Masuk ke Smartify UMKM"
        subtitle="Kelola stok dan prediksi kebutuhan bisnis Anda"
      />
      <LoginForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
