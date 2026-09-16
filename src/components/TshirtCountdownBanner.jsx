"use client";

import { useState, useEffect } from "react";

const TARGET_DATE_ISO = "2026-09-18T23:59:59+05:30";

function getTimeRemaining() {
  const targetTimestamp = new Date(TARGET_DATE_ISO).getTime();
  const now = new Date().getTime();
  const difference = targetTimestamp - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function TshirtCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUnit = (num) => String(num).padStart(2, "0");

  return (
    <div className="w-full bg-gradient-to-r from-[#0b0c16] via-[#0e1224] to-[#0b0c16] border border-[#00d2ff]/25 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,102,255,0.12)] mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Urgency Title & Deadline Date */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 hidden sm:flex">
            <span className="material-symbols-outlined text-rose-400 text-xl">timer</span>
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-400 font-bold">
                Pre-Order Deadline
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide mt-0.5">
              Pre-Orders Close September 18, 2026
            </h3>
          </div>
        </div>

        {/* Right: Digital Countdown Digits */}
        <div className="flex items-baseline gap-2 sm:gap-3.5 select-none">
          <div className="flex flex-col items-center min-w-[44px] sm:min-w-[56px] py-1.5 px-2 rounded-lg bg-black/50 border border-white/[0.08]">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {formatUnit(timeLeft.days)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-1 font-mono">
              DAYS
            </span>
          </div>

          <span className="text-lg sm:text-2xl font-light text-zinc-700 leading-none select-none">:</span>

          <div className="flex flex-col items-center min-w-[44px] sm:min-w-[56px] py-1.5 px-2 rounded-lg bg-black/50 border border-white/[0.08]">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {formatUnit(timeLeft.hours)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-1 font-mono">
              HOURS
            </span>
          </div>

          <span className="text-lg sm:text-2xl font-light text-zinc-700 leading-none select-none">:</span>

          <div className="flex flex-col items-center min-w-[44px] sm:min-w-[56px] py-1.5 px-2 rounded-lg bg-black/50 border border-white/[0.08]">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {formatUnit(timeLeft.minutes)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-1 font-mono">
              MINS
            </span>
          </div>

          <span className="text-lg sm:text-2xl font-light text-zinc-700 leading-none select-none">:</span>

          <div className="flex flex-col items-center min-w-[44px] sm:min-w-[56px] py-1.5 px-2 rounded-lg bg-black/50 border border-white/[0.08]">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#00d2ff] tracking-tight leading-none drop-shadow-[0_0_10px_rgba(0,210,255,0.45)]">
              {formatUnit(timeLeft.seconds)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#00d2ff]/80 uppercase mt-1 font-mono">
              SECS
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
