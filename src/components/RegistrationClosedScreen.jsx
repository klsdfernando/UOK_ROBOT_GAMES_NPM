"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegistrationClosedScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,68,145,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Logo */}
        <Image
          src="https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160"
          alt="UOK Robot Games"
          width={200}
          height={72}
          className="w-auto h-14 sm:h-16 object-contain mb-10 opacity-90"
        />

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-8">
          <span
            className="material-symbols-outlined text-red-400 text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            block
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest mb-3">
          REGISTRATION CLOSED
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mb-10 max-w-md leading-relaxed">
          The registration period has ended. If you already have an account, you can still log in to access your dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#004491] text-white px-8 py-3 font-bold text-xs tracking-widest uppercase hover:bg-[#002d5e] transition-colors border border-[#004491] rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            LOGIN
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
