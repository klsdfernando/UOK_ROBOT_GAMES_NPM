"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function RuleItem({ children }) {
  return (
    <li className="flex items-start gap-4">
      <span className="material-symbols-outlined text-zinc-600 mt-0.5 text-base">
        chevron_right
      </span>
      <span>{children}</span>
    </li>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="relative">
      <div className="absolute top-2 -left-6 w-4 h-[1px] bg-zinc-800" />
      <h4 className="text-sm font-bold text-[#4a8fe7] mb-4 uppercase tracking-widest">
        {title}
      </h4>
      <ul className="space-y-5 text-zinc-400 list-none">{children}</ul>
    </div>
  );
}

export default function RulesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="py-24 px-8 bg-[#000000]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-16 items-start">
            {/* ROBOT BATTLES SECTION */}
            <div className="animate-fade-slide bg-[#050505] border border-white/[0.06] rounded-3xl p-8 lg:p-12 hover:border-[#004491]/40 transition-colors duration-500 relative overflow-hidden group h-full flex flex-col" style={{ animationDelay: "0.1s" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="mb-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#004491]/10 flex items-center justify-center mb-6 border border-[#004491]/20 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[#4a8fe7] text-3xl">shield</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-widest">
                  ROBOT BATTLES
                </h2>
                <div className="h-[2px] w-12 bg-[#004491] mt-5 mb-5" />
                <p className="text-zinc-400 text-sm lg:text-base">
                  Ensure your machine complies with the arena&apos;s standards.
                </p>
              </div>

              <div className="text-[#4a8fe7] font-bold uppercase tracking-[0.2em] text-[10px] mb-8 border-b border-white/[0.06] pb-4">
                COMBAT RULES &amp; REGULATIONS
              </div>

              <div className="space-y-12 border-l border-white/[0.06] pl-6 py-2 flex-grow">
                {/* 1. Team Requirements */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.2s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#004491] text-xs">01</span> Team Requirements
                  </h3>
                  <ul className="space-y-5 text-zinc-400 list-none mb-8 text-sm lg:text-base">
                    <RuleItem>Each participant can only join one team.</RuleItem>
                    <RuleItem>A team must consist of a maximum of 5 members.</RuleItem>
                    <RuleItem>Must have a unique name and a team leader.</RuleItem>
                    <RuleItem>A team can only compete in one category.</RuleItem>
                  </ul>

                  <div className="ml-4 pl-6 border-l border-white/[0.04] space-y-8 mb-10">
                    <SubSection title="Heavy Weight">
                      <RuleItem>Team members must be affiliated with the same university or school.</RuleItem>
                    </SubSection>
                    <SubSection title="Light Weight">
                      <RuleItem>Team members must be Sri Lankan nationals.</RuleItem>
                    </SubSection>
                  </div>
                </div>

                {/* 2. Robot Specification */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.35s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#004491] text-xs">02</span> Robot Specification
                  </h3>

                  <div className="ml-4 pl-6 border-l border-white/[0.04] space-y-8 mb-10 text-sm lg:text-base">
                    <SubSection title="General">
                      <RuleItem>Chassis must be custom-made.</RuleItem>
                      <RuleItem>Power supply must be internal.</RuleItem>
                      <RuleItem>The maximum voltage cannot exceed 24 V.</RuleItem>
                      <RuleItem>Internal combustion engines are not allowed.</RuleItem>
                      <RuleItem>Weaponized robots must have a Master Kill Switch.</RuleItem>
                    </SubSection>

                    <SubSection title="Heavy Weight">
                      <RuleItem>Weight must not exceed 20kg.</RuleItem>
                      <RuleItem>Dimensions within 45 cm × 45 cm (L x W).</RuleItem>
                    </SubSection>

                    <SubSection title="Light Weight">
                      <RuleItem>Weight must not exceed 2.5kg.</RuleItem>
                      <RuleItem>Dimensions within 25 cm × 25 cm (L x W).</RuleItem>
                    </SubSection>
                  </div>
                </div>

                {/* 3. Safety Requirements */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.5s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#004491] text-xs">03</span> Safety Requirements
                  </h3>
                  <ul className="space-y-5 text-zinc-400 list-none text-sm lg:text-base">
                    <RuleItem>Entrants must pass safety and technical inspections.</RuleItem>
                    <RuleItem>Operators must avoid entering the combat zone.</RuleItem>
                    <RuleItem>Sharp edges must be covered outside the arena.</RuleItem>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center pt-12 mt-auto">
                <button className="w-full bg-[#004491]/10 text-white px-10 py-4 font-bold hover:bg-[#004491] hover:shadow-[0_0_20px_rgba(0,68,145,0.4)] transition-all duration-300 border border-[#004491]/30 uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2">
                  Download Full Battle Guidelines <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>
            </div>

            {/* ROBOT GAMES SECTION */}
            <div className="animate-fade-slide bg-[#050505] border border-white/[0.06] rounded-3xl p-8 lg:p-12 hover:border-[#00d2ff]/40 transition-colors duration-500 relative overflow-hidden group h-full flex flex-col" style={{ animationDelay: "0.15s" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="mb-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#00d2ff]/10 flex items-center justify-center mb-6 border border-[#00d2ff]/20 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[#00d2ff] text-3xl">route</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-widest">
                  ROBOT RACE
                </h2>
                <div className="h-[2px] w-12 bg-[#00d2ff] mt-5 mb-5" />
                <p className="text-zinc-400 text-sm lg:text-base">
                  Test your processing power, speed, and agility.
                </p>
              </div>

              <div className="text-[#00d2ff] font-bold uppercase tracking-[0.2em] text-[10px] mb-8 border-b border-white/[0.06] pb-4">
                CHALLENGE RULES &amp; REGULATIONS
              </div>

              <div className="space-y-12 border-l border-white/[0.06] pl-6 py-2 flex-grow">
                {/* 1. Track Requirements */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.3s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#00d2ff] text-xs">01</span> Track Requirements
                  </h3>
                  <ul className="space-y-5 text-zinc-400 list-none mb-8 text-sm lg:text-base">
                    <RuleItem>Robots must navigate a predefined obstacle course.</RuleItem>
                    <RuleItem>Line-following capabilities are mandatory for Section A.</RuleItem>
                    <RuleItem>Robots must complete the course within 5 minutes.</RuleItem>
                    <RuleItem>No physical human intervention is allowed during the run.</RuleItem>
                  </ul>
                </div>

                {/* 2. Robot Specification */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.4s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#00d2ff] text-xs">02</span> Robot Specification
                  </h3>
                  <div className="ml-4 pl-6 border-l border-white/[0.04] space-y-8 mb-10 text-sm lg:text-base">
                    <SubSection title="Dimensions & Weight">
                      <RuleItem>Weight must not exceed 3.0kg.</RuleItem>
                      <RuleItem>Maximum dimensions are 30 cm × 30 cm × 30 cm.</RuleItem>
                      <RuleItem>Expanding mechanisms are strictly prohibited.</RuleItem>
                    </SubSection>
                    
                    <SubSection title="Power & Control">
                      <RuleItem>Maximum operating voltage is 12 V.</RuleItem>
                      <RuleItem>Must include an emergency stop button accessible from top.</RuleItem>
                      <RuleItem>Remote controls must operate on a 2.4GHz frequency.</RuleItem>
                    </SubSection>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-12 mt-auto">
                <button className="w-full bg-[#00d2ff]/10 text-white px-10 py-4 font-bold hover:bg-[#00d2ff] hover:text-[#000] hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all duration-300 border border-[#00d2ff]/30 uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2">
                  Download Full Race Guidelines <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
