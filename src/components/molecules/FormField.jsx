import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';
import { ErrorText } from '../atoms/ErrorText';

export function FormField({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  children,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}

      {children ? (
        children
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isError={!!error}
          disabled={disabled}
          autoComplete={autoComplete}
          {...props}
        />
      )}

      {error ? (
        <ErrorText>{error}</ErrorText>
      ) : helperText ? (
        <span className="text-[12px] text-[#7b7486] mt-1">{helperText}</span>
      ) : null}
    </div>
  );
}
