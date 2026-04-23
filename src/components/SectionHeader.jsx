export default function SectionHeader({ title, subtitle, className = "" }) {
  return (
    <header
      className={`mb-16 relative z-10 text-center flex flex-col items-center ${className}`}
    >
      <h2 className="text-[32px] leading-[1.2] font-semibold tracking-[-0.02em] text-white uppercase tracking-widest">
        {title}
      </h2>
      <div className="h-[3px] w-16 bg-[#004491] mt-2 mb-6" />
      {subtitle && (
        <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl text-center">
          {subtitle}
        </p>
      )}
    </header>
  );
}
