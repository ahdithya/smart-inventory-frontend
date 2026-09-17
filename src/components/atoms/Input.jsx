import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    type = 'text',
    id,
    name,
    value,
    defaultValue,
    onChange,
    placeholder,
    isError = false,
    disabled = false,
    className = '',
    autoComplete,
    ...props
  },
  ref
) {
  const baseStyles =
    'w-full h-11 px-3 bg-white text-[14px] text-[#1a1c1c] rounded-[6px] transition-colors duration-150 placeholder:text-[#9ca3af] disabled:bg-[#f9f9f9] disabled:text-[#9ca3af] disabled:cursor-not-allowed';

  const borderStyles = isError
    ? 'border border-[#ba1a1a] focus:border-[#ba1a1a]'
    : 'border border-[#e5e5e5] focus:border-[#6d28d9]';

  return (
    <input
      ref={ref}
      type={type}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      className={`${baseStyles} ${borderStyles} ${className}`}
      {...props}
    />
  );
});
