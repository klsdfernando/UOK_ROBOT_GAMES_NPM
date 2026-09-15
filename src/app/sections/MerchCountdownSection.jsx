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
      className="relative py-24 sm:py-32 overflow-hidden bg-black text-white"
    >
      {/* Background Stage Lighting: Deep atmospheric arena spotlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(0,68,145,0.22)_0%,_rgba(0,210,255,0.08)_40%,_transparent_75%)] pointer-events-none blur-3xl" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* ════════════════════════════════════════════════════════════════
            1. CENTERED EDITORIAL HEADER
           ════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004491]/20 border border-[#004491]/40 text-[#5b9aff] text-xs font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse" />
            <span className="tracking-[0.2em] uppercase font-mono">Official Merchandise 2K26</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08]">
            The Official Merch 2K26{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#60a5fa] to-[#0055cc] mt-1.5">
              Now Available For Pre-Order
            </span>
          </h2>

          <p className="mt-5 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Step into the arena wearing the official tournament jersey. Crafted with athletic honeycomb mesh for maximum comfort and thermal control.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            2. CENTERED COUNTDOWN STRIP
           ════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-[0.22em] text-rose-400 font-semibold">
              Pre-Orders Close September 18, 2026
            </span>
          </div>

          {/* Large Authoritative Digital Numerals */}
          <div className="flex items-baseline gap-3 sm:gap-6 md:gap-8 select-none">
            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px]">
              <span className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-white leading-none">
                {formatUnit(timeLeft.days)}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mt-2 font-mono">
                DAYS
              </span>
            </div>

            <span className="text-2xl sm:text-4xl lg:text-5xl font-extralight text-zinc-700 leading-none pb-2 select-none">:</span>

            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px]">
              <span className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-white leading-none">
                {formatUnit(timeLeft.hours)}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mt-2 font-mono">
                HOURS
              </span>
            </div>

            <span className="text-2xl sm:text-4xl lg:text-5xl font-extralight text-zinc-700 leading-none pb-2 select-none">:</span>

            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px]">
              <span className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-white leading-none">
                {formatUnit(timeLeft.minutes)}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mt-2 font-mono">
                MINS
              </span>
            </div>

            <span className="text-2xl sm:text-4xl lg:text-5xl font-extralight text-zinc-700 leading-none pb-2 select-none">:</span>

            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px]">
              <span className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-[#00d2ff] leading-none drop-shadow-[0_0_15px_rgba(0,210,255,0.5)]">
                {formatUnit(timeLeft.seconds)}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#00d2ff]/80 uppercase mt-2 font-mono">
                SECS
              </span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            3. HERO APPAREL STAGE (Centerpiece with Floor Glow)
           ════════════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col items-center">
          
          {/* Elegant View Selector Switch */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8">
            <button
              type="button"
              onClick={() => setActiveView("both")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeView === "both"
                  ? "bg-[#004491] text-white shadow-md font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Dual View
            </button>
            <button
              type="button"
              onClick={() => setActiveView("front")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeView === "front"
                  ? "bg-[#004491] text-white shadow-md font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Front View
            </button>
            <button
              type="button"
              onClick={() => setActiveView("back")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeView === "back"
                  ? "bg-[#004491] text-white shadow-md font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Back View
            </button>
          </div>

          {/* Garment Presentation Stage */}
          <div className="relative w-full max-w-4xl flex items-center justify-center min-h-[380px] sm:min-h-[480px]">
            
            {/* Ambient floor pedestal lighting */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-gradient-to-r from-transparent via-[#00d2ff]/25 to-transparent blur-2xl rounded-full pointer-events-none" />

            {/* DUAL VIEW: Side-by-Side Large Stage */}
            {activeView === "both" && (
              <div className="grid grid-cols-2 gap-4 sm:gap-12 w-full max-w-3xl items-end justify-center">
                <div
                  onClick={() => setActiveView("front")}
                  className="group cursor-pointer flex flex-col items-center"
                  title="Click to zoom Front View"
                >
                  <div className="relative w-full aspect-[4/5] max-w-[340px] flex items-center justify-center">
                    <Image
                      src={MERCH_ASSETS.front.src}
                      alt={MERCH_ASSETS.front.alt}
                      width={640}
                      height={800}
                      priority
                      className="max-h-[380px] sm:max-h-[480px] w-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mt-3 block">
                    Front Crest
                  </span>
                </div>

                <div
                  onClick={() => setActiveView("back")}
                  className="group cursor-pointer flex flex-col items-center"
                  title="Click to zoom Back View"
                >
                  <div className="relative w-full aspect-[4/5] max-w-[340px] flex items-center justify-center">
                    <Image
                      src={MERCH_ASSETS.back.src}
                      alt={MERCH_ASSETS.back.alt}
                      width={640}
                      height={800}
                      priority
                      className="max-h-[380px] sm:max-h-[480px] w-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mt-3 block">
                    Back Cyber
                  </span>
                </div>
              </div>
            )}

            {/* SINGLE FRONT VIEW */}
            {activeView === "front" && (
              <div className="flex flex-col items-center max-w-lg w-full">
                <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                  <Image
                    src={MERCH_ASSETS.front.src}
                    alt={MERCH_ASSETS.front.alt}
                    width={700}
                    height={875}
                    priority
                    className="max-h-[440px] sm:max-h-[540px] w-auto object-contain drop-shadow-[0_30px_55px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 mt-3 block">
                  Official Tournament Crest · Sublimated Print
                </span>
              </div>
            )}

            {/* SINGLE BACK VIEW */}
            {activeView === "back" && (
              <div className="flex flex-col items-center max-w-lg w-full">
                <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                  <Image
                    src={MERCH_ASSETS.back.src}
                    alt={MERCH_ASSETS.back.alt}
                    width={700}
                    height={875}
                    priority
                    className="max-h-[440px] sm:max-h-[540px] w-auto object-contain drop-shadow-[0_30px_55px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 mt-3 block">
                  Cyber Arena Back Graphics · Full Sublimation
                </span>
              </div>
            )}

          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            4. CENTERED PRICE, SPECS & ACTIONS
           ════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center text-center mt-12 sm:mt-14 space-y-6 w-full max-w-xl">
          
          {/* Price Tag */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-6xl font-black font-mono text-white tracking-tight">
              Rs. 1,900
            </span>
            <span className="text-xs sm:text-sm font-mono text-zinc-400 uppercase tracking-widest">
              / Unit · LKR
            </span>
          </div>

          {/* Clean Specification Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs text-zinc-300">
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              Athletic Honeycomb Mesh
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              Unisex XS — 3XL
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              HD Cyber Sublimation
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              Collect at Arena Desk
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full pt-2">
            <Link
              href="/tshirt"
              className="flex-1 py-4 px-8 bg-[#004491] hover:bg-[#003570] text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,68,145,0.45)] hover:shadow-[0_0_40px_rgba(0,68,145,0.7)] group uppercase tracking-wider text-center"
            >
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
              <span>Pre-Order Jersey — Rs. 1,900</span>
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/tshirt"
              className="py-4 px-6 border border-zinc-700 hover:border-zinc-500 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
            >
              <span className="material-symbols-outlined text-base text-[#00d2ff]">straighten</span>
              <span>Size Guide</span>
            </Link>
          </div>

          {/* Competing Teams Helper */}
          <p className="text-xs text-zinc-500">
            Competing teams: Order for your entire roster inside the{" "}
            <Link href="/login" className="text-[#00d2ff] hover:underline font-medium">
              Team Dashboard
            </Link>.
          </p>

        </div>

      </div>
    </section>
  );
}
