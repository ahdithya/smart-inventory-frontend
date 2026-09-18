import { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    id,
    name,
    value,
    defaultValue,
    onChange,
    placeholder,
    rows = 3,
    isError = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  const baseStyles =
    'w-full p-3 bg-white text-[14px] text-[#1a1c1c] rounded-[6px] transition-colors duration-150 placeholder:text-[#9ca3af] resize-y disabled:bg-[#f9f9f9] disabled:text-[#9ca3af] disabled:cursor-not-allowed';

  const borderStyles = isError
    ? 'border border-[#ba1a1a] focus:border-[#ba1a1a]'
    : 'border border-[#e5e5e5] focus:border-[#6d28d9]';

  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`${baseStyles} ${borderStyles} ${className}`}
      {...props}
    />
  );
});
