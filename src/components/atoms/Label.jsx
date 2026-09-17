
export function Label({ children, htmlFor, required = false, className = '', ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-semibold text-[11px] tracking-[0.08em] uppercase text-[#5f5e5e] select-none ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-[#ba1a1a] ml-1 font-bold">*</span>}
    </label>
  );
}
