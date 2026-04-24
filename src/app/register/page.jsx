"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center w-full">
        
        {/* Minimalist Premium Logos */}
        <div className="flex items-center justify-center gap-6 mb-10 w-full">
          <Image src="/images/logo.png" alt="UOK Robot Games" width={100} height={36} className="w-auto h-8 object-contain opacity-90" />
          <div className="w-[1px] h-6 bg-zinc-700"></div>
          <Image src="/images/UniLogo.svg" alt="UOK" width={70} height={36} className="w-auto h-8 object-contain opacity-80" />
          <div className="w-[1px] h-6 bg-zinc-700"></div>
          <Image src="/images/club_logo.png" alt="ECSC" width={70} height={36} className="w-auto h-8 object-contain opacity-80" />
        </div>

        {/* Premium Header */}
        <div className="w-full text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
            Join the Arena
          </h1>
          <p className="text-zinc-400 text-sm tracking-wide">
            Register your team for the games
          </p>
        </div>

        <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          {/* Full Name Field */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline pr-12"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-600 hover:text-[#00d2ff] transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          {/* Premium Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-[#004491] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)] transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-10 text-center w-full border-t border-white/5 pt-6">
          <p className="text-zinc-500 text-xs">
            Already have clearance?{" "}
            <Link href="/login" className="text-white hover:text-[#00d2ff] font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
