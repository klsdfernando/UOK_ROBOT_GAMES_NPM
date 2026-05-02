"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const handleJoinClick = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) {
        router.push("/dashboard");
      } else {
        router.push("/register");
      }
    } catch {
      router.push("/register");
    } finally {
      setChecking(false);
    }
  };
  return (
    <section className="relative h-svh md:h-[819px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="/images/arena-battle.png"
          alt="Cinematic dark combat robot in arena"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-evenly md:justify-center">
        {/* Huge Background Text */}
        <div className="absolute inset-0 flex items-center justify-center select-none z-[1] pointer-events-none mt-12">
          <span className="text-[250px] md:text-[480px] font-black text-white/10 tracking-tighter leading-none">
            2K26
          </span>
        </div>

        {/* Foreground Content */}
        <div className="relative z-[2] text-center px-4 max-w-5xl mx-auto flex flex-col items-center justify-between h-[70%] md:h-auto md:justify-start mt-0 md:mt-12 pt-0 pb-8 md:pb-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#1a8bff]/60" />
            <p
              className="text-[#1a8bff] font-bold tracking-[0.3em] uppercase text-xs md:text-sm"
              style={{ textShadow: "0 0 10px rgba(26,139,255,0.3)" }}
            >
              GREATNESS SHOWS NO MERCY
            </p>
            <div className="h-[2px] w-12 bg-[#1a8bff]/60" />
          </div>

          <h1 className="flex flex-col items-center mb-2 md:mb-16">
            <span
              className="text-[#0055cc]/50 text-[120px] md:text-[180px] leading-none tracking-normal"
              style={{ fontFamily: "'Noxis', sans-serif", WebkitTextStroke: "3px #0055cc" }}
            >
              UOK
            </span>
            <span
              className="text-white text-[55px] md:text-[95px] leading-none tracking-[0.05em] uppercase -mt-2"
              style={{ fontFamily: "'Android Assassin', sans-serif" }}
            >
              ROBOT GAMES
            </span>
          </h1>

          {/* Mobile-only Logo Strip */}
          <div className="flex md:hidden items-center justify-around w-full px-6 mb-4">
            <Image
              src="/images/logo.png"
              alt="Robot Battles Logo"
              width={140}
              height={70}
              className="h-12 w-auto object-contain"
            />
            <div className="w-[1px] h-10 bg-white/20" />
            <Image
              src="/images/UniLogo.svg"
              alt="University of Kelaniya Logo"
              width={140}
              height={70}
              className="h-14 w-auto object-contain"
            />
            <div className="w-[1px] h-10 bg-white/20" />
            <Image
              src="/images/club_logo.png"
              alt="ECSC Club Logo"
              width={140}
              height={70}
              className="h-14 w-auto object-contain"
            />
          </div>

          <button
            onClick={handleJoinClick}
            disabled={checking}
            className="border border-[#1a8bff] rounded-full px-12 py-4 bg-[#1a8bff]/5 text-white font-bold text-sm tracking-[0.15em] hover:bg-[#1a8bff]/15 shadow-[0_0_20px_rgba(26,139,255,0.15)] hover:shadow-[0_0_30px_rgba(26,139,255,0.4)] transition-all uppercase disabled:opacity-50"
          >
            {checking ? "LOADING..." : "JOIN THE BATTLE"}
          </button>
        </div>
      </div>
    </section>
  );
}
