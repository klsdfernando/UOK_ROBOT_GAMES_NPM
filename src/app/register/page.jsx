"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/login?registered=true");
      } else {
        setError(data.message || "Registration failed.");
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
            Join the Arena
          </h1>
          <p className="text-zinc-400 text-sm tracking-wide">
            Register your team for the games
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-5 px-4 py-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs tracking-wide text-center">
            {error}
          </div>
        )}

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          
          {/* Team Name Field */}
          <div className="relative group">
            <input
              type="text"
              name="teamName"
              placeholder="Team Name"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
              required
              disabled={loading}
            />
          </div>

          {/* Leader Name Field */}
          <div className="relative group">
            <input
              type="text"
              name="leaderName"
              placeholder="Team Leader Name"
              value={formData.leaderName}
              onChange={handleChange}
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
              required
              disabled={loading}
            />
          </div>

          {/* Leader Email Field */}
          <div className="relative group">
            <input
              type="email"
              name="leaderEmail"
              placeholder="Leader Email Address"
              value={formData.leaderEmail}
              onChange={handleChange}
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
              required
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
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

          {/* Confirm Password Field */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
              required
              disabled={loading}
            />
          </div>

          {/* Premium Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#004491] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
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
