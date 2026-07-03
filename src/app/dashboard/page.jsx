"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/* ─── Sidebar Nav Items ─── */
const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "team", label: "Team Details", icon: "group" },
];

/* ─── Dashboard Overview Section ─── */
function DashboardSection({ team }) {
  const phases = team.phases || {};
  const completedCount = Object.values(phases).filter(p => p?.completed).length;
  const totalPhases = Object.keys(phases).length || 5;
  const progressPercent = Math.round((completedCount / totalPhases) * 100);

  // Extract event info from phase 1
  const phase1Data = phases['1']?.data || null;
  const eventName = phase1Data?.eventSelection || null;
  const categoryName = phase1Data?.categorySelection || null;

  // Extract member info from phase 2
  const phase2Data = phases['2']?.data || null;
  const memberCount = phase2Data?.memberCount || 1;

  // Extract org info from phase 3
  const phase3Data = phases['3']?.data || null;
  const orgName = phase3Data?.orgName || null;

  // SVG progress ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <>
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/[0.06]">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004491]/20 via-[#080808] to-[#080808]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#004491]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00d2ff]/5 rounded-full blur-[80px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#004491] to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left: Welcome text */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#004491]/15 flex items-center justify-center border border-[#004491]/20">
                <span className="material-symbols-outlined text-[#5b9aff] text-xl">waving_hand</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5b9aff]">Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Welcome back, <span className="text-[#5b9aff]">{team.leaderName?.split(' ')[0]}</span>
            </h1>
            <p className="text-zinc-500 text-sm max-w-md">
              Track your registration progress, manage your team, and get ready for UOK Robot Games 2K26.
            </p>

            {/* Quick badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Registered
              </span>
              {eventName && (
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 bg-[#004491]/15 text-[#5b9aff] border border-[#004491]/30 rounded-full">
                  <span className="material-symbols-outlined text-[12px]">{eventName === 'Robot Battles' ? 'smart_toy' : 'directions_car'}</span>
                  {eventName}
                </span>
              )}
              {categoryName && (
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 bg-white/[0.04] text-zinc-400 border border-white/[0.08] rounded-full">
                  {categoryName}
                </span>
              )}
            </div>
          </div>

          {/* Right: Segmented Progress Ring */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#004491" />
                    <stop offset="100%" stopColor="#00d2ff" />
                  </linearGradient>
                  {/* Mask to create 5 discrete flat segments */}
                  <mask id="segmentMask">
                    <circle
                      cx="60" cy="60" r={radius}
                      fill="none" stroke="white" strokeWidth="8"
                      strokeLinecap="butt"
                      strokeDasharray={`${(circumference / 5) - 6} 6`}
                      strokeDashoffset={-3}
                    />
                  </mask>
                </defs>
                
                {/* Background segments */}
                <circle
                  cx="60" cy="60" r={radius}
                  fill="none" stroke="#1a1a2e" strokeWidth="8"
                  mask="url(#segmentMask)"
                />
                
                {/* Animated continuous gradient progress */}
                <circle
                  cx="60" cy="60" r={radius}
                  fill="none" stroke="url(#progressGrad)" strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  mask="url(#segmentMask)"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{completedCount}</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">of {totalPhases}</span>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-center">Phases Complete</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Team Card */}
        <div className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 group hover:border-[#004491]/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491] opacity-60" />
          <div className="w-9 h-9 rounded-lg bg-[#004491]/10 flex items-center justify-center mb-3 border border-[#004491]/15">
            <span className="material-symbols-outlined text-[#5b9aff] text-lg">groups</span>
          </div>
          <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1">Team</p>
          <p className="text-white text-sm font-bold truncate">{team.teamName}</p>
        </div>

        {/* Members Card */}
        <div className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 group hover:border-[#00d2ff]/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00d2ff] opacity-60" />
          <div className="w-9 h-9 rounded-lg bg-[#00d2ff]/10 flex items-center justify-center mb-3 border border-[#00d2ff]/15">
            <span className="material-symbols-outlined text-[#00d2ff] text-lg">person</span>
          </div>
          <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1">Members</p>
          <p className="text-white text-sm font-bold">{memberCount} {memberCount === 1 ? 'Member' : 'Members'}</p>
        </div>

        {/* Organization Card */}
        <div className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 group hover:border-emerald-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500 opacity-60" />
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 border border-emerald-500/15">
            <span className="material-symbols-outlined text-emerald-400 text-lg">apartment</span>
          </div>
          <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1">Organization</p>
          <p className="text-white text-sm font-bold truncate">{orgName || '—'}</p>
        </div>

        {/* Registered Since */}
        <div className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 group hover:border-amber-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500 opacity-60" />
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 border border-amber-500/15">
            <span className="material-symbols-outlined text-amber-400 text-lg">calendar_today</span>
          </div>
          <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1">Registered</p>
          <p className="text-white text-sm font-bold">
            {new Date(team.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   PHASE SYSTEM — Dynamic, Firestore-driven progression
   ════════════════════════════════════════════════════════════ */

/* Phase metadata (static — status comes from Firestore) */
const PHASE_META = [
  { id: 1, title: "Event Details",   icon: "calendar_month", accent: "#004491" },
  { id: 2, title: "Members Details", icon: "groups",         accent: "#00d2ff" },
  { id: 3, title: "Organization Details", icon: "apartment", accent: "#10b981" },
  { id: 4, title: "Payment Slip",    icon: "receipt_long",   accent: "#004491" },
  { id: 5, title: "WhatsApp Group",   icon: "forum",          accent: "#004491" },
  { id: 6, title: "Phase 6",          icon: "hourglass_top",  accent: "#a855f7" },
];

/** Compute display status from Firestore phase data */
function getPhaseStatus(phaseData) {
  if (!phaseData) return "locked";
  if (phaseData.completed) return "completed";
  if (phaseData.devLocked && !phaseData.unlockedAt) return "dev-locked";
  if (phaseData.unlockedAt) return "unlocked";
  return "locked";
}

/* ─── Single Phase Step Node ─── */
function PhaseNode({ phase, isLast, onComplete, completing }) {
  const status = phase.displayStatus;
  const isOpen = status === "unlocked" || status === "completed";

  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Step Indicator Column */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
            status === "completed"
              ? "border-emerald-500 bg-emerald-500/10"
              : status === "unlocked"
                ? "border-[var(--accent)] bg-[var(--accent)]/10"
                : "border-zinc-800 bg-zinc-900/50"
          }`}
          style={{ "--accent": phase.accent }}
        >
          {status === "completed" ? (
            <span className="material-symbols-outlined text-emerald-400 text-lg sm:text-xl">check</span>
          ) : (
            <span
              className={`material-symbols-outlined text-lg sm:text-xl ${isOpen ? "" : "text-zinc-700"}`}
              style={isOpen ? { color: phase.accent } : undefined}
            >
              {(status === "dev-locked" || status === "locked") ? "lock" : phase.icon}
            </span>
          )}
        </div>
        {!isLast && (
          <div className={`w-[2px] flex-1 min-h-[24px] ${
            status === "completed" ? "bg-emerald-500/30" : isOpen ? "bg-zinc-700/60" : "bg-zinc-800/40"
          }`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        {/* Phase Header */}
        <div className="flex items-center gap-3 mb-1 mt-2 sm:mt-2.5 flex-wrap">
          <span className={`text-[10px] uppercase tracking-widest font-bold ${isOpen ? "text-zinc-500" : "text-zinc-700"}`}>
            Phase {phase.id}
          </span>
          {status === "completed" && (
            <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ✓ Completed
            </span>
          )}
          {status === "unlocked" && (
            <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#004491]/10 text-[#5b9aff] border border-[#004491]/30">
              Active
            </span>
          )}
          {status === "locked" && (
            <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-zinc-800/50 text-zinc-600 border border-zinc-800">
              Locked
            </span>
          )}
          {status === "dev-locked" && (
            <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500/70 border border-amber-500/20">
              Coming Soon
            </span>
          )}
        </div>
        <h3 className={`text-sm sm:text-base font-black uppercase tracking-widest mb-3 ${
          status === "completed" ? "text-zinc-400" : isOpen ? "text-white" : "text-zinc-700"
        }`}>
          {phase.title}
        </h3>

        {/* Phase Body */}
        {isOpen && phase.content}

        {/* Complete button — only for unlocked (not completed) */}
        {status === "unlocked" && onComplete && !phase.hasCustomSubmit && (
          <button
            onClick={() => onComplete(phase.id)}
            disabled={completing}
            className="mt-4 px-5 py-2.5 bg-[#004491] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.3)] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {completing ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Complete Phase {phase.id}
              </>
            )}
          </button>
        )}

        {/* Locked: needs previous phase */}
        {status === "locked" && (
          <div className="relative bg-[#080808] border border-zinc-800/60 p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <span className="material-symbols-outlined text-zinc-800 text-4xl mb-3">lock</span>
              <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">Complete Phase {phase.id - 1} First</p>
              <p className="text-zinc-700 text-[10px] mt-1">This phase unlocks after the previous one is completed.</p>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)" }} />
          </div>
        )}

        {/* Dev-locked: organizers must unlock */}
        {status === "dev-locked" && (
          <div className="relative bg-[#080808] border border-amber-500/10 p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <span className="material-symbols-outlined text-amber-500/30 text-4xl mb-3">schedule</span>
              <p className="text-amber-500/50 text-xs uppercase tracking-widest font-bold">Coming Soon</p>
              <p className="text-zinc-700 text-[10px] mt-1">This phase will be unlocked by the organizers.</p>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Phase 1: Event Details with Selection ─── */
function Phase1EventDetails({ team, phaseData, displayStatus, accent, onComplete, completing }) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const savedData = phaseData?.data || null;
  const isCompleted = displayStatus === "completed";

  // If completed, show the saved read-only summary
  if (isCompleted && savedData) {
    return (
      <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#10b981' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Event</p>
            <p className="text-zinc-200 text-sm font-semibold">UOK Robot Games 2K26</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Team Name</p>
            <p className="text-zinc-200 text-sm font-semibold">{team.teamName}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Selected Event</p>
            <p className="text-[#00d2ff] text-sm font-bold">{savedData.eventSelection}</p>
          </div>
          {savedData.categorySelection && (
            <div>
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Category</p>
              <p className="text-[#00d2ff] text-sm font-bold">{savedData.categorySelection}</p>
            </div>
          )}
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Leader</p>
            <p className="text-zinc-200 text-sm font-semibold">{team.leaderName}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Contact Email</p>
            <p className="text-zinc-200 text-sm font-semibold">{team.leaderEmail}</p>
          </div>
        </div>
      </div>
    );
  }

  // Active / unlocked — show selection form
  const canSubmit = (selectedEvent === "Robot Battles" || selectedEvent === "Robot Race") && selectedCategory;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const data = {
      eventSelection: selectedEvent,
      categorySelection: selectedCategory,
    };
    onComplete(1, data);
  };

  return (
    <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />

      {/* Team info row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Team Name</p>
          <p className="text-zinc-200 text-sm font-semibold">{team.teamName}</p>
        </div>
        <div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Leader</p>
          <p className="text-zinc-200 text-sm font-semibold">{team.leaderName} · {team.leaderEmail}</p>
        </div>
      </div>

      {/* IMPORTANT RULE */}
      <div className="mb-6 bg-red-950/30 border border-red-500/30 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500" />
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500 text-xl shrink-0 mt-0.5">warning</span>
          <p className="text-red-200/80 text-xs leading-relaxed">
            A team may participate in either <strong className="text-white">Robot Battle</strong> or <strong className="text-white">Robot Race</strong>, but <strong className="text-red-400">not both</strong>. Each participant may only belong to <strong className="text-red-400">one team</strong>. Failure to comply will result in <strong className="text-red-400">disqualification</strong>.
          </p>
        </div>
      </div>

      {/* Event Selection */}
      <div className="mb-2">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-4">Select Your Event</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Robot Battles */}
          <button
            type="button"
            onClick={() => { setSelectedEvent("Robot Battles"); setSelectedCategory(""); }}
            className={`relative text-left p-4 border transition-all duration-200 group ${
              selectedEvent === "Robot Battles"
                ? "bg-[#004491]/10 border-[#004491] shadow-[0_0_15px_rgba(0,68,145,0.15)]"
                : "bg-[#0b0c16] border-outline-variant hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className={`material-symbols-outlined text-xl ${selectedEvent === "Robot Battles" ? "text-[#004491]" : "text-zinc-600"}`}>
                smart_toy
              </span>
              <span className={`text-sm font-black uppercase tracking-widest ${selectedEvent === "Robot Battles" ? "text-white" : "text-zinc-400"}`}>
                Robot Battles
              </span>
            </div>
            <p className="text-zinc-600 text-[10px] ml-9">Head-to-head combat arena</p>
            {selectedEvent === "Robot Battles" && (
              <div className="absolute top-3 right-3">
                <span className="material-symbols-outlined text-[#004491] text-lg">radio_button_checked</span>
              </div>
            )}
            {selectedEvent !== "Robot Battles" && (
              <div className="absolute top-3 right-3">
                <span className="material-symbols-outlined text-zinc-700 text-lg">radio_button_unchecked</span>
              </div>
            )}
          </button>

          {/* Option 2: Robot Race */}
          <button
            type="button"
            onClick={() => { setSelectedEvent("Robot Race"); setSelectedCategory(""); }}
            className={`relative text-left p-4 border transition-all duration-200 group ${
              selectedEvent === "Robot Race"
                ? "bg-[#004491]/10 border-[#004491] shadow-[0_0_15px_rgba(0,68,145,0.15)]"
                : "bg-[#0b0c16] border-outline-variant hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className={`material-symbols-outlined text-xl ${selectedEvent === "Robot Race" ? "text-[#004491]" : "text-zinc-600"}`}>
                directions_car
              </span>
              <span className={`text-sm font-black uppercase tracking-widest ${selectedEvent === "Robot Race" ? "text-white" : "text-zinc-400"}`}>
                Robot Race
              </span>
            </div>
            <p className="text-zinc-600 text-[10px] ml-9">Speed circuit challenge</p>
            {selectedEvent === "Robot Race" && (
              <div className="absolute top-3 right-3">
                <span className="material-symbols-outlined text-[#004491] text-lg">radio_button_checked</span>
              </div>
            )}
            {selectedEvent !== "Robot Race" && (
              <div className="absolute top-3 right-3">
                <span className="material-symbols-outlined text-zinc-700 text-lg">radio_button_unchecked</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Sub-category for Robot Battles */}
      {selectedEvent === "Robot Battles" && (
        <div className="mt-5 mb-2">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-4">Select Weight Category</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Heavy Weight */}
            <button
              type="button"
              onClick={() => setSelectedCategory("Heavy Weight")}
              className={`relative text-left p-4 border transition-all duration-200 ${
                selectedCategory === "Heavy Weight"
                  ? "bg-[#00d2ff]/5 border-[#00d2ff]/50 shadow-[0_0_15px_rgba(0,210,255,0.1)]"
                  : "bg-[#0b0c16] border-outline-variant hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${selectedCategory === "Heavy Weight" ? "text-[#00d2ff]" : "text-zinc-600"}`}>
                  fitness_center
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest ${selectedCategory === "Heavy Weight" ? "text-white" : "text-zinc-400"}`}>
                  Heavy Weight
                </span>
              </div>
              <p className="text-zinc-600 text-[10px] ml-9 mt-1">Registration fee: Rs. 1,500</p>
              <div className="absolute top-3 right-3">
                <span className={`material-symbols-outlined text-lg ${selectedCategory === "Heavy Weight" ? "text-[#00d2ff]" : "text-zinc-700"}`}>
                  {selectedCategory === "Heavy Weight" ? "radio_button_checked" : "radio_button_unchecked"}
                </span>
              </div>
            </button>

            {/* Light Weight */}
            <button
              type="button"
              onClick={() => setSelectedCategory("Light Weight")}
              className={`relative text-left p-4 border transition-all duration-200 ${
                selectedCategory === "Light Weight"
                  ? "bg-[#00d2ff]/5 border-[#00d2ff]/50 shadow-[0_0_15px_rgba(0,210,255,0.1)]"
                  : "bg-[#0b0c16] border-outline-variant hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${selectedCategory === "Light Weight" ? "text-[#00d2ff]" : "text-zinc-600"}`}>
                  speed
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest ${selectedCategory === "Light Weight" ? "text-white" : "text-zinc-400"}`}>
                  Light Weight
                </span>
              </div>
              <p className="text-zinc-600 text-[10px] ml-9 mt-1">Registration fee: Rs. 1,000</p>
              <div className="absolute top-3 right-3">
                <span className={`material-symbols-outlined text-lg ${selectedCategory === "Light Weight" ? "text-[#00d2ff]" : "text-zinc-700"}`}>
                  {selectedCategory === "Light Weight" ? "radio_button_checked" : "radio_button_unchecked"}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Sub-category for Robot Race */}
      {selectedEvent === "Robot Race" && (
        <div className="mt-5 mb-2">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-4">Select Race Category</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* University Category */}
            <button
              type="button"
              onClick={() => setSelectedCategory("University Category")}
              className={`relative text-left p-4 border transition-all duration-200 ${
                selectedCategory === "University Category"
                  ? "bg-[#00d2ff]/5 border-[#00d2ff]/50 shadow-[0_0_15px_rgba(0,210,255,0.1)]"
                  : "bg-[#0b0c16] border-outline-variant hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${selectedCategory === "University Category" ? "text-[#00d2ff]" : "text-zinc-600"}`}>
                  account_balance
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest ${selectedCategory === "University Category" ? "text-white" : "text-zinc-400"}`}>
                  University Category
                </span>
              </div>
              <p className="text-zinc-600 text-[10px] ml-9 mt-1">Registration fee: Rs. 1,000</p>
              <div className="absolute top-3 right-3">
                <span className={`material-symbols-outlined text-lg ${selectedCategory === "University Category" ? "text-[#00d2ff]" : "text-zinc-700"}`}>
                  {selectedCategory === "University Category" ? "radio_button_checked" : "radio_button_unchecked"}
                </span>
              </div>
            </button>

            {/* School Category */}
            <button
              type="button"
              onClick={() => setSelectedCategory("School Category")}
              className={`relative text-left p-4 border transition-all duration-200 ${
                selectedCategory === "School Category"
                  ? "bg-emerald-500/5 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-[#0b0c16] border-outline-variant hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${selectedCategory === "School Category" ? "text-emerald-400" : "text-zinc-600"}`}>
                  school
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest ${selectedCategory === "School Category" ? "text-white" : "text-zinc-400"}`}>
                  School Category
                </span>
              </div>
              <p className={`text-[10px] ml-9 mt-1 ${selectedCategory === "School Category" ? "text-emerald-400" : "text-zinc-600"}`}>Registration fee: Rs. 500</p>
              <div className="absolute top-3 right-3">
                <span className={`material-symbols-outlined text-lg ${selectedCategory === "School Category" ? "text-emerald-400" : "text-zinc-700"}`}>
                  {selectedCategory === "School Category" ? "radio_button_checked" : "radio_button_unchecked"}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || completing}
        className="mt-6 px-5 py-2.5 bg-[#004491] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.3)] transition-all duration-300 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {completing ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Confirm Event Selection
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Phase 2: Members Details ─── */
function Phase2MembersDetails({ team, phaseData, displayStatus, accent, onComplete, completing }) {
  const [memberCount, setMemberCount] = useState(1);
  const [members, setMembers] = useState([{ fullName: team.leaderName || "", contactNumber: "" }]);

  const savedData = phaseData?.data || null;
  const isCompleted = displayStatus === "completed";

  // Completed — read-only roster
  if (isCompleted && savedData) {
    return (
      <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#10b981' }} />

        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-5">
          Team Roster · {savedData.memberCount} {savedData.memberCount === 1 ? "Member" : "Members"}
        </p>

        <div className="space-y-3">
          {savedData.members.map((m, i) => (
            <div key={i} className="flex items-center gap-4 bg-[#0b0c16] border border-outline-variant p-4">
              <div className="w-8 h-8 rounded-full bg-[#004491]/15 flex items-center justify-center shrink-0">
                <span className="text-[#004491] text-xs font-black">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-200 text-sm font-semibold truncate">{m.fullName}</p>
                <p className="text-zinc-500 text-xs">{m.contactNumber}</p>
              </div>
              {i === 0 ? (
                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#004491]/10 text-[#5b9aff] border border-[#004491]/30 shrink-0 rounded-md">
                  Leader
                </span>
              ) : (
                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-white/[0.04] text-zinc-400 border border-white/[0.08] shrink-0 rounded-md">
                  Member
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active — form
  const handleCountChange = (count) => {
    const c = Number(count);
    setMemberCount(c);
    // Build array: index 0 = leader (pre-filled), rest = empty
    const arr = [];
    for (let i = 0; i < c; i++) {
      if (i === 0) {
        arr.push({ fullName: team.leaderName, contactNumber: "" });
      } else {
        arr.push({ fullName: "", contactNumber: "" });
      }
    }
    setMembers(arr);
  };

  const updateMember = (index, field, value) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Validate: all members must have name and contact
  const allFilled = members.length > 0 && members.every((m) => m.fullName.trim() && m.contactNumber.trim());

  const handleSubmit = () => {
    if (!allFilled) return;
    onComplete(2, { memberCount, members });
  };

  return (
    <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />

      {/* Dropdown */}
      <div className="mb-6">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-3">Number of Team Members (Including Leader)</p>
        <div className="relative w-full sm:w-64">
          <select
            value={memberCount}
            onChange={(e) => handleCountChange(e.target.value)}
            className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 appearance-none focus:outline-none focus:border-[#004491] transition-colors cursor-pointer"
          >
            <option value={1}>1 Member</option>
            <option value={2}>2 Members</option>
            <option value={3}>3 Members</option>
            <option value={4}>4 Members</option>
            <option value={5}>5 Members</option>
          </select>
          <span className="material-symbols-outlined text-zinc-600 text-lg absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Member cards */}
      {members.length > 0 && (
        <div className="space-y-4">
          {members.map((m, i) => (
            <div key={i} className="bg-[#0b0c16] border border-outline-variant p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#004491]/15 flex items-center justify-center shrink-0">
                  <span className="text-[#004491] text-[10px] font-black">{i + 1}</span>
                </div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  {i === 0 ? "Team Leader" : `Member ${i + 1}`}
                </p>
                {i === 0 && (
                  <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#004491]/10 text-[#5b9aff] border border-[#004491]/30">
                    Leader
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={m.fullName}
                  onChange={(e) => updateMember(i, "fullName", e.target.value)}
                  className="w-full bg-[#080808] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-zinc-700"
                  readOnly={i === 0}
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={m.contactNumber}
                  onChange={(e) => {
                    // Only allow numbers and the plus sign for country codes
                    const numericValue = e.target.value.replace(/[^0-9+]/g, '');
                    updateMember(i, "contactNumber", numericValue);
                  }}
                  className="w-full bg-[#080808] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-zinc-700"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      {members.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={!allFilled || completing}
          className="mt-6 px-5 py-2.5 bg-[#004491] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.3)] transition-all duration-300 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {completing ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Confirm Members
            </>
          )}
        </button>
      )}
    </div>
  );
}

/* ─── Phase 3: Organization Details ─── */
function Phase3OrgDetails({ phaseData, displayStatus, accent, onComplete, completing, team }) {
  const [teamType, setTeamType] = useState("");
  const [orgName, setOrgName] = useState("");

  const savedData = phaseData?.data || null;
  const isCompleted = displayStatus === "completed";

  // Determine selected event from Phase 1
  const selectedEvent = team?.phases?.['1']?.data?.eventSelection || '';

  // Completed — read-only summary
  if (isCompleted && savedData) {
    return (
      <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#10b981' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Team Type</p>
            <p className="text-[#00d2ff] text-sm font-bold">{savedData.teamType}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Organization Name</p>
            <p className="text-zinc-200 text-sm font-semibold">{savedData.orgName}</p>
          </div>
        </div>
      </div>
    );
  }

  // Active — form
  // For Robot Race: only School Team & University Team
  // For Robot Battles: all three options including Public Team
  const allTeamTypes = [
    { value: "School Team", icon: "school" },
    { value: "University Team", icon: "account_balance" },
    { value: "Public Team", icon: "public" },
  ];

  const teamTypes = selectedEvent === 'Robot Race'
    ? allTeamTypes.filter(t => t.value !== 'Public Team')
    : allTeamTypes;

  const canSubmit = teamType && orgName.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onComplete(3, { teamType, orgName: orgName.trim() });
  };

  return (
    <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />

      {/* Team Type */}
      <div className="mb-6">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-4">Team Type</p>
        <p className="text-zinc-600 text-[10px] mb-4">Select the type that best describes your team</p>

        <div className={`grid grid-cols-1 ${teamTypes.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-3`}>
          {teamTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTeamType(t.value)}
              className={`relative text-left p-4 border transition-all duration-200 flex items-center gap-3 ${
                teamType === t.value
                  ? "bg-[#004491]/10 border-[#004491] shadow-[0_0_15px_rgba(0,68,145,0.15)]"
                  : "bg-[#0b0c16] border-outline-variant hover:border-zinc-600"
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${teamType === t.value ? "text-[#004491]" : "text-zinc-600"}`}>
                {teamType === t.value ? "radio_button_checked" : "radio_button_unchecked"}
              </span>
              <span className={`material-symbols-outlined text-xl ${teamType === t.value ? "text-[#00d2ff]" : "text-zinc-600"}`}>
                {t.icon}
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest ${teamType === t.value ? "text-white" : "text-zinc-400"}`}>
                {t.value}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Organization Name */}
      <div className="mb-6">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-3">
          Organization Details
        </p>
        <p className="text-zinc-600 text-[10px] mb-3">Name of the institution you represent</p>
        <input
          type="text"
          placeholder="Enter your school, university, or organization name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-zinc-700"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || completing}
        className="px-5 py-2.5 bg-[#004491] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.3)] transition-all duration-300 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {completing ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Confirm Organization
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Phase 4: Payment Slip Upload ─── */
function Phase4PaymentSlip({ phaseData, displayStatus, accent, onTeamUpdate, team }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const savedData = phaseData?.data || null;
  const isCompleted = displayStatus === "completed";

  // Completed — read-only summary
  if (isCompleted && savedData) {
    return (
      <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#10b981' }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Reference Number</p>
            <p className="text-[#10b981] text-sm font-bold">{savedData.referenceNumber}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Uploaded On</p>
            <p className="text-zinc-200 text-sm font-semibold">
              {new Date(savedData.uploadedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {(savedData.driveViewUrl || savedData.slipBase64) && (
          <div className="bg-[#0b0c16] border border-outline-variant p-4">
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-3">Payment Slip</p>
            {savedData.driveThumbnailUrl && savedData.fileType?.startsWith("image/") ? (
              <img src={savedData.driveThumbnailUrl} alt="Payment Slip" className="max-h-48 max-w-full object-contain border border-outline-variant mb-3" />
            ) : null}
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500 text-xl">verified</span>
              <div className="flex-1">
                <p className="text-zinc-300 text-sm font-semibold">{savedData.fileName || "Payment Slip"}</p>
                <p className="text-zinc-600 text-[10px]">Uploaded to Google Drive</p>
              </div>
              <a
                href={savedData.driveViewUrl || savedData.slipBase64}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004491] text-[10px] uppercase tracking-widest font-bold hover:text-[#5b9aff] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only JPG, PNG, WebP, or PDF files are allowed.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      return;
    }
    setFile(selectedFile);
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const canSubmit = file && referenceNumber.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("paymentSlip", file);
      formData.append("referenceNumber", referenceNumber.trim());

      const res = await fetch("/api/team/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.phases) {
        onTeamUpdate({ ...team, phases: data.phases });
      } else {
        alert(data.message || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Determine payment amount from Phase 1 data
  const phase1Data = team?.phases?.['1']?.data || null;
  const eventSel = phase1Data?.eventSelection || '';
  const catSel = phase1Data?.categorySelection || '';
  const isFree = false; // No free categories anymore
  const paymentAmount = (() => {
    if (eventSel === 'Robot Battles' && catSel === 'Heavy Weight') return 'Rs. 1,500';
    if (eventSel === 'Robot Battles' && catSel === 'Light Weight') return 'Rs. 1,000';
    if (eventSel === 'Robot Race' && catSel === 'University Category') return 'Rs. 1,000';
    if (eventSel === 'Robot Race' && catSel === 'School Category') return 'Rs. 500';
    return null;
  })();

  return (
    <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />

      {/* Payment Amount Info */}
      {paymentAmount && (
        <div className={`mb-6 p-4 rounded-lg border relative overflow-hidden ${
          isFree
            ? 'bg-emerald-950/30 border-emerald-500/30'
            : 'bg-[#004491]/10 border-[#004491]/30'
        }`}>
          <div className={`absolute top-0 left-0 right-0 h-[2px] ${
            isFree ? 'bg-emerald-500' : 'bg-[#004491]'
          }`} />
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined text-2xl ${
              isFree ? 'text-emerald-400' : 'text-[#5b9aff]'
            }`}>{isFree ? 'celebration' : 'payments'}</span>
            <div>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-0.5">
                {eventSel} · {catSel}
              </p>
              <p className={`text-lg font-black ${
                isFree ? 'text-emerald-400' : 'text-[#5b9aff]'
              }`}>
                {isFree ? '🎉 FREE Registration!' : `Registration Fee: ${paymentAmount}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {isFree ? (
        /* ── FREE registration: no upload needed ── */
        <>
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-emerald-400 text-5xl mb-4 block">verified</span>
            <p className="text-zinc-300 text-sm font-semibold mb-1">No payment required for School Category</p>
            <p className="text-zinc-600 text-[10px]">Click below to confirm your free registration</p>
          </div>
          <button
            onClick={async () => {
              setUploading(true);
              try {
                const res = await fetch("/api/team/complete-free", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ teamId: team.id }),
                });
                const data = await res.json();
                if (data.success && data.phases) {
                  onTeamUpdate({ ...team, phases: data.phases });
                } else {
                  alert(data.message || "Failed. Please try again.");
                }
              } catch (err) {
                console.error("Error:", err);
                alert("Failed. Please try again.");
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading}
            className="px-5 py-2.5 bg-emerald-600 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-700 border border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Confirm Free Registration
              </>
            )}
          </button>
        </>
      ) : (
        /* ── Paid registration: upload slip + reference ── */
        <>
          {/* Bank Details */}
          <div className="mb-6 bg-[#0b0c16] border border-outline-variant p-4">
            <div className="flex items-center gap-2 mb-3 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-[#00d2ff] text-xl">account_balance</span>
              <h4 className="text-zinc-200 text-sm font-bold uppercase tracking-widest">Bank Details for Transfer</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-start sm:items-center gap-2">
                <span className="material-symbols-outlined text-zinc-500 text-sm shrink-0">account_balance_wallet</span>
                <p className="text-zinc-400 text-xs">Bank: <span className="text-white font-semibold">People's Bank</span></p>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <span className="material-symbols-outlined text-zinc-500 text-sm shrink-0">location_on</span>
                <p className="text-zinc-400 text-xs">Branch: <span className="text-white font-semibold">Kelaniya</span></p>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <span className="material-symbols-outlined text-zinc-500 text-sm shrink-0">badge</span>
                <p className="text-zinc-400 text-xs">Account Name: <span className="text-white font-semibold">Electronics and Computer Science Student Club</span></p>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <span className="material-symbols-outlined text-zinc-500 text-sm shrink-0">pin</span>
                <p className="text-zinc-400 text-xs">Account Number: <span className="text-white font-semibold text-sm">055200290051008</span></p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-6">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-4">Payment Slip</p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("slip-upload").click()}
              className={`relative cursor-pointer border-2 border-dashed p-8 transition-all duration-200 text-center ${
                dragOver
                  ? "border-[#004491] bg-[#004491]/5"
                  : file
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-outline-variant hover:border-zinc-500 bg-[#0b0c16]"
              }`}
            >
              <input
                id="slip-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />

              {file ? (
                <div className="flex flex-col items-center gap-3">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-40 max-w-full object-contain border border-outline-variant" />
                  ) : (
                    <span className="material-symbols-outlined text-emerald-500 text-5xl">description</span>
                  )}
                  <div>
                    <p className="text-zinc-300 text-sm font-semibold">{file.name}</p>
                    <p className="text-zinc-600 text-[10px] mt-0.5">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-zinc-600 text-5xl">cloud_upload</span>
                  <div>
                    <p className="text-zinc-400 text-sm font-semibold">Drop your payment slip here</p>
                    <p className="text-zinc-600 text-[10px] mt-0.5">or click to browse · JPG, PNG, WebP, PDF (max 5MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reference Number */}
          <div className="mb-6">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-3">Payment Reference Number</p>
            <input
              type="text"
              placeholder="Enter your payment reference number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-zinc-700"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || uploading}
            className="px-5 py-2.5 bg-[#004491] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#003070] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.3)] transition-all duration-300 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Submit Payment
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── WhatsApp Group Links by Event + Category ─── */
const WHATSAPP_GROUPS = {
  "Robot Battles|Heavy Weight": {
    name: "UOK Robot Battle 2K26 - Heavy Weight Category",
    url: "https://chat.whatsapp.com/Gtq8WY80kLeKnUgwYALuwf",
  },
  "Robot Battles|Light Weight": {
    name: "UOK Robot Battle 2K26 - Light Weight Category",
    url: "https://chat.whatsapp.com/KK2dFehd8baB3Zyz6Fnnov",
  },
  "Robot Race|University Category": {
    name: "UOK Robot Race 2K26 - University Category",
    url: "https://chat.whatsapp.com/Kvf2XmMP90oI3HdjLK5oMw",
  },
  "Robot Race|School Category": {
    name: "UOK Robot Race 2K26 - School Category",
    url: "https://chat.whatsapp.com/JQ5QuUjwhBi3pcbFoENapA",
  },
};

/* ─── Phase 5: WhatsApp Group ─── */
function Phase5WhatsAppGroup({ team, phaseData, displayStatus, accent, onComplete, completing }) {
  const savedData = phaseData?.data || null;
  const isCompleted = displayStatus === "completed";

  // Get event + category from Phase 1
  const phase1Data = team.phases?.['1']?.data || {};
  const eventSelection = phase1Data.eventSelection || "";
  const categorySelection = phase1Data.categorySelection || "";
  const groupKey = `${eventSelection}|${categorySelection}`;
  const group = WHATSAPP_GROUPS[groupKey] || null;

  // Completed — read-only summary
  if (isCompleted && savedData) {
    return (
      <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#10b981' }} />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <p className="text-zinc-200 text-sm font-bold">{savedData.groupName || "WhatsApp Group"}</p>
            <p className="text-emerald-400 text-xs font-semibold">✓ Joined</p>
          </div>
        </div>

        <div className="bg-[#0b0c16] border border-outline-variant p-4 mb-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Confirmed At</p>
          <p className="text-zinc-300 text-sm font-semibold">
            {new Date(savedData.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Join Link Button - Available even after completion */}
        <a
          href={group?.url || savedData.groupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#128C7E] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#075E54] transition-all duration-300 rounded-lg hover:shadow-[0_0_20px_rgba(18,140,126,0.3)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Join WhatsApp Group
        </a>
      </div>
    );
  }

  // No group found (Phase 1 not completed yet — shouldn't happen but handle gracefully)
  if (!group) {
    return (
      <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />
        <div className="flex flex-col items-center justify-center text-center py-6">
          <span className="material-symbols-outlined text-zinc-700 text-4xl mb-3">error_outline</span>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Event Not Selected</p>
          <p className="text-zinc-600 text-[10px] mt-1">Please complete Phase 1 first to see your WhatsApp group.</p>
        </div>
      </div>
    );
  }

  // Active — show WhatsApp group link + join button
  const handleConfirmJoined = () => {
    onComplete(5, {
      groupName: group.name,
      groupUrl: group.url,
      joinedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />

      {/* Info text */}
      <div className="mb-6">
        <p className="text-zinc-400 text-sm leading-relaxed">
          Join your category's official WhatsApp group to receive updates, announcements, and communicate with the organizers.
        </p>
      </div>

      {/* WhatsApp Group Card */}
      <div className="bg-[#0b0c16] border border-[#25D366]/20 rounded-lg p-5 mb-6">
        <div className="flex items-start gap-4">
          {/* WhatsApp Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0 border border-[#25D366]/20">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[#25D366] text-[10px] uppercase tracking-widest font-bold mb-1">Your WhatsApp Group</p>
            <p className="text-white text-sm font-bold mb-1 leading-snug">{group.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#004491]/10 text-[#5b9aff] border border-[#004491]/30 rounded-md">
                {eventSelection}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-white/[0.04] text-zinc-400 border border-white/[0.08] rounded-md">
                {categorySelection}
              </span>
            </div>
          </div>
        </div>

        {/* Join Link Button */}
        <a
          href={group.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#128C7E] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#075E54] transition-all duration-300 rounded-lg hover:shadow-[0_0_20px_rgba(18,140,126,0.3)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Join WhatsApp Group
        </a>
      </div>

      {/* Important note */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">info</span>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Please join the WhatsApp group first using the button above, then click the confirmation button below to complete this phase.
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmJoined}
        disabled={completing}
        className="w-full py-3 bg-[#004491] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {completing ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">check_circle</span>
            I Have Joined the Group
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Team Details Section ─── */
function TeamDetailsSection({ team, onTeamUpdate }) {
  const [completing, setCompleting] = useState(false);

  // Phase data from Firestore (defaults for legacy teams)
  const rawPhaseData = team.phases || {
    "1": { completed: false, unlockedAt: new Date().toISOString() },
    "2": { completed: false, unlockedAt: null },
    "3": { completed: false, unlockedAt: null },
    "4": { completed: false, unlockedAt: null },
    "5": { completed: false, unlockedAt: null },
    "6": { completed: false, unlockedAt: null, devLocked: true },
  };

  // Backward compat: strip devLocked from Phase 5 for teams registered before the WhatsApp phase update
  const phaseData = { ...rawPhaseData };
  if (phaseData['5']?.devLocked) {
    phaseData['5'] = { ...phaseData['5'], devLocked: false };
    // If Phase 4 is completed, auto-unlock Phase 5
    if (phaseData['4']?.completed && !phaseData['5']?.unlockedAt) {
      phaseData['5'] = { ...phaseData['5'], unlockedAt: new Date().toISOString() };
    }
  }
  // Ensure Phase 6 exists for legacy teams
  if (!phaseData['6']) {
    phaseData['6'] = { completed: false, unlockedAt: null, devLocked: true };
  }

  // Auto-complete Phase 4 for free registrations (Robot Race School Category)
  useEffect(() => {
    const p1 = phaseData['1'];
    const p3 = phaseData['3'];
    const p4 = phaseData['4'];
    const isFree = p1?.data?.eventSelection === 'Robot Race' && p1?.data?.categorySelection === 'School Category';
    if (isFree && p3?.completed && !p4?.completed) {
      fetch("/api/team/complete-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.phases) {
            onTeamUpdate({ ...team, phases: data.phases });
          }
        })
        .catch(err => console.error("Auto-complete free registration error:", err));
    }
  }, [phaseData['3']?.completed]);

  const handleCompletePhase = async (phaseId, phaseData = null) => {
    setCompleting(true);
    try {
      const body = { phaseId };
      if (phaseData) body.phaseData = phaseData;

      const res = await fetch("/api/team/phases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success && data.phases) {
        onTeamUpdate({ ...team, phases: data.phases });
      }
    } catch (err) {
      console.error("Phase completion error:", err);
    } finally {
      setCompleting(false);
    }
  };

  /* Build display phases with content */
  const displayPhases = PHASE_META.map((meta) => {
    const data = phaseData[String(meta.id)] || {};
    const displayStatus = getPhaseStatus(data);

    let content = null;

    if (meta.id === 1) {
      content = (
        <Phase1EventDetails
          team={team}
          phaseData={data}
          displayStatus={displayStatus}
          accent={meta.accent}
          onComplete={handleCompletePhase}
          completing={completing}
        />
      );
    }

    if (meta.id === 2) {
      content = (
        <Phase2MembersDetails
          team={team}
          phaseData={data}
          displayStatus={displayStatus}
          accent={meta.accent}
          onComplete={handleCompletePhase}
          completing={completing}
        />
      );
    }

    if (meta.id === 3) {
      content = (
        <Phase3OrgDetails
          phaseData={data}
          displayStatus={displayStatus}
          accent={meta.accent}
          onComplete={handleCompletePhase}
          completing={completing}
          team={team}
        />
      );
    }

    if (meta.id === 4) {
      content = (
        <Phase4PaymentSlip
          phaseData={data}
          displayStatus={displayStatus}
          accent={meta.accent}
          onTeamUpdate={onTeamUpdate}
          team={team}
        />
      );
    }

    if (meta.id === 5) {
      content = (
        <Phase5WhatsAppGroup
          team={team}
          phaseData={data}
          displayStatus={displayStatus}
          accent={meta.accent}
          onComplete={handleCompletePhase}
          completing={completing}
        />
      );
    }

    return { ...meta, displayStatus, content, hasCustomSubmit: meta.id <= 5 };
  });

  const completedCount = displayPhases.filter((p) => p.displayStatus === "completed").length;

  return (
    <>
      {/* Section Header */}
      <div className="mb-10">
        <p className="text-[#004491] text-xs uppercase tracking-[0.3em] font-bold mb-3">Team Details</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
          {team.teamName}
        </h1>
        <p className="text-zinc-500 text-sm">
          Complete each phase to unlock the next and finalize your registration.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">Progress</span>
          <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            {completedCount} / {PHASE_META.length} Completed
          </span>
        </div>
        <div className="w-full h-[3px] bg-zinc-800/60 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(completedCount / PHASE_META.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="relative">
        {displayPhases.map((phase, idx) => (
          <PhaseNode
            key={phase.id}
            phase={phase}
            isLast={idx === displayPhases.length - 1}
            onComplete={handleCompletePhase}
            completing={completing}
          />
        ))}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.authenticated) {
          setTeam(data.team);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#004491]/30 border-t-[#004491] rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  /* Render the active section */
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection team={team} />;
      case "team":
        return <TeamDetailsSection team={team} onTeamUpdate={setTeam} />;
      default:
        return <DashboardSection team={team} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] font-space-grotesk">

      {/* ─── Top Bar ─── */}
      <nav className="fixed top-0 w-full z-50 bg-black border-b border-outline-variant flex justify-between items-center px-4 sm:px-6 md:px-8 h-16">
        {/* Left: Logo + Mobile sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-zinc-400 hover:text-white p-1 focus:outline-none"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileSidebarOpen ? "close" : "menu"}
            </span>
          </button>
          <Link href="/" className="h-8 md:h-10 shrink-0">
            <Image
              src="https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160"
              alt="UOK Robot Games Logo"
              width={160}
              height={40}
              className="h-full w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: Team name + Sign out */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
            <span className="material-symbols-outlined text-[#004491] text-lg">group</span>
            <span className="uppercase tracking-wider font-bold text-zinc-300">{team.teamName}</span>
          </div>
          <div className="w-[1px] h-6 bg-outline-variant hidden sm:block" />
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[0.15em] font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="hidden sm:inline">{loggingOut ? "..." : "Sign Out"}</span>
          </button>
        </div>
      </nav>

      {/* ─── Layout: Sidebar + Content ─── */}
      <div className="flex pt-16 min-h-screen">

        {/* ─── Desktop Sidebar ─── */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 fixed top-16 bottom-0 bg-[#050505] border-r border-outline-variant z-40">
          
          {/* Nav Items */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-200 group ${
                    isActive
                      ? "bg-[#004491]/15 text-white border-l-2 border-[#004491]"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] border-l-2 border-transparent"
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg transition-colors ${isActive ? "text-[#004491]" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-5 border-t border-outline-variant">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-widest font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Return to Arena
            </Link>
          </div>
        </aside>

        {/* ─── Mobile Sidebar Overlay ─── */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex" onClick={() => setMobileSidebarOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Sidebar Panel */}
            <aside
              className="relative w-64 bg-[#050505] border-r border-outline-variant flex flex-col h-full pt-16"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex-1 py-6 px-3 space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-200 group ${
                        isActive
                          ? "bg-[#004491]/15 text-white border-l-2 border-[#004491]"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] border-l-2 border-transparent"
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg transition-colors ${isActive ? "text-[#004491]" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="px-4 py-5 border-t border-outline-variant">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-widest font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Return to Arena
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* ─── Main Content ─── */}
        <main className="flex-1 md:ml-56 lg:ml-64 p-6 sm:p-8 lg:p-10">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
