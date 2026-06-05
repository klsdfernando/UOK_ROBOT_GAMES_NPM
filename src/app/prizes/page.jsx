import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import FadeIn from "@/components/FadeIn";
import CountUp from "@/components/CountUp";

export const metadata = {
  title: "Prizes",
  description: "Prize pools and rewards for UOK Robot Games 2K26 competitions.",
};

function PrizeCard({ title, bgColor, shadowColor, hoverShadow, textColor, amount }) {
  return (
    <div
      className={`border ${bgColor} shadow-[0_0_20px_${shadowColor}] hover:shadow-[0_0_20px_${hoverShadow}] transition-shadow duration-300 p-6 flex flex-col items-center justify-center w-full relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${bgColor.replace("border", "from").replace("/40", "/10")} to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
      <h4
        className={`text-xl ${textColor} uppercase font-black tracking-widest mb-2 z-10`}
        style={{ textShadow: `0 0 15px ${shadowColor}` }}
      >
        {title}
      </h4>
      <div className="text-white font-bold text-lg tracking-widest uppercase text-center z-10">
        {amount}
      </div>
    </div>
  );
}

function BattleCategoryCard({ title, winnerAmount, winnerExtra, runnerUp1, runnerUp2, order }) {
  return (
    <div className={`bg-[#0b0c16] border border-[#1a1c33] p-10 flex flex-col items-center justify-between text-center relative overflow-hidden group shadow-[0_0_30px_rgba(0,102,255,0.05)] ${order}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent opacity-50" />
      <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-widest leading-tight">{title}</h3>
      <div className="w-full flex flex-col items-center space-y-4 pt-4">
        {/* Winner */}
        <div className="border border-[#ffd700]/40 bg-[#ffd700]/5 shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] transition-shadow duration-300 p-6 flex flex-col items-center justify-center w-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="h-40 w-40 mb-6 relative flex items-center justify-center z-10">
            <Image
              alt="Champion Nut"
              src="https://ik.imagekit.io/wfnazmyxh/images/nut.png?updatedAt=1777697856490"
              width={160}
              height={160}
              className="h-full object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            />
          </div>
          <h4 className="text-2xl text-[#ffd700] uppercase font-black tracking-widest mb-2 z-10" style={{ textShadow: "0 0 15px rgba(255,215,0,0.5)" }}>
            WINNER
          </h4>
          <div className="text-white font-bold text-xl tracking-widest uppercase text-center z-10">{winnerAmount}</div>
          {winnerExtra && <div className="text-[#ffd700]/70 font-bold text-xs tracking-widest uppercase mt-2 z-10">{winnerExtra}</div>}
        </div>

        <div className="flex justify-between w-full gap-4">
          {/* 1st Runner Up */}
          <div className="border border-[#c0c0c0]/40 bg-[#c0c0c0]/5 shadow-[0_0_20px_rgba(192,192,192,0.1)] hover:shadow-[0_0_20px_rgba(192,192,192,0.25)] transition-shadow duration-300 p-4 flex flex-col items-center justify-center w-1/2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#c0c0c0]/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            <h5 className="text-[#e2e8f0] text-[11px] uppercase font-black tracking-widest mb-2 z-10 text-center" style={{ textShadow: "0 0 12px rgba(192,192,192,0.5)" }}>
              1ST RUNNER UP
            </h5>
            <div className="text-white font-bold text-base tracking-widest uppercase text-center z-10">{runnerUp1}</div>
          </div>
          {/* 2nd Runner Up */}
          <div className="border border-[#cd7f32]/40 bg-[#cd7f32]/5 shadow-[0_0_20px_rgba(205,127,50,0.1)] hover:shadow-[0_0_20px_rgba(205,127,50,0.25)] transition-shadow duration-300 p-4 flex flex-col items-center justify-center w-1/2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#cd7f32]/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            <h5 className="text-[#fba863] text-[11px] uppercase font-black tracking-widest mb-2 z-10 text-center" style={{ textShadow: "0 0 12px rgba(205,127,50,0.5)" }}>
              2ND RUNNER UP
            </h5>
            <div className="text-white font-bold text-base tracking-widest uppercase text-center z-10">{runnerUp2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RaceCategoryCard({ title, winnerAmount, runnerUp1 }) {
  return (
    <div className="bg-[#0b0c16] border border-[#1a1c33] p-10 flex flex-col items-center justify-between text-center relative overflow-hidden group shadow-[0_0_30px_rgba(0,102,255,0.05)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent opacity-50" />
      <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-widest leading-tight">{title}</h3>
      <div className="w-full flex flex-col xl:flex-row justify-center gap-4 pt-4">
        {/* Winner */}
        <div className="border border-[#ffd700]/40 bg-[#ffd700]/5 shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] transition-shadow duration-300 p-6 flex flex-col items-center justify-center w-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          <h4 className="text-xl text-[#ffd700] uppercase font-black tracking-widest mb-2 z-10" style={{ textShadow: "0 0 15px rgba(255,215,0,0.5)" }}>
            WINNER
          </h4>
          <div className="text-white font-bold text-lg tracking-widest uppercase text-center z-10">{winnerAmount}</div>
        </div>
        {/* 1st Runner Up */}
        <div className="border border-[#c0c0c0]/40 bg-[#c0c0c0]/5 shadow-[0_0_20px_rgba(192,192,192,0.1)] hover:shadow-[0_0_20px_rgba(192,192,192,0.25)] transition-shadow duration-300 p-6 flex flex-col items-center justify-center w-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c0c0c0]/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          <h5 className="text-[#e2e8f0] text-sm uppercase font-black tracking-widest mb-2 z-10 text-center" style={{ textShadow: "0 0 12px rgba(192,192,192,0.5)" }}>
            1ST RUNNER UP
          </h5>
          <div className="text-white font-bold text-lg tracking-widest uppercase text-center z-10">{runnerUp1}</div>
        </div>
      </div>
    </div>
  );
}

export default function PrizesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Robot Battles Prizes */}
        <section id="prizes" className="py-24 px-8 border-t border-outline-variant bg-[#080808]">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <FadeIn direction="up">
              <SectionHeader title="ROBOT BATTLES" subtitle="Glory and rewards await the champions of the arena." />
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <FadeIn direction="up" delay={0.2} className="w-full">
                <BattleCategoryCard
                  title={<>Heavy Weight<br />Category</>}
                  winnerAmount="LKR 75,000"
                  winnerExtra="+ GIANT NUT"
                  runnerUp1="LKR 50,000"
                  runnerUp2="LKR 30,000"
                  order="order-1"
                />
              </FadeIn>
              <FadeIn direction="up" delay={0.4} className="w-full">
                <BattleCategoryCard
                  title={<>Light Weight<br />Category (Open)</>}
                  winnerAmount="LKR 30,000"
                  winnerExtra="+ GIANT NUT"
                  runnerUp1="LKR 20,000"
                  runnerUp2="LKR 10,000"
                  order="order-2"
                />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Robot Race Prizes */}
        <section id="robot-race" className="py-24 px-8 border-t border-outline-variant bg-[#040404]">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <FadeIn direction="up">
              <SectionHeader title="ROBOT RACE" subtitle="Speed and precision take the ultimate prize." />
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <FadeIn direction="up" delay={0.2} className="w-full">
                <RaceCategoryCard title={<>University<br />Category</>} winnerAmount="LKR 30,000" runnerUp1="LKR 20,000" />
              </FadeIn>
              <FadeIn direction="up" delay={0.4} className="w-full">
                <RaceCategoryCard title={<>School<br />Category</>} winnerAmount="LKR 20,000" runnerUp1="LKR 15,000" />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Grand Total */}
        <FadeIn direction="up" viewAmount={0.5}>
          <div className="w-full bg-[#040404] border-t border-b border-outline-variant py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00e5ff]/5 to-transparent" />
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center relative z-10 px-4 text-center space-y-2">
              <h2 className="text-lg md:text-xl text-zinc-400 uppercase tracking-[0.2em] font-medium">
                GRAND TOTAL PRIZE POOL
              </h2>
              <div
                className="text-6xl md:text-8xl font-black text-[#00e5ff] tracking-tighter pt-2 pb-4"
                style={{ textShadow: "0 0 15px rgba(0,229,255,0.4)" }}
              >
                <CountUp target={300000} duration={1500} prefix="Rs. " />
              </div>
              <p className="text-xl md:text-2xl text-zinc-400">
                Plus certificates, trophies, and special awards
              </p>
            </div>
          </div>
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
