"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { useRegistrationConfig } from "@/hooks/useRegistrationConfig";


const timelineStages = [
  {
    phase: "PHASE_01 // UPLINK",
    title: "REGISTRATION OPENING",
    date: "1ST OF JULY",
    side: "left",
    active: true,
    content: {
      type: "action",
      text: "Registration is now officially open. Teams must submit their primary details and blueprints to begin the sequence.",
      buttonText: "REGISTER NOW",
      buttonIcon: "how_to_reg",
    },
  },
  {
    phase: "PHASE_02 // DEADLINE",
    title: "REGISTRATION CLOSING",
    date: "15TH OF SEPTEMBER",
    side: "right",
    active: false,
    content: { type: "info", text: "SUBMISSIONS LOCKED" },
  },
  {
    phase: "PHASE_03 // TRAINING",
    title: "ROBOT BATTLE WORKSHOP",
    date: "19TH OF SEPTEMBER",
    side: "left",
    active: false,
    content: { type: "locked", text: "ZOOM LINK LOCKED", icon: "link_off" },
  },
  {
    phase: "PHASE_04 // PREPARATION",
    title: "ROBOT RACE WORKSHOP",
    date: "26TH OF SEPTEMBER",
    side: "right",
    active: false,
    content: { type: "locked", text: "ZOOM LINK LOCKED", icon: "link_off" },
  },
  {
    phase: "PHASE_05 // BRIEFING",
    title: "AWARENESS SESSION",
    date: "5TH OF OCTOBER",
    side: "left",
    active: false,
    content: { type: "locked", text: "ZOOM LINK LOCKED", icon: "link_off" },
  },
  {
    phase: "PHASE_06 // APEX",
    title: "ROBOT GAMES 2K26",
    date: "9TH OF OCTOBER",
    side: "right",
    active: false,
    content: { type: "info", text: "MAIN EVENT LOCKED" },
  },
];

function TimelineContent({ content, active, isLoggedIn, isBeforeOpenDate, isRegistrationClosed }) {
  if (content.type === "action" && active) {
    return (
      <div className="bg-[#131313] p-6 border border-outline-variant hover:border-[#004491]/50 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-[2px] bg-[#004491]" />
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          {content.text}
        </p>
        {isLoggedIn ? (
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-[#004491]/10 border border-[#004491] text-[#5b9aff] px-8 py-3 font-bold text-[10px] tracking-widest uppercase hover:bg-[#004491]/20 transition-colors w-full sm:w-auto">
              <span className="material-symbols-outlined text-[14px]">
                dashboard
              </span>
              DASHBOARD
            </Link>
            <div className="flex items-center gap-2 text-green-400 font-bold text-[11px] tracking-widest uppercase bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              REGISTERED
            </div>
          </div>
        ) : isBeforeOpenDate ? (
          <div className="inline-flex items-center gap-2 bg-[#0a0c14] border border-[#004491]/30 text-[#5b9aff] px-6 py-3 font-bold text-[10px] tracking-widest uppercase">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            OPENING SOON
          </div>
        ) : isRegistrationClosed ? (
          <div className="inline-flex items-center gap-2 bg-red-950/30 border border-red-500/20 text-red-400 px-6 py-3 font-bold text-[10px] tracking-widest uppercase">
            <span className="material-symbols-outlined text-[14px]">block</span>
            REGISTRATION CLOSED
          </div>
        ) : (
          <Link href="/register" className="inline-flex items-center gap-2 bg-[#004491]/10 border border-[#004491] text-[#5b9aff] px-6 py-2 font-bold text-[10px] tracking-widest uppercase hover:bg-[#004491]/20 transition-colors">
            <span className="material-symbols-outlined text-[14px]">
              {content.buttonIcon}
            </span>
            {content.buttonText}
          </Link>
        )}
      </div>
    );
  }

  if (content.type === "locked") {
    return (
      <div className="bg-[#080808] p-6 border border-outline-variant border-dashed relative flex flex-col items-center justify-center text-center py-8">
        <span className="material-symbols-outlined text-outline text-3xl mb-4">
          lock
        </span>
        <button
          disabled
          className="flex items-center gap-2 bg-[#131313] border border-outline-variant text-outline px-6 py-2 font-bold text-[10px] tracking-widest uppercase cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[14px]">
            {content.icon}
          </span>
          {content.text}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#080808] p-6 border border-outline-variant border-dashed relative flex flex-col items-center justify-center text-center py-8">
      <span className="material-symbols-outlined text-outline text-3xl mb-4">
        lock
      </span>
      <div className="text-xs font-bold text-outline tracking-widest uppercase">
        {content.text}
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isBeforeOpenDate, isRegistrationClosed } = useRegistrationConfig();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setIsLoggedIn(data.authenticated === true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <section className="py-24 px-8 border-t border-outline-variant bg-[#080808]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeader
          title="TOURNAMENT SCHEDULE"
          subtitle="Critical milestones for the UOK Robot Games. All teams must adhere to the sequence."
        />

        {/* Vertical Timeline */}
        <div className="relative w-full max-w-4xl mx-auto flex flex-col py-12 px-6 sm:px-10 md:px-0">
          {/* Central Line */}
          <div className="absolute left-10 sm:left-14 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#1a1c33] transform md:-translate-x-1/2 z-0">
            <div className="absolute top-0 w-full h-1/6 bg-gradient-to-b from-[#004491] to-transparent shadow-[0_0_15px_rgba(0,68,145,0.8)] z-10" />
          </div>

          <div className="flex flex-col gap-16 md:gap-24 w-full relative z-10">
            {timelineStages.map((stage, i) => {
              const isLeft = stage.side === "left";
              return (
                <div
                  key={i}
                  className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    } items-start md:items-center w-full group relative`}
                >
                  {/* Horizontal connector (desktop) */}
                  <div
                    className={`hidden md:block absolute top-1/2 ${isLeft ? "left-1/2" : "right-1/2"
                      } w-1/4 h-[2px] bg-[#1a1c33] transform -translate-y-1/2 ${isLeft ? "-translate-x-full" : "translate-x-full"
                      } ${stage.active
                        ? "group-hover:bg-[#004491] transition-colors duration-500"
                        : ""
                      }`}
                  />

                  {/* Label side */}
                  <div
                    className={`w-full md:w-1/2 ${isLeft
                      ? "md:pr-16 text-left md:text-right"
                      : "md:pl-16 text-left"
                      } mb-4 md:mb-0 pl-16 sm:pl-20 md:pl-0 flex flex-col ${isLeft ? "items-start md:items-end" : "items-start"
                      } justify-center ${stage.active ? "" : "opacity-50"
                      } md:-translate-y-2`}
                  >
                    <div
                      className={`font-bold text-[11px] ${stage.active
                        ? "text-[#5b9aff]"
                        : "text-zinc-500"
                        } tracking-[0.1em] uppercase mb-1`}
                    >
                      {stage.phase}
                    </div>
                    <div className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                      {stage.title}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span
                        className={`px-3 py-1.5 ${stage.active
                          ? "bg-[#004491]/20 border-[#004491]/30 text-[#5b9aff]"
                          : "bg-[#0a0a0a] border-[#1a1c33] text-zinc-500"
                          } border text-[10px] font-bold tracking-[0.15em] rounded-sm`}
                      >
                        {stage.date}
                      </span>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div
                    className={`absolute left-10 sm:left-14 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-black border-[2px] ${stage.active
                      ? "border-[#004491] shadow-[0_0_20px_rgba(0,68,145,0.6)]"
                      : "border-[#1a1c33]"
                      } flex items-center justify-center z-20 mt-[2px] md:mt-0`}
                  >
                    {stage.active && (
                      <div className="w-2 h-2 rounded-full bg-[#004491]" />
                    )}
                  </div>

                  {/* Content side */}
                  <div
                    className={`w-full md:w-1/2 ${isLeft ? "md:pl-16" : "md:pr-16"
                      } pl-16 sm:pl-20 md:pl-0 ${stage.active ? "" : "opacity-50"
                      }`}
                  >
                    <TimelineContent
                      content={stage.content}
                      active={stage.active}
                      isLoggedIn={isLoggedIn}
                      isBeforeOpenDate={isBeforeOpenDate}
                      isRegistrationClosed={isRegistrationClosed}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
