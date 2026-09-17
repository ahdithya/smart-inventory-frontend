import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    id,
    name,
    value,
    defaultValue,
    onChange,
    isError = false,
    disabled = false,
    children,
    className = '',
    ...props
  },
  ref
) {
  const baseStyles =
    'w-full h-11 pl-3 pr-9 bg-white text-[14px] text-[#1a1c1c] rounded-[6px] transition-colors duration-150 appearance-none disabled:bg-[#f9f9f9] disabled:text-[#9ca3af] disabled:cursor-not-allowed';

  const borderStyles = isError
    ? 'border border-[#ba1a1a] focus:border-[#ba1a1a]'
    : 'border border-[#e5e5e5] focus:border-[#6d28d9]';

  return (
    <div className="relative w-full">
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#5f5e5e]">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
});
