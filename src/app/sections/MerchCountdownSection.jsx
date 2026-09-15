"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const MERCH_ASSETS = {
  front: {
    src: "https://ik.imagekit.io/wfnazmyxh/Posts/front.png",
    alt: "Official UOK Robot Games 2K26 Jersey — Front Crest View",
  },
  back: {
    src: "https://ik.imagekit.io/wfnazmyxh/Posts/back.png",
    alt: "Official UOK Robot Games 2K26 Jersey — Back Arena Graphics View",
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
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining);
  const [activeView, setActiveView] = useState("both"); // "both" | "front" | "back"

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
      className="relative py-20 sm:py-28 overflow-hidden bg-black text-white"
    >
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#004491]/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00d2ff]/12 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Clean Header (No redundant text or clutter) */}
        <div className="pb-8 sm:pb-12 border-b border-white/[0.08]">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[2px] w-8 bg-[#00d2ff]" />
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#00d2ff] uppercase font-mono">
              OFFICIAL MERCHANDISE 2K26
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            The Official Merch 2K26{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#529dff] to-[#004491]">
              Now Available For Pre-Order
            </span>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-10 sm:pt-14 items-center">
          
          {/* ════════════════════════════════════════════════════════════════
              LEFT: Pure Apparel Showcase (Zero Clutter)
             ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Minimal View Selector */}
            <div className="flex items-center gap-6 mb-6 text-xs font-mono tracking-widest uppercase">
              <button
                type="button"
                onClick={() => setActiveView("both")}
                className={`pb-1.5 border-b-2 transition-all cursor-pointer ${
                  activeView === "both"
                    ? "text-[#00d2ff] border-[#00d2ff] font-bold"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                Dual View
              </button>
              <button
                type="button"
                onClick={() => setActiveView("front")}
                className={`pb-1.5 border-b-2 transition-all cursor-pointer ${
                  activeView === "front"
                    ? "text-[#00d2ff] border-[#00d2ff] font-bold"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => setActiveView("back")}
                className={`pb-1.5 border-b-2 transition-all cursor-pointer ${
                  activeView === "back"
                    ? "text-[#00d2ff] border-[#00d2ff] font-bold"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                Back
              </button>
            </div>

            {/* Garment Stage */}
            <div className="relative w-full flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
              
              {/* Floor ambient reflection spotlight */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent blur-2xl rounded-full pointer-events-none" />

              {/* DUAL VIEW */}
              {activeView === "both" && (
                <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full max-w-2xl items-end">
                  <div
                    onClick={() => setActiveView("front")}
                    className="group cursor-pointer flex flex-col items-center"
                    title="Click to focus Front"
                  >
                    <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                      <Image
                        src={MERCH_ASSETS.front.src}
                        alt={MERCH_ASSETS.front.alt}
                        width={640}
                        height={800}
                        priority
                        className="max-h-[360px] sm:max-h-[460px] w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveView("back")}
                    className="group cursor-pointer flex flex-col items-center"
                    title="Click to focus Back"
                  >
                    <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                      <Image
                        src={MERCH_ASSETS.back.src}
                        alt={MERCH_ASSETS.back.alt}
                        width={640}
                        height={800}
                        priority
                        className="max-h-[360px] sm:max-h-[460px] w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SINGLE FRONT VIEW */}
              {activeView === "front" && (
                <div className="flex flex-col items-center max-w-md w-full">
                  <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                    <Image
                      src={MERCH_ASSETS.front.src}
                      alt={MERCH_ASSETS.front.alt}
                      width={700}
                      height={875}
                      priority
                      className="max-h-[420px] sm:max-h-[500px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}

              {/* SINGLE BACK VIEW */}
              {activeView === "back" && (
                <div className="flex flex-col items-center max-w-md w-full">
                  <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                    <Image
                      src={MERCH_ASSETS.back.src}
                      alt={MERCH_ASSETS.back.alt}
                      width={700}
                      height={875}
                      priority
                      className="max-h-[420px] sm:max-h-[500px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT: Clean, High-Impact Countdown, Price & Actions
             ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col space-y-7">
            
            {/* Live Countdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-400 font-semibold">
                  Pre-Orders Close September 18th
                </span>
              </div>

              {/* Bold Minimalist Digits */}
              <div className="flex items-baseline gap-2 sm:gap-4 select-none">
                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
                    {formatUnit(timeLeft.days)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase mt-2 font-mono">
                    DAYS
                  </span>
                </div>

                <span className="text-2xl sm:text-4xl font-light text-zinc-600 self-start leading-none pt-1">:</span>

                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
                    {formatUnit(timeLeft.hours)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase mt-2 font-mono">
                    HOURS
                  </span>
                </div>

                <span className="text-2xl sm:text-4xl font-light text-zinc-600 self-start leading-none pt-1">:</span>

                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
                    {formatUnit(timeLeft.minutes)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase mt-2 font-mono">
                    MINS
                  </span>
                </div>

                <span className="text-2xl sm:text-4xl font-light text-zinc-600 self-start leading-none pt-1">:</span>

                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-[#00d2ff] leading-none drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]">
                    {formatUnit(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.22em] text-[#00d2ff]/80 uppercase mt-2 font-mono">
                    SECS
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs: 3 clean, quiet chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
                Athletic Honeycomb Mesh
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
                Unisex XS — 3XL
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
                Collect at Arena
              </span>
            </div>

            {/* Price */}
            <div>
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                Rs. 1,900
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <Link
                  href="/tshirt"
                  className="flex-1 py-4 px-6 bg-[#004491] hover:bg-[#003570] text-white text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,68,145,0.4)] hover:shadow-[0_0_35px_rgba(0,68,145,0.6)] group text-center uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  <span>Pre-Order Jersey — Rs. 1,900</span>
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  href="/tshirt"
                  className="py-4 px-5 border border-zinc-700 hover:border-zinc-500 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <span className="material-symbols-outlined text-base text-[#00d2ff]">straighten</span>
                  <span>Size Guide</span>
                </Link>
              </div>

              <p className="text-[11px] text-zinc-500">
                Competing teams: Order for your entire roster inside the{" "}
                <Link href="/login" className="text-[#00d2ff] hover:underline">
                  Team Dashboard
                </Link>.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
