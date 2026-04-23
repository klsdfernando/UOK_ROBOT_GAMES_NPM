import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Rules",
  description: "Rules and regulations for UOK Robot Games 2K26 competitions.",
};

function RuleItem({ children, accent = false }) {
  return (
    <li className="flex items-start gap-4">
      <span className={`material-symbols-outlined ${accent ? "text-[#00d2ff]" : "text-zinc-600"} mt-0.5 text-base`}>
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
      <h4 className="text-sm font-bold text-[#00d2ff] mb-4 uppercase tracking-widest">
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
          <div className="max-w-4xl mx-auto space-y-32">
            {/* ROBOT BATTLES SECTION */}
            <div>
              <div className="mb-16 text-center flex flex-col items-center">
                <h2 className="text-4xl font-black text-white uppercase tracking-widest">
                  ROBOT BATTLES
                </h2>
                <div className="h-[3px] w-16 bg-[#004491] mt-6 mb-6" />
                <p className="text-zinc-300 text-lg">
                  Ensure your machine complies with the arena&apos;s standards.
                </p>
              </div>

              <div className="text-[#00d2ff] font-bold uppercase tracking-[0.2em] text-xs mb-8 border-b border-[#111] pb-4">
                COMBAT RULES &amp; REGULATIONS
              </div>

              <div className="space-y-12 border-l-2 border-[#00d2ff] pl-8 py-2">
                {/* 1. Team Requirements */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
                    1. Team Requirements
                  </h3>
                  <ul className="space-y-5 text-zinc-400 list-none mb-8">
                    <RuleItem accent>Each participant can only join one team.</RuleItem>
                    <RuleItem accent>A team must consist of a maximum of 5 members.</RuleItem>
                    <RuleItem accent>Must have a unique name and a team leader.</RuleItem>
                    <RuleItem accent>A team can only compete in one category.</RuleItem>
                  </ul>

                  <div className="ml-6 pl-6 border-l border-zinc-800 space-y-10 mb-12">
                    <SubSection title="Heavy Weight">
                      <RuleItem>Team members must be affiliated with the same university or school.</RuleItem>
                    </SubSection>
                    <SubSection title="Light Weight">
                      <RuleItem>Team members must be Sri Lankan nationals.</RuleItem>
                    </SubSection>
                  </div>
                </div>

                {/* 2. Robot Specification */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
                    2. Robot Specification
                  </h3>

                  <div className="ml-6 pl-6 border-l border-zinc-800 space-y-10 mb-12">
                    <SubSection title="General">
                      <RuleItem>Chassis must be custom-made.</RuleItem>
                      <RuleItem>Power supply must be internal.</RuleItem>
                      <RuleItem>The maximum voltage between any pair of points cannot exceed 24 V.</RuleItem>
                      <RuleItem>Immobilized electrolytes can be used (e.g., lithium-ion, sealed lead-acid).</RuleItem>
                      <RuleItem>Internal combustion engines are not allowed.</RuleItem>
                      <RuleItem>Participants should bring fully charged batteries and spares.</RuleItem>
                      <RuleItem>Should have an indicated START/STOP switch.</RuleItem>
                      <RuleItem>Weaponized robots must have a Master Kill Switch or auto shutdown.</RuleItem>
                      <RuleItem>Must be remotely controllable once powered on.</RuleItem>
                      <RuleItem>Must not pose hazard to others.</RuleItem>
                      <RuleItem>Damage must be limited to the opposing robot.</RuleItem>
                      <RuleItem>Robots obstructing audience view will be disqualified.</RuleItem>
                      <RuleItem>All robots must pass technical inspection before combat.</RuleItem>
                      <RuleItem>Must prevent radio frequency conflicts.</RuleItem>
                      <RuleItem>Full disclosure of operating principles is required.</RuleItem>
                      <RuleItem>No weapons using electricity, liquids, explosives, projectiles, lasers, or entanglers.</RuleItem>
                      <RuleItem>Sharp weapon edges must be covered outside the arena.</RuleItem>
                    </SubSection>

                    <SubSection title="Heavy Weight">
                      <RuleItem>Weight must not exceed 20kg.</RuleItem>
                      <RuleItem>Dimensions within 45 cm × 45 cm (L x W).</RuleItem>
                      <RuleItem>Can expand to 60cm after battle starts.</RuleItem>
                    </SubSection>

                    <SubSection title="Light Weight">
                      <RuleItem>Weight must not exceed 2.5kg.</RuleItem>
                      <RuleItem>Dimensions within 25 cm × 25 cm (L x W).</RuleItem>
                      <RuleItem>Can expand to 35cm after battle starts.</RuleItem>
                    </SubSection>
                  </div>
                </div>

                {/* 3. Safety Requirements */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
                    3. Safety Requirements
                  </h3>
                  <ul className="space-y-5 text-zinc-400 list-none">
                    <RuleItem accent>Entrants must pass safety and technical inspections.</RuleItem>
                    <RuleItem accent>No fluid or gas leaks allowed.</RuleItem>
                    <RuleItem accent>Operators must avoid entering the combat zone.</RuleItem>
                    <RuleItem accent>Sharp edges must be covered outside the arena.</RuleItem>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center pt-16">
                <button className="bg-[#004491] text-white px-10 py-4 font-bold hover:bg-[#002d5e] transition-colors border border-[#004491] uppercase tracking-widest text-sm">
                  Full Guidelines
                </button>
              </div>
            </div>

            {/* ROBOT GAMES SECTION */}
            <div>
              <div className="mb-16 text-center flex flex-col items-center">
                <h2 className="text-4xl font-black text-white uppercase tracking-widest">
                  ROBOT GAMES
                </h2>
                <div className="h-[3px] w-16 bg-[#004491] mt-6 mb-6" />
                <p className="text-zinc-300 text-lg">
                  Test your processing power and agility.
                </p>
              </div>

              <div className="text-[#00d2ff] font-bold uppercase tracking-[0.2em] text-xs mb-8 border-b border-[#111] pb-4">
                CHALLENGE RULES &amp; REGULATIONS
              </div>

              <div className="space-y-12 border-l-2 border-[#00d2ff] pl-8 py-2">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
                    1. General Category Rules
                  </h3>
                  <ul className="space-y-5 text-zinc-400 list-none mb-6">
                    <RuleItem accent>[Dummy Rule] All participants must adhere to the standard operating procedures.</RuleItem>
                    <RuleItem accent>[Dummy Rule] Robots must complete the obstacle course within 5 minutes.</RuleItem>
                    <RuleItem accent>[Dummy Rule] Autonomous navigation is required for section B of the track.</RuleItem>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
