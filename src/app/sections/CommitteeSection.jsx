import Image from "next/image";

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
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-[32px] leading-[1.2] font-semibold tracking-[-0.02em] text-white uppercase tracking-widest">
            ORGANIZING COMMITTEE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.email}
              className="bg-[#0a0a0a] border border-outline-variant p-6 hover:bg-[#111] transition-colors group text-center flex flex-col items-center rounded-xl"
            >
              <div className="h-40 w-full mb-4 relative flex items-center justify-center">
                <img
                  alt={member.name}
                  className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  src={member.image}
                />
              </div>

              <div className="bg-[#0066ff] text-white px-5 py-1.5 font-bold text-[10px] tracking-widest uppercase rounded-full mb-3">
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
