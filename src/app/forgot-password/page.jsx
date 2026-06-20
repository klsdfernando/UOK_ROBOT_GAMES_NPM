"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import RegistrationLockScreen from "@/components/RegistrationLockScreen";
import { useRegistrationConfig } from "@/hooks/useRegistrationConfig";

export default function ForgotPasswordPage() {
  const { isBeforeOpenDate, loading: configLoading } = useRegistrationConfig();
  const router = useRouter();

  // Steps: 1 = email, 2 = verify code, 3 = new password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1: Send verification code ──
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-code", email }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Verification code sent! Check your email inbox.");
        setStep(2);
      } else {
        setError(data.message || "Failed to send code.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify code ──
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-code", email, code }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Code verified! Set your new password.");
        setStep(3);
      } else {
        setError(data.message || "Invalid code.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-password", email, code, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step titles & descriptions
  const stepInfo = {
    1: { title: "Reset Password", subtitle: "Enter your email to receive a verification code" },
    2: { title: "Verify Code", subtitle: "Enter the 6-digit code sent to your email" },
    3: { title: "New Password", subtitle: "Create a strong new password for your team" },
  };

  // Guard: before opening date, show lock screen
  if (configLoading) return <div className="min-h-screen bg-black" />;
  if (isBeforeOpenDate) return <RegistrationLockScreen />;

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

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 w-full">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold tracking-wider transition-all duration-300 ${
                  step === s
                    ? "bg-[#004491] text-white shadow-[0_0_12px_rgba(0,68,145,0.5)]"
                    : step > s
                    ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30"
                    : "bg-[#0b0c16] text-zinc-600 border border-outline-variant"
                }`}
              >
                {step > s ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  s
                )}
              </div>
              {s < 3 && (
                <div
                  className={`w-8 h-[2px] transition-all duration-300 ${
                    step > s ? "bg-emerald-500/40" : "bg-outline-variant"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
            {stepInfo[step].title}
          </h1>
          <p className="text-zinc-400 text-sm tracking-wide">
            {stepInfo[step].subtitle}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="w-full mb-5 px-4 py-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs tracking-wide text-center">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full mb-5 px-4 py-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs tracking-wide text-center">
            {error}
          </div>
        )}

        {/* ═══════════════ STEP 1: Email ═══════════════ */}
        {step === 1 && (
          <form className="w-full space-y-5" onSubmit={handleSendCode}>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 text-lg">
                mail
              </span>
              <input
                id="forgot-email"
                type="email"
                placeholder="Leader Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm pl-12 pr-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#004491] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Sending Code...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        )}

        {/* ═══════════════ STEP 2: Verify Code ═══════════════ */}
        {step === 2 && (
          <form className="w-full space-y-5" onSubmit={handleVerifyCode}>
            {/* Email display */}
            <div className="w-full px-4 py-3 bg-[#0b0c16] border border-outline-variant text-zinc-500 text-xs tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#004491]">mail</span>
              Code sent to: <span className="text-zinc-300 font-semibold">{email}</span>
            </div>

            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 text-lg">
                pin
              </span>
              <input
                id="forgot-code"
                type="text"
                placeholder="6-Digit Verification Code"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(val);
                }}
                className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm pl-12 pr-4 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline tracking-[0.5em] text-center font-bold text-lg"
                required
                disabled={loading}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-4 bg-[#004491] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setCode("");
                setError("");
                setSuccess("");
              }}
              className="w-full py-3 text-zinc-500 hover:text-[#00d2ff] text-xs tracking-widest uppercase font-bold transition-colors"
            >
              ← Use a different email
            </button>
          </form>
        )}

        {/* ═══════════════ STEP 3: New Password ═══════════════ */}
        {step === 3 && (
          <form className="w-full space-y-5" onSubmit={handleResetPassword}>
            {/* New Password */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 text-lg">
                lock
              </span>
              <input
                id="forgot-new-password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm pl-12 pr-12 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
                required
                disabled={loading}
                minLength={6}
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

            {/* Confirm Password */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 text-lg">
                lock_reset
              </span>
              <input
                id="forgot-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm pl-12 pr-12 py-4 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-600 hover:text-[#00d2ff] transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="material-symbols-outlined text-lg">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            {/* Password match indicator */}
            {confirmPassword && (
              <div className={`text-xs tracking-wide flex items-center gap-1 ${
                newPassword === confirmPassword ? "text-emerald-400" : "text-red-400"
              }`}>
                <span className="material-symbols-outlined text-sm">
                  {newPassword === confirmPassword ? "check_circle" : "cancel"}
                </span>
                {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
              className="w-full py-4 bg-[#004491] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-10 text-center w-full border-t border-white/5 pt-6">
          <p className="text-zinc-500 text-xs">
            Remember your password?{" "}
            <Link href="/login" className="text-white hover:text-[#00d2ff] font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
