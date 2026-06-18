"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-[68px] h-[76px] sm:w-[82px] sm:h-[90px] md:w-[96px] md:h-[104px] bg-[#0b0c16] border border-outline-variant flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-40" />
        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tabular-nums leading-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold text-outline uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

export default function RegistrationLockScreen() {
  const openDate = new Date(
    process.env.NEXT_PUBLIC_REGISTRATION_OPEN_DATE || "2026-06-22T00:00:00+05:30"
  );

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = openDate - now;

      if (diff <= 0) {
        setIsOpen(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isOpen) return null;

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background — matches site hero subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,68,145,0.06)_0%,transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">

        {/* Logos — same row as auth pages */}
        <div className="flex items-center justify-center gap-6 mb-14 w-full">
          <Image src="https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160" alt="UOK Robot Games" width={100} height={36} className="w-auto h-8 object-contain opacity-90" />
          <div className="w-[1px] h-6 bg-zinc-700"></div>
          <Image src="https://ik.imagekit.io/wfnazmyxh/images/UniLogo.svg?updatedAt=1777697834303" alt="UOK" width={70} height={36} className="w-auto h-8 object-contain opacity-80" />
          <div className="w-[1px] h-6 bg-zinc-700"></div>
          <Image src="https://ik.imagekit.io/wfnazmyxh/images/club_logo.png?updatedAt=1777698175245" alt="ECSC" width={70} height={36} className="w-auto h-8 object-contain opacity-80" />
        </div>

        {/* Phase label — matches timeline style */}
        <div className="font-bold text-[11px] text-[#5b9aff] tracking-[0.1em] uppercase mb-2">
          PHASE_01 // UPLINK
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest mb-3">
          REGISTRATION OPENING SOON
        </h1>

        <div className="h-[2px] w-12 bg-[#004491] mb-6" />

        <p className="text-on-surface-variant text-sm mb-12 max-w-sm leading-relaxed">
          The registration portal is currently locked. Prepare your machines — the arena awaits.
        </p>

        {/* Countdown row */}
        <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-12">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <div className="flex flex-col items-center gap-2 pt-6 sm:pt-8 md:pt-9">
            <div className="w-[5px] h-[5px] rounded-full bg-[#004491]" />
            <div className="w-[5px] h-[5px] rounded-full bg-[#004491]" />
          </div>
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <div className="flex flex-col items-center gap-2 pt-6 sm:pt-8 md:pt-9">
            <div className="w-[5px] h-[5px] rounded-full bg-[#004491]" />
            <div className="w-[5px] h-[5px] rounded-full bg-[#004491]" />
          </div>
          <CountdownUnit value={timeLeft.minutes} label="Minutes" />
          <div className="flex flex-col items-center gap-2 pt-6 sm:pt-8 md:pt-9">
            <div className="w-[5px] h-[5px] rounded-full bg-[#004491]" />
            <div className="w-[5px] h-[5px] rounded-full bg-[#004491]" />
          </div>
          <CountdownUnit value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Back to home — same style as site buttons */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#004491]/10 border border-[#004491]/30 text-[#5b9aff] px-8 py-3 font-bold text-[10px] tracking-widest uppercase hover:bg-[#004491]/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
