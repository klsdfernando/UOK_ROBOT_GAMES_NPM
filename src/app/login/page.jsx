"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center w-full">
        
        {/* Minimalist Premium Logos */}
        <div className="flex items-center justify-center gap-6 mb-10 w-full">
          <Image src="https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160" alt="UOK Robot Games" width={100} height={36} className="w-auto h-8 object-contain opacity-90" />
          <div className="w-[1px] h-6 bg-zinc-700"></div>
          <Image src="https://ik.imagekit.io/wfnazmyxh/images/UniLogo.svg?updatedAt=1777697834303" alt="UOK" width={70} height={36} className="w-auto h-8 object-contain opacity-80" />
          <div className="w-[1px] h-6 bg-zinc-700"></div>
          <Image src="https://ik.imagekit.io/wfnazmyxh/images/club_logo.png?updatedAt=1777698175245" alt="ECSC" width={70} height={36} className="w-auto h-8 object-contain opacity-80" />
        </div>

        {/* Premium Header */}
        <div className="w-full text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
            Welcome Back
          </h1>
          <p className="text-zinc-400 text-sm tracking-wide">
            Sign in to your team dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-5 px-4 py-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs tracking-wide text-center">
            {error}
          </div>
        )}

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div className="relative group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
              required
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline pr-12"
              required
              disabled={loading}
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

          {/* Forgot Password Link */}
          <div className="flex justify-end -mt-1">
            <Link
              href="/forgot-password"
              className="text-zinc-500 hover:text-[#00d2ff] text-xs tracking-wide transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Premium Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#004491] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-10 text-center w-full border-t border-white/5 pt-6">
          <p className="text-zinc-500 text-xs">
            New to the arena?{" "}
            <Link href="/register" className="text-white hover:text-[#00d2ff] font-bold transition-colors">
              Register Your Team
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
