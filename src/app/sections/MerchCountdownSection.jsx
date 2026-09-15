"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const MERCH_ASSETS = {
  front: {
    src: "https://ik.imagekit.io/wfnazmyxh/Posts/front.png",
    alt: "Official UOK Robot Games 2K26 Jersey — Front Crest View",
    title: "Tournament Front Crest",
    sub: "Official ECSC Crest & Hex Pattern",
  },
  back: {
    src: "https://ik.imagekit.io/wfnazmyxh/Posts/back.png",
    alt: "Official UOK Robot Games 2K26 Jersey — Back Arena Graphics View",
    title: "Arena Cyber Back",
    sub: "High-Density Typography & Graphics",
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
      {/* Editorial typographic watermark background */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden opacity-[0.03]">
        <span className="text-[180px] sm:text-[320px] lg:text-[440px] font-black tracking-tighter uppercase whitespace-nowrap text-white">
          ARMOR 2K26
        </span>
      </div>

      {/* Atmospheric lighting glows — natural, organic stage ambiance */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#004491]/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-[#00d2ff]/12 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#00d2ff]" />
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.28em] text-[#00d2ff] uppercase font-mono">
                {"OFFICIAL MERCHANDISE DROP // 2K26"}
              </p>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05]">
              The Official Merch 2K26
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#529dff] to-[#004491]">
                Now Available For Pre-Order
              </span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end text-left md:text-right">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Pre-Order Deadline
            </span>
            <span className="text-lg sm:text-xl font-bold text-white tracking-wide mt-1">
              September 18, 2026
            </span>
            <span className="text-xs text-rose-400 font-medium mt-0.5 flex items-center md:justify-end gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              Limited single-batch event production
            </span>
          </div>
        </div>

        {/* Main Content: Showcase + Editorial Countdown Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 items-center">
          
          {/* ════════════════════════════════════════════════════════════════
              LEFT: Fluid Apparel Showcase (No Boxes, Pure Studio Feel)
             ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Minimal View Switcher: Pure typographic tabs */}
            <div className="flex items-center gap-6 sm:gap-8 mb-8 text-xs font-mono tracking-widest uppercase">
              <button
                type="button"
                onClick={() => setActiveView("both")}
                className={`pb-2 border-b-2 transition-all cursor-pointer ${
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
                className={`pb-2 border-b-2 transition-all cursor-pointer ${
                  activeView === "front"
                    ? "text-[#00d2ff] border-[#00d2ff] font-bold"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                Front View
              </button>
              <button
                type="button"
                onClick={() => setActiveView("back")}
                className={`pb-2 border-b-2 transition-all cursor-pointer ${
                  activeView === "back"
                    ? "text-[#00d2ff] border-[#00d2ff] font-bold"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                Back View
              </button>
            </div>

            {/* Stage: Seamless, dark floor lighting with natural shadows */}
            <div className="relative w-full flex items-center justify-center min-h-[380px] sm:min-h-[480px]">
              
              {/* Floor ambient reflection spotlight */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-r from-transparent via-[#00d2ff]/25 to-transparent blur-2xl rounded-full pointer-events-none" />

              {/* DUAL VIEW */}
              {activeView === "both" && (
                <div className="grid grid-cols-2 gap-3 sm:gap-8 w-full max-w-2xl items-end transition-opacity duration-300">
                  <div
                    onClick={() => setActiveView("front")}
                    className="group cursor-pointer flex flex-col items-center"
                    title="Click to zoom Front View"
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
                    <div className="mt-4 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                        Front Crest
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono block">
                        Sublimated ECSC Crest
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveView("back")}
                    className="group cursor-pointer flex flex-col items-center"
                    title="Click to zoom Back View"
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
                    <div className="mt-4 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                        Back Cyber
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono block">
                        Arena Graphic Print
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SINGLE FRONT VIEW */}
              {activeView === "front" && (
                <div className="flex flex-col items-center max-w-md w-full transition-opacity duration-300">
                  <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                    <Image
                      src={MERCH_ASSETS.front.src}
                      alt={MERCH_ASSETS.front.alt}
                      width={700}
                      height={875}
                      priority
                      className="max-h-[420px] sm:max-h-[520px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-white block">
                      {MERCH_ASSETS.front.title}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono block mt-0.5">
                      {MERCH_ASSETS.front.sub}
                    </span>
                  </div>
                </div>
              )}

              {/* SINGLE BACK VIEW */}
              {activeView === "back" && (
                <div className="flex flex-col items-center max-w-md w-full transition-opacity duration-300">
                  <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                    <Image
                      src={MERCH_ASSETS.back.src}
                      alt={MERCH_ASSETS.back.alt}
                      width={700}
                      height={875}
                      priority
                      className="max-h-[420px] sm:max-h-[520px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-white block">
                      {MERCH_ASSETS.back.title}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono block mt-0.5">
                      {MERCH_ASSETS.back.sub}
                    </span>
                  </div>
                </div>
              )}

            </div>

            <p className="text-[11px] text-zinc-500 font-mono tracking-wide mt-6 text-center">
              * Official Tournament Apparel · 100% Breathable Athletic Honeycomb Fabric
            </p>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT: Editorial Countdown, Specs & CTA
             ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            
            {/* Story & Description */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#00d2ff] uppercase block">
                {"// COMPETITOR & SUPPORTER EDITION"}
              </span>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Step into the tournament arena with the official UOK Robot Games 2K26 jersey. Crafted with athletic honeycomb mesh for maximum comfort, thermal regulation, and durability under battle pressure.
              </p>
            </div>

            {/* Countdown Block: Clean, Bold, Human-Crafted Typography (No Boxes) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-[0.2em] text-zinc-400">
                  Pre-Orders Lock In
                </span>
                <span className="font-mono text-[11px] text-[#00d2ff]">
                  TARGET: SEPT 18 · 23:59 IST
                </span>
              </div>

              {/* Bold Fluid Countdown Numbers */}
              <div className="flex items-baseline gap-2 sm:gap-4 select-none">
                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
                    {formatUnit(timeLeft.days)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mt-1.5 font-mono">
                    DAYS
                  </span>
                </div>

                <span className="text-2xl sm:text-4xl font-light text-zinc-600 self-start leading-none pt-1">:</span>

                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
                    {formatUnit(timeLeft.hours)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mt-1.5 font-mono">
                    HOURS
                  </span>
                </div>

                <span className="text-2xl sm:text-4xl font-light text-zinc-600 self-start leading-none pt-1">:</span>

                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
                    {formatUnit(timeLeft.minutes)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mt-1.5 font-mono">
                    MINS
                  </span>
                </div>

                <span className="text-2xl sm:text-4xl font-light text-zinc-600 self-start leading-none pt-1">:</span>

                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-[#00d2ff] leading-none drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]">
                    {formatUnit(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#00d2ff]/80 uppercase mt-1.5 font-mono">
                    SECS
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Specifications (Clean Spec Strip, No Generic Checkmarks) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-5 border-y border-white/[0.08] text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
                  Material
                </span>
                <span className="text-zinc-200 font-semibold mt-0.5 block">
                  Athletic Honeycomb Mesh
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
                  Print Technology
                </span>
                <span className="text-zinc-200 font-semibold mt-0.5 block">
                  Permanent HD Cyber Sublimation
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
                  Sizing Spectrum
                </span>
                <span className="text-zinc-200 font-semibold mt-0.5 block">
                  Standard Unisex XS — 3XL
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
                  Pickup Location
                </span>
                <span className="text-zinc-200 font-semibold mt-0.5 block">
                  Arena Registration Desk
                </span>
              </div>
            </div>

            {/* Price & Action Button Area */}
            <div className="space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 block">
                    Tournament Pre-Order Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                      Rs. 1,900
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      / unit (LKR)
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded border border-[#00d2ff]/40 bg-[#00d2ff]/10 text-[#00d2ff] text-[11px] font-mono font-bold uppercase tracking-wider">
                  Official Release
                </span>
              </div>

              {/* Action Buttons */}
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

              <p className="text-[11px] text-zinc-500 font-mono">
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
