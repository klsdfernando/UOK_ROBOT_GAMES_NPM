import SectionHeader from "@/components/SectionHeader";

const timelineStages = [
  {
    phase: "PHASE_01 // UPLINK",
    title: "REGISTRATION OPENING",
    date: "1ST OF MAY",
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
    phase: "PHASE_02 // TRAINING",
    title: "ROBOT BATTLE WORKSHOP",
    date: "10TH OF JUNE",
    side: "right",
    active: false,
    content: { type: "locked", text: "ZOOM LINK LOCKED", icon: "link_off" },
  },
  {
    phase: "PHASE_03 // DEADLINE",
    title: "REGISTRATION CLOSING",
    date: "20TH OF JUNE",
    side: "left",
    active: false,
    content: { type: "info", text: "SUBMISSIONS LOCKED" },
  },
  {
    phase: "PHASE_04 // PREPARATION",
    title: "ROBOT GAMES WORKSHOP",
    date: "22ND OF AUGUST",
    side: "right",
    active: false,
    content: { type: "locked", text: "ZOOM LINK LOCKED", icon: "link_off" },
  },
  {
    phase: "PHASE_05 // BRIEFING",
    title: "AWARENESS SESSION",
    date: "12TH OF SEPTEMBER",
    side: "left",
    active: false,
    content: { type: "locked", text: "ZOOM LINK LOCKED", icon: "link_off" },
  },
  {
    phase: "PHASE_06 // APEX",
    title: "ROBOT GAMES 2K26",
    date: "19TH OF SEPTEMBER",
    side: "right",
    active: false,
    content: { type: "info", text: "MAIN EVENT LOCKED" },
  },
];

function TimelineContent({ content, active }) {
  if (content.type === "action" && active) {
    return (
      <div className="bg-[#131313] p-6 border border-outline-variant hover:border-[#00d2ff]/50 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-[2px] bg-[#00d2ff]" />
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          {content.text}
        </p>
        <button className="flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff] text-[#00d2ff] px-6 py-2 font-bold text-[10px] tracking-widest uppercase hover:bg-[#00d2ff]/20 transition-colors">
          <span className="material-symbols-outlined text-[14px]">
            {content.buttonIcon}
          </span>
          {content.buttonText}
        </button>
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
  return (
    <section className="py-24 px-8 border-t border-outline-variant bg-[#080808]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeader
          title="TOURNAMENT SCHEDULE"
          subtitle="Critical milestones for the UOK Robot Games. All teams must adhere to the sequence."
        />

        {/* Vertical Timeline */}
        <div className="relative w-full max-w-4xl mx-auto flex py-12 pl-4 md:pl-0">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-outline-variant transform md:-translate-x-1/2 z-0">
            <div className="absolute top-0 w-full h-1/6 bg-gradient-to-b from-[#00d2ff] to-transparent shadow-[0_0_15px_rgba(0,210,255,0.8)] z-10" />
          </div>

          <div className="flex flex-col gap-24 w-full relative z-10">
            {timelineStages.map((stage, i) => {
              const isLeft = stage.side === "left";
              return (
                <div
                  key={i}
                  className={`flex flex-col ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } items-start md:items-center w-full group relative`}
                >
                  {/* Horizontal connector (desktop) */}
                  <div
                    className={`hidden md:block absolute top-1/2 ${
                      isLeft ? "left-1/2" : "right-1/2"
                    } w-1/4 h-[2px] bg-outline-variant transform -translate-y-1/2 ${
                      isLeft ? "-translate-x-full" : "translate-x-full"
                    } ${
                      stage.active
                        ? "group-hover:bg-[#00d2ff] transition-colors duration-500"
                        : ""
                    }`}
                  />

                  {/* Label side */}
                  <div
                    className={`md:w-1/2 ${
                      isLeft
                        ? "md:pr-16 text-left md:text-right"
                        : "md:pl-16 text-left"
                    } mb-4 md:mb-0 ml-16 md:ml-0 flex flex-col ${
                      isLeft ? "items-start md:items-end" : "items-start"
                    } justify-center ${
                      stage.active ? "" : "opacity-50"
                    } md:-translate-y-2`}
                  >
                    <div
                      className={`font-bold text-xs ${
                        stage.active
                          ? "text-[#00d2ff]"
                          : "text-outline"
                      } tracking-[0.1em] uppercase mb-1`}
                    >
                      {stage.phase}
                    </div>
                    <div className="text-2xl font-bold text-white uppercase">
                      {stage.title}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`px-2 py-1 ${
                          stage.active
                            ? "bg-[#131313] border-outline-variant text-[#00d2ff]"
                            : "bg-black border-outline-variant text-outline"
                        } border text-[10px] font-bold tracking-widest rounded-sm`}
                      >
                        {stage.date}
                      </span>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div
                    className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-black border-2 ${
                      stage.active
                        ? "border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                        : "border-outline-variant"
                    } flex items-center justify-center z-20`}
                  >
                    {stage.active && (
                      <div className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                    )}
                  </div>

                  {/* Content side */}
                  <div
                    className={`md:w-1/2 ${
                      isLeft ? "md:pl-16" : "md:pr-16"
                    } ml-16 md:ml-0 w-full pr-6 md:pr-0 ${
                      stage.active ? "" : "opacity-50"
                    }`}
                  >
                    <TimelineContent
                      content={stage.content}
                      active={stage.active}
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
