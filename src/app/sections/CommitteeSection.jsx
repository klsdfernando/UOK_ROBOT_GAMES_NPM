import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";

const members = [
  {
    name: "DR KASUN PIYUMAL",
    role: "SENIOR TREASURER",
    image: "https://ik.imagekit.io/wfnazmyxh/ROBOT%20Games%20OC/TR.png",
    email: "kasunp@kln.ac.lk",
    zoom: 1,       // ← change this to zoom in/out (e.g. 1.2 = 120%, 0.8 = 80%)
  },
  {
    name: "THIVINA LIYANAGE",
    role: "PROJECT MANAGER",
    image: "https://ik.imagekit.io/wfnazmyxh/ROBOT%20Games%20OC/thivina.png",
    phone: "+94 76 307 4621",
    email: "chandun-ec22058@stu.kln.ac.lk",
    zoom: 1.6,
  },
  {
    name: "DILHARA BANDARA",
    role: "PROJECT MANAGER",
    image: "https://ik.imagekit.io/wfnazmyxh/ROBOT%20Games%20OC/dilhara.png",
    phone: "+94 70 389 2138",
    email: "bandara-ec22037@stu.kln.ac.lk",
    zoom: 1.6,
  },
  {
    name: "ARUNA KAUSHALYA",
    role: "PROJECT MANAGER",
    image: "https://ik.imagekit.io/wfnazmyxh/ROBOT%20Games%20OC/aruna.png",
    phone: "+94 78 885 5693",
    email: "samaraw-ec22004@stu.kln.ac.lk",
    zoom: 1.45,
  },
  {
    name: "CHARITH SENEVIRATNE",
    role: "ER COORDINATOR",
    image: "https://ik.imagekit.io/wfnazmyxh/ROBOT%20Games%20OC/charith.png",
    phone: "+94 71 386 6650",
    email: "tmcjsen-ec22066@stu.kln.ac.lk",
    zoom: 1.6,
  },
  {
    name: "PASINDU CHAMIKA",
    role: "ASSISTANT TECHNICAL COORDINATOR",
    image: "https://ik.imagekit.io/wfnazmyxh/ROBOT%20Games%20OC/pasindu.png",
    phone: "+94 71 642 1543",
    email: "dayarat-ec23039@stu.kln.ac.lk",
    zoom: 1.6,
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
                  style={{ transform: `scale(${member.zoom || 1})` }}
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
