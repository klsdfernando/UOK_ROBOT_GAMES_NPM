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
                    <RuleItem>All team members must be Sri Lankan nationals.</RuleItem>
                    <RuleItem>Must have a unique name and a designated team leader.</RuleItem>
                    <RuleItem>A team can only compete in one category (Heavy-Weight or Light-Weight).</RuleItem>
                  </ul>
                </div>

                {/* 2. Robot Specification */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.35s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#004491] text-xs">02</span> Robot Specification
                  </h3>

                  <div className="ml-4 pl-6 border-l border-white/[0.04] space-y-8 mb-10 text-sm lg:text-base">
                    <SubSection title="General">
                      <RuleItem>Chassis must be entirely custom-made (no pre-assembled kits).</RuleItem>
                      <RuleItem>Power supply must be internal, maximum voltage 24 V.</RuleItem>
                      <RuleItem>Internal combustion engines are not allowed.</RuleItem>
                      <RuleItem>Active weapons must have a Master Kill Switch.</RuleItem>
                    </SubSection>

                    <SubSection title="Heavy Weight">
                      <RuleItem>Maximum weight: 20.0 kg.</RuleItem>
                      <RuleItem>Initial dimensions: 45 cm × 45 cm (L x W).</RuleItem>
                      <RuleItem>Can expand up to 60 cm after the battle starts.</RuleItem>
                    </SubSection>

                    <SubSection title="Light Weight">
                      <RuleItem>Maximum weight: 3.0 kg.</RuleItem>
                      <RuleItem>Initial dimensions: 25 cm × 25 cm (L x W).</RuleItem>
                      <RuleItem>Can expand up to 35 cm after the battle starts.</RuleItem>
                    </SubSection>
                  </div>
                </div>

                {/* 3. Weapons & Safety */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.5s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#004491] text-xs">03</span> Weapons &amp; Safety
                  </h3>
                  <div className="ml-4 pl-6 border-l border-white/[0.04] space-y-8 mb-10 text-sm lg:text-base">
                    <SubSection title="Safety Rules">
                      <RuleItem>Entrants must pass safety and technical inspections.</RuleItem>
                      <RuleItem>Sharp edges must be covered outside the arena.</RuleItem>
                    </SubSection>

                    <SubSection title="Forbidden Weapons">
                      <RuleItem>Electricity (Stun guns, EMP, RF jamming).</RuleItem>
                      <RuleItem>Liquids (except water), foams, adhesives.</RuleItem>
                      <RuleItem>Explosives, flammable solids, or heat specifically generated to damage.</RuleItem>
                      <RuleItem>Blinding lights/lasers and untethered projectiles.</RuleItem>
                      <RuleItem>Entanglement devices (nets, fishing line, tape).</RuleItem>
                    </SubSection>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-12 mt-auto">
                <a
                  href="https://ik.imagekit.io/wfnazmyxh/GuildLines/Robot%20Battle%202K26%20Guidelines%20(FINAL).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#004491]/10 text-white px-10 py-4 font-bold hover:bg-[#004491] hover:shadow-[0_0_20px_rgba(0,68,145,0.4)] transition-all duration-300 border border-[#004491]/30 uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2"
                >
                  Download Full Battle Guidelines <span className="material-symbols-outlined text-sm">download</span>
                </a>
              </div>
            </div>

            {/* ROBOT GAMES SECTION */}
            <div className="animate-fade-slide bg-[#050505] border border-white/[0.06] rounded-3xl p-8 lg:p-12 hover:border-[#004491]/40 transition-colors duration-500 relative overflow-hidden group h-full flex flex-col" style={{ animationDelay: "0.15s" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="mb-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#004491]/10 flex items-center justify-center mb-6 border border-[#004491]/20 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[#4a8fe7] text-3xl">route</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-widest">
                  ROBOT RACE
                </h2>
                <div className="h-[2px] w-12 bg-[#004491] mt-5 mb-5" />
                <p className="text-zinc-400 text-sm lg:text-base">
                  Test your processing power, speed, and agility.
                </p>
              </div>

              <div className="text-[#4a8fe7] font-bold uppercase tracking-[0.2em] text-[10px] mb-8 border-b border-white/[0.06] pb-4">
                CHALLENGE RULES &amp; REGULATIONS
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
                    <RuleItem>All members must belong to the same school or institution.</RuleItem>
                    <RuleItem>Each team must have a unique name and a designated team leader.</RuleItem>
                  </ul>
                </div>

                {/* 2. Robot Specification */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.35s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#004491] text-xs">02</span> Robot Specification
                  </h3>

                  <div className="ml-4 pl-6 border-l border-white/[0.04] space-y-8 mb-10 text-sm lg:text-base">
                    <SubSection title="General">
                      <RuleItem>Robots must be built by the team; pre-assembled kits are not allowed.</RuleItem>
                      <RuleItem>Must be completely autonomous (no remote controls, Wi-Fi, or Bluetooth).</RuleItem>
                      <RuleItem>Power supply must be internal, with a maximum of 24 V.</RuleItem>
                      <RuleItem>Must not separate into multiple parts or damage the arena.</RuleItem>
                    </SubSection>

                    <SubSection title="Dimensions & Weight">
                      <RuleItem>Dimensions must not exceed 20 cm × 20 cm (Width × Length).</RuleItem>
                      <RuleItem>There is no height restriction.</RuleItem>
                      <RuleItem>Extensions beyond the size limit are allowed only during operation.</RuleItem>
                    </SubSection>
                  </div>
                </div>

                {/* 3. Task Overview */}
                <div className="animate-fade-slide" style={{ animationDelay: "0.5s" }}>
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="text-[#004491] text-xs">03</span> Task Overview
                  </h3>
                  <div className="ml-4 pl-6 border-l border-white/[0.04] space-y-8 mb-10 text-sm lg:text-base">
                    <SubSection title="Sequence of Tasks">
                      <RuleItem><strong>Task 1:</strong> Accurately follow the designated line path, including dotted line sections.</RuleItem>
                      <RuleItem><strong>Task 2:</strong> Detect and pick up the box.</RuleItem>
                      <RuleItem><strong>Task 3:</strong> Navigate the curved section by following the wall without collisions.</RuleItem>
                      <RuleItem><strong>Task 4:</strong> Accurately place the box within the designated drop zone.</RuleItem>
                    </SubSection>

                    <SubSection title="University Category Specifics">
                      <RuleItem>Color detection is required for the box (Red, Green, or Blue).</RuleItem>
                      <RuleItem>Must identify the drop zone corresponding to the box color and place it correctly.</RuleItem>
                    </SubSection>

                    <SubSection title="School Category Specifics">
                      <RuleItem>Color detection is not required.</RuleItem>
                      <RuleItem>The box can be placed in any of the designated drop zones after wall following.</RuleItem>
                    </SubSection>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-12 mt-auto">
                <a
                  href="https://ik.imagekit.io/wfnazmyxh/GuildLines/UOK%20Robot%20Race%202K26-%20Full%20Guidelines.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#004491]/10 text-white px-10 py-4 font-bold hover:bg-[#004491] hover:shadow-[0_0_20px_rgba(0,68,145,0.4)] transition-all duration-300 border border-[#004491]/30 uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2"
                >
                  Download Full Race Guidelines <span className="material-symbols-outlined text-sm">download</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
