const categories = [
  {
    title: "Robot",
    highlight: "Battles",
    icon: "shield",
    features: [
      {
        icon: "fitness_center",
        title: "Weight Divisions",
        desc: "Heavy-Weight (20KG) & Light-Weight (2.5KG)",
      },
      {
        icon: "local_fire_department",
        title: "Combat Objective",
        desc: "Disable opponent or push them into the pit",
      },
    ],
    buttonText: "DOWNLOAD BATTLE RULES",
  },
  {
    title: "Robot",
    highlight: "Race",
    icon: "route",
    features: [
      {
        icon: "flag",
        title: "Task-Based Path",
        desc: "Line following, pick & place, and wall navigation",
      },
      {
        icon: "memory",
        title: "Technical Focus",
        desc: "Programming, control systems, and automation",
      },
    ],
    buttonText: "DOWNLOAD RACE RULES",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="mb-16 relative z-10 text-center flex flex-col items-center">
        <h2 className="text-[32px] leading-[1.2] font-semibold tracking-[-0.02em] text-white uppercase tracking-widest">
          COMPETITION CATEGORIES
        </h2>
        <div className="h-[3px] w-16 bg-[#004491] mt-2 mb-6" />
        <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl text-center">
          UOK Robot Games offers two distinct categories designed to challenge
          and inspire roboticists at every level (Robot Battles &amp; Robot
          Race).
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {categories.map((cat) => (
          <div
            key={cat.highlight}
            className="border border-white/[0.08] bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col relative overflow-hidden group hover:border-white/[0.15] transition-all duration-500"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-60" />

            {/* Icon Box */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#004491]/10 border border-[#004491]/25 flex items-center justify-center mb-6 md:mb-8">
              <span className="material-symbols-outlined text-[#4a8fe7] text-2xl md:text-3xl">
                {cat.icon}
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-white mb-8 md:mb-10">
              {cat.title}{" "}
              <span className="text-[#4a8fe7]">{cat.highlight}</span>
            </h3>

            <div className="space-y-6 md:space-y-8 flex-grow mb-10 md:mb-12">
              {cat.features.map((feat) => (
                <div key={feat.title} className="flex items-start gap-3 md:gap-4">
                  <span className="material-symbols-outlined text-zinc-400 text-base md:text-lg mt-0.5 bg-white/[0.04] border border-white/[0.06] rounded-lg p-2 shrink-0">
                    {feat.icon}
                  </span>
                  <div>
                    <h4 className="text-white font-bold text-base md:text-lg mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 md:py-4 px-2 md:px-0 border border-white/[0.1] rounded-xl text-zinc-300 font-bold tracking-widest uppercase hover:bg-[#004491]/15 hover:border-[#004491]/40 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 text-[10px] sm:text-xs">
              {cat.buttonText}{" "}
              <span className="material-symbols-outlined text-lg md:text-xl">
                download
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
