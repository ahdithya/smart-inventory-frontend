import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '../atoms/Label';
import { ErrorText } from '../atoms/ErrorText';

export function PasswordField({
  label = 'Password',
  id,
  name = 'password',
  value,
  onChange,
  placeholder = 'Masukkan password',
  error,
  required = false,
  disabled = false,
  autoComplete = 'current-password',
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const borderStyles = error
    ? 'border border-[#ba1a1a] focus:border-[#ba1a1a]'
    : 'border border-[#e5e5e5] focus:border-[#6d28d9]';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}

      <div className="relative w-full">
        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full h-11 pl-3 pr-10 bg-white text-[14px] text-[#1a1c1c] rounded-[6px] transition-colors duration-150 placeholder:text-[#9ca3af] disabled:bg-[#f9f9f9] disabled:text-[#9ca3af] disabled:cursor-not-allowed ${borderStyles}`}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={toggleVisibility}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7b7486] hover:text-[#1a1c1c] transition-colors focus:outline-none"
          aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
