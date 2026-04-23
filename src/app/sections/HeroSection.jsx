import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[819px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="/images/arena-battle.png"
          alt="Cinematic dark combat robot in arena"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Huge Background Text */}
        <div className="absolute inset-0 flex items-center justify-center select-none z-0 pointer-events-none mt-12">
          <span className="text-[250px] md:text-[480px] font-black text-white/10 tracking-tighter leading-none">
            2K26
          </span>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#1a8bff]/60" />
            <p
              className="text-[#1a8bff] font-bold tracking-[0.3em] uppercase text-xs md:text-sm"
              style={{ textShadow: "0 0 10px rgba(26,139,255,0.3)" }}
            >
              GREATNESS SHOWS NO MERCY
            </p>
            <div className="h-[2px] w-12 bg-[#1a8bff]/60" />
          </div>

          <h1 className="flex flex-col items-center mb-16">
            <span
              className="text-[#0055cc]/50 font-black text-[120px] md:text-[180px] leading-none tracking-normal"
              style={{ WebkitTextStroke: "3px #0055cc" }}
            >
              UOK
            </span>
            <span className="text-white font-black text-[55px] md:text-[95px] leading-none tracking-[0.05em] uppercase -mt-2">
              ROBOT GAMES
            </span>
          </h1>

          <button className="border border-[#1a8bff] rounded-full px-12 py-4 bg-[#1a8bff]/5 text-white font-bold text-sm tracking-[0.15em] hover:bg-[#1a8bff]/15 shadow-[0_0_20px_rgba(26,139,255,0.15)] hover:shadow-[0_0_30px_rgba(26,139,255,0.4)] transition-all uppercase">
            JOIN THE BATTLE
          </button>
        </div>
      </div>
    </section>
  );
}
