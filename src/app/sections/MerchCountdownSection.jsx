"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const MERCH_IMAGES = {
  front: {
    src: "https://ik.imagekit.io/wfnazmyxh/Posts/front.png",
    alt: "Official UOK Robot Games 2K26 Jersey - Front View",
    label: "Front View",
    highlight: "Tournament Chest Insignia",
  },
  back: {
    src: "https://ik.imagekit.io/wfnazmyxh/Posts/back.png",
    alt: "Official UOK Robot Games 2K26 Jersey - Back View",
    label: "Back View",
    highlight: "Arena Cyber Callout & Backing",
  },
};

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

export default function MerchCountdownSection() {
  const [activeView, setActiveView] = useState("front");
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUnit = (num) => String(num).padStart(2, "0");

  return (
    <section
      id="merchandise"
      aria-label="Official Merchandise 2K26 Pre-Order"
      className="relative py-20 lg:py-28 overflow-hidden bg-[#05060b] border-t border-b border-white/[0.06]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#004491]/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-[#00d2ff]/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Tag */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004491]/20 border border-[#004491]/40 text-[#5b9aff] text-xs font-semibold mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse" />
            <span className="tracking-wider uppercase">Official Merchandise 2K26</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.15]">
            The Official Merch 2K26{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#4ea1ff] to-[#004491] mt-1">
              Now Available For Pre-Order
            </span>
          </h2>

          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Step into the tournament arena with the official UOK Robot Games 2K26 jersey. Crafted with athletic honeycomb mesh for maximum comfort and breathability under competition pressure.
          </p>
        </div>

        {/* Main 2-Column Showcase Card */}
        <div className="bg-[#0a0b14]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* ════════════════════════════════════════════════════════════════
                LEFT COLUMN: Interactive Jersey Viewer
               ════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 flex flex-col items-center">
              
              {/* Perspective Pill Switcher */}
              <div className="inline-flex items-center p-1 bg-[#121320] border border-white/[0.08] rounded-xl mb-6 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveView("front")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeView === "front"
                      ? "bg-[#004491] text-white shadow-md shadow-[#004491]/30 border border-[#00d2ff]/40"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">shield</span>
                  <span>Front View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("back")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeView === "back"
                      ? "bg-[#004491] text-white shadow-md shadow-[#004491]/30 border border-[#00d2ff]/40"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">rotate_right</span>
                  <span>Back View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("both")}
                  className={`hidden sm:flex px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer items-center gap-1.5 ${
                    activeView === "both"
                      ? "bg-[#004491] text-white shadow-md shadow-[#004491]/30 border border-[#004491]/50"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">view_column</span>
                  <span>Both Views</span>
                </button>
              </div>

              {/* Jersey Display Stage */}
              <div className="relative w-full max-w-[440px] aspect-square rounded-2xl bg-gradient-to-b from-[#121322]/80 to-[#07080f]/90 border border-white/[0.08] flex items-center justify-center p-4 sm:p-6 group overflow-hidden shadow-xl">
                
                {/* Stage spotlight glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00d2ff]/10 via-transparent to-transparent opacity-70 pointer-events-none" />

                {/* Badges on stage */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-xs text-[#00d2ff]">check_circle</span>
                  <span>Honeycomb Fabric</span>
                </div>

                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md bg-[#004491]/30 border border-[#004491]/60 text-[11px] font-bold text-[#00d2ff] backdrop-blur-sm">
                  Rs. 1,900
                </div>

                {/* Jersey Presentation (Single or Dual) */}
                {activeView === "both" ? (
                  <div className="grid grid-cols-2 gap-2 w-full h-full items-center relative z-10">
                    <div className="flex flex-col items-center">
                      <Image
                        src={MERCH_IMAGES.front.src}
                        alt={MERCH_IMAGES.front.alt}
                        width={400}
                        height={400}
                        priority
                        className="w-full h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-300"
                      />
                      <span className="text-[11px] font-medium text-zinc-400 mt-1">Front</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image
                        src={MERCH_IMAGES.back.src}
                        alt={MERCH_IMAGES.back.alt}
                        width={400}
                        height={400}
                        priority
                        className="w-full h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-300"
                      />
                      <span className="text-[11px] font-medium text-zinc-400 mt-1">Back</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center z-10">
                    <Image
                      src={MERCH_IMAGES[activeView].src}
                      alt={MERCH_IMAGES[activeView].alt}
                      width={600}
                      height={600}
                      priority
                      className="max-h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,210,255,0.18)] transition-all duration-300 hover:scale-[1.03]"
                    />
                  </div>
                )}

                {/* Illuminated Pedestal Ring */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-4 bg-gradient-to-r from-transparent via-[#00d2ff]/25 to-transparent blur-md rounded-full pointer-events-none" />
              </div>

              {/* View Switcher Thumbnails */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView("front")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    activeView === "front"
                      ? "bg-[#16182a] border-[#00d2ff] text-white shadow-sm"
                      : "bg-[#0e0f1a] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                  <span>Front: Tournament Crest</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("back")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    activeView === "back"
                      ? "bg-[#16182a] border-[#00d2ff] text-white shadow-sm"
                      : "bg-[#0e0f1a] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#004491]" />
                  <span>Back: Arena Graphics</span>
                </button>
              </div>

            </div>

            {/* ════════════════════════════════════════════════════════════════
                RIGHT COLUMN: Countdown, Pricing & Call To Action
               ════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              {/* Countdown Unit Box */}
              <div className="bg-[#0e0f1c] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#004491] via-[#00d2ff] to-[#004491]" />

                {/* Urgency Badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                    </span>
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                      Pre-Order Deadline
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                    Closes Sept 18, 2026
                  </span>
                </div>

                {/* 4 Digital Time Counters */}
                <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
                  
                  {/* Days */}
                  <div className="bg-[#141628] border border-white/[0.06] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                      {formatUnit(timeLeft.days)}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mt-1">
                      Days
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-[#141628] border border-white/[0.06] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                      {formatUnit(timeLeft.hours)}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mt-1">
                      Hours
                    </div>
                  </div>

                  {/* Minutes */}
                  <div className="bg-[#141628] border border-white/[0.06] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                      {formatUnit(timeLeft.minutes)}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mt-1">
                      Mins
                    </div>
                  </div>

                  {/* Seconds */}
                  <div className="bg-[#141628] border border-white/[0.06] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-[#00d2ff] tracking-tight">
                      {formatUnit(timeLeft.seconds)}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mt-1">
                      Secs
                    </div>
                  </div>

                </div>

                <p className="text-xs text-zinc-400 text-center mt-4 leading-relaxed">
                  Pre-orders will be locked after <strong>September 18th</strong> to ensure batch production for event day collection.
                </p>
              </div>

              {/* Price & Specs Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121424]/80 border border-white/[0.06] p-4 sm:p-5 rounded-2xl mb-8">
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Tournament Pre-Order Price</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      Rs. 1,900
                    </span>
                    <span className="text-xs text-zinc-400 font-normal">/ unit</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#004491]/20 border border-[#004491]/40 text-[#00d2ff] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
                    Unisex XS – 3XL
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Official Release
                  </span>
                </div>
              </div>

              {/* Specification Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <span className="material-symbols-outlined text-[#00d2ff] text-base shrink-0">check_circle</span>
                  <span>Premium sweat-wicking honeycomb knit</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <span className="material-symbols-outlined text-[#00d2ff] text-base shrink-0">check_circle</span>
                  <span>High-definition sublimation cyber print</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <span className="material-symbols-outlined text-[#00d2ff] text-base shrink-0">check_circle</span>
                  <span>Standard athletic unisex dimensions</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <span className="material-symbols-outlined text-[#00d2ff] text-base shrink-0">check_circle</span>
                  <span>Handed out at Arena Registration Desk</span>
                </div>
              </div>

              {/* Call-To-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/tshirt"
                  className="flex-1 px-8 py-4 bg-[#004491] hover:bg-[#003673] text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#004491]/25 hover:shadow-[#004491]/40 cursor-pointer text-center group"
                >
                  <span className="material-symbols-outlined text-base">shopping_bag</span>
                  <span>Pre-Order Your Jersey — Rs. 1,900</span>
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  href="/tshirt"
                  className="px-6 py-4 border border-zinc-700 hover:border-zinc-500 bg-[#121320] text-zinc-300 hover:text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span className="material-symbols-outlined text-base text-[#00d2ff]">straighten</span>
                  <span>Size Measurements Guide</span>
                </Link>
              </div>

              <p className="text-[11px] text-zinc-400 mt-3.5 text-center sm:text-left">
                Competing teams can also order directly via their <Link href="/login" className="text-[#00d2ff] hover:underline">Team Portal Dashboard</Link>.
              </p>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
