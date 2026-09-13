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
    <section className="relative min-h-svh flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="https://ik.imagekit.io/wfnazmyxh/images/arena-battle.png?updatedAt=1777697842835"
          alt="Cinematic dark combat robot in arena"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center py-24">
        {/* Huge Background Text */}
        <div className="absolute inset-0 flex items-center justify-center select-none z-[1] pointer-events-none mt-12">
          <span className="text-[250px] md:text-[480px] font-black text-white/10 tracking-tighter leading-none">
            2K26
          </span>
        </div>

        {/* Foreground Content */}
        <div className="relative z-[2] text-center px-4 max-w-5xl mx-auto flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-[#1a8bff]/60" />
            <p
              className="text-[#1a8bff] font-bold tracking-[0.3em] uppercase text-xs md:text-sm"
              style={{ textShadow: "0 0 10px rgba(26,139,255,0.3)" }}
            >
              GREATNESS SHOWS NO MERCY
            </p>
            <div className="h-[2px] w-12 bg-[#1a8bff]/60" />
          </div>

          <h1 className="flex flex-col items-center">
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

          {/* Collaborations */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500">
              In Association With
            </span>
            <div className="flex items-stretch gap-4 sm:gap-5 w-full max-w-[720px] justify-center flex-wrap sm:flex-nowrap">
              <div className="bg-white rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg flex-1 min-w-[140px] max-w-[220px] flex items-center justify-center">
                <Image
                  src="https://ik.imagekit.io/wfnazmyxh/New%20Folder/WhatsApp%20Image%202026-05-16%20at%202.44.03%20PM.jpeg"
                  alt="Collaboration Partner 1"
                  width={200}
                  height={80}
                  className="w-full h-auto object-contain max-h-16 sm:max-h-20"
                />
              </div>
              <div className="bg-white rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg flex-1 min-w-[140px] max-w-[220px] flex items-center justify-center">
                <Image
                  src="https://ik.imagekit.io/wfnazmyxh/New%20Folder/WhatsApp%20Image%202026-06-09%20at%203.26.17%20PM.jpeg"
                  alt="Collaboration Partner 2"
                  width={200}
                  height={80}
                  className="w-full h-auto object-contain max-h-16 sm:max-h-20"
                />
              </div>
              <div className="bg-white rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg flex-1 min-w-[140px] max-w-[220px] flex items-center justify-center">
                <Image
                  src="https://ik.imagekit.io/wfnazmyxh/New%20Folder/WhatsApp%20Image%202026-09-10%20at%202.23.43%20PM.jpeg"
                  alt="Collaboration Partner 3"
                  width={200}
                  height={80}
                  className="w-full h-auto object-contain max-h-16 sm:max-h-20"
                />
              </div>
            </div>
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
