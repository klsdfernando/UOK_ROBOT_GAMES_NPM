import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";

const members = [
  {
    name: "DR KASUN PIYUMAL",
    role: "SENIOR TREASURER",
    image: "https://robotbattles.ecsc-uok.com/People/TR.png",
    email: "kasunp@kln.ac.lk",
  },
  {
    name: "SUPUN THARAKA",
    role: "PROJECT MANAGER",
    image: "https://robotbattles.ecsc-uok.com/People/PM1.png",
    phone: "+94 76 131 2170",
    email: "tharaka-ec21028@stu.kln.ac.lk",
  },
  {
    name: "MANEESHA GUNARATHNA",
    role: "PROJECT MANAGER",
    image: "https://robotbattles.ecsc-uok.com/People/PM2.png",
    phone: "+94 77 109 2426",
    email: "gunarat-ec21026@stu.kln.ac.lk",
  },
  {
    name: "KAVINDU PABASARA",
    role: "PROJECT MANAGER",
    image: "https://robotbattles.ecsc-uok.com/People/PM3.png",
    phone: "+94 71 866 9299",
    email: "bandara-ec21031@stu.kln.ac.lk",
  },
  {
    name: "CHAMODA DASANAYAKE",
    role: "ER COORDINATOR",
    image: "https://robotbattles.ecsc-uok.com/People/ER1.png",
    phone: "+94 70 494 9802",
    email: "dasanay-ec21074@stu.kln.ac.lk",
  },
  {
    name: "VISHWA RAJARATHNE",
    role: "ER COORDINATOR",
    image: "https://robotbattles.ecsc-uok.com/People/ER2.png",
    phone: "+94 71 076 9883",
    email: "rajarat-ec21009@stu.kln.ac.lk",
  },
];

export default function CommitteeSection() {
  return (
    <section className="py-24 px-8 bg-[#080808] border-y border-outline-variant">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="ORGANIZING COMMITTEE" 
          subtitle="Meet the dedicated team operating behind the scenes of the ultimate robotics festival." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.email}
              className="bg-[#0a0a0a] border border-outline-variant p-6 md:p-8 hover:bg-[#111] transition-colors group text-center flex flex-col items-center rounded-xl"
            >
              <div className="h-36 w-36 mb-6 rounded-full overflow-hidden border-[3px] border-[#1a1c33] bg-[#050505] shadow-[0_0_30px_rgba(0,0,0,0.8)] relative flex items-center justify-center group-hover:border-[#0055cc]/70 transition-colors duration-500 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0055cc]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 relative z-0 mt-2"
                  src={member.image}
                />
              </div>

              <div className="bg-[#0055cc]/20 border border-[#00d2ff]/30 text-[#00d2ff] px-5 py-1.5 font-bold text-[10px] tracking-[0.15em] uppercase rounded-full mb-4">
                {member.role}
              </div>

              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
                {member.name}
              </h3>

              <div className="flex flex-col gap-2 w-full mt-auto">
                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-2 text-white hover:text-[#00d2ff] transition-colors text-sm font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#0066ff]">
                      call
                    </span>
                    {member.phone}
                  </a>
                )}
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center gap-2 text-white hover:text-[#00d2ff] transition-colors text-sm font-bold"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#0066ff]">
                    mail
                  </span>
                  {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
