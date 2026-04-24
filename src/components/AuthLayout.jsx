"use client";

import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#030303] flex items-center justify-center p-4 font-space-grotesk overflow-hidden">
      
      {/* Premium Dark Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Premium Spotlight Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d2ff] rounded-full blur-[200px] opacity-[0.05] pointer-events-none z-0" />

      {/* Top Left Back Button */}
      <div className="absolute top-8 left-8 sm:left-12 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-bold group"
        >
          <span className="material-symbols-outlined transform group-hover:-translate-x-2 transition-transform text-sm">
            arrow_back
          </span>
          RETURN TO ARENA
        </Link>
      </div>

      {/* Main Content Card Wrapper - Premium Glass */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#080808] border border-outline-variant shadow-[0_0_50px_rgba(0,0,0,0.9)] p-8 sm:p-10 animate-fade-slide">
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]"></div>
        {children}
      </div>
    </div>
  );
}
