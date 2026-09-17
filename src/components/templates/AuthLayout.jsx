
export function AuthLayout({ children, maxWidth = 'max-w-[420px]', footer }) {
  return (
    <main className="min-h-screen bg-[#f4f3f3] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className={`w-full ${maxWidth}`}>
        <div className="bg-white border border-[#e5e5e5] rounded-[8px] p-6 sm:p-8 flex flex-col">
          {children}

          {footer && (
            <div className="text-center text-[13px] text-[#5f5e5e] border-t border-[#eeeeee] pt-5 mt-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
