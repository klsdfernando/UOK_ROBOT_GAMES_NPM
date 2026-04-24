"use client";

import ImageCarousel from "@/components/ImageCarousel";

const carouselImages = [
  { src: "/images/hero-robot.png", alt: "Robot Engineering 1" },
  { src: "/images/arena-battle.png", alt: "Robot Engineering 2" },
];

const stats = [
  { icon: "groups", label: "100+ COMPETING TEAMS" },
  { icon: "route", label: "2 MAIN COMPETITION TRACKS" },
  { icon: "school", label: "ORGANIZED BY ECSC, UOK" },
];

export default function AboutSection() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
        <h2 className="text-[32px] leading-[1.2] font-semibold tracking-[-0.02em] text-white uppercase">
          ABOUT THE EVENT
        </h2>
        <div className="h-[3px] w-16 bg-[#004491] mt-2 mb-6" />
        <p className="text-[18px] leading-[1.6] text-on-surface-variant text-center md:text-justify">
          Following the remarkable success of UOK Robot Battles 2K25, which
          attracted over 100 teams, the Electronics and Computer Science Club
          (ECSC) proudly presents the next evolution of the competition:{" "}
          <strong>UOK Robot Games 2K26</strong>. What began as a fierce battle
          of heavyweights has now expanded into a massive multi-competition
          robotics festival, introducing the new high-speed Robot Race alongside
          our signature destructive Robot Battles.
        </p>
        <div className="flex flex-col items-center md:items-start space-y-5 pt-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center text-left md:text-left gap-3">
              <span className="material-symbols-outlined text-[#00d2ff]">
                {stat.icon}
              </span>
              <span className="text-[14px] leading-[1.2] tracking-[0.1em] font-bold text-on-surface-variant uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="order-2">
        <ImageCarousel images={carouselImages} interval={5000} />
      </div>
    </section>
  );
}
