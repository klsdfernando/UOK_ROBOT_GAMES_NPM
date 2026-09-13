import Link from "next/link";

export default function MerchMarqueeTicker() {
  const items = [
    "THE OFFICIAL MERCH 2K26 NOW AVAILABLE FOR PRE-ORDER",
    "LIMITED EDITION COMBAT T-SHIRTS",
    "CUSTOM SIZES XS TO 3XL",
    "GET YOURS NOW BEFORE STOCKS RUN OUT",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black/90 border-y border-[#00d2ff]/25 backdrop-blur-md py-2.5 z-20 group">
      {/* Subtle background glow accents */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#004491]/10 via-[#00d2ff]/10 to-[#004491]/10 pointer-events-none" />
      
      {/* Side gradient fade masks for smooth transition */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

      <Link
        href="/tshirt"
        className="block transition-opacity hover:opacity-95"
        title="Pre-order Official UOK Robot Games 2K26 T-Shirt"
      >
        <div className="animate-marquee flex items-center select-none cursor-pointer">
          {/* Loop twice for seamless infinite scroll */}
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex items-center shrink-0">
              {items.map((text, idx) => (
                <div key={idx} className="flex items-center mx-5 sm:mx-8">
                  {/* Cyber glowing spark / diamond icon */}
                  <span className="material-symbols-outlined text-[#00d2ff] text-sm sm:text-base mr-3 shrink-0 animate-pulse">
                    app_badging
                  </span>

                  <span className="text-[11px] sm:text-[13px] font-mono tracking-[0.18em] font-semibold text-white/90 uppercase whitespace-nowrap">
                    {text.includes("PRE-ORDER") ? (
                      <>
                        The official merch{" "}
                        <span className="text-[#00d2ff] font-extrabold drop-shadow-[0_0_8px_rgba(0,210,255,0.7)]">
                          2K26
                        </span>{" "}
                        now available for{" "}
                        <span className="text-[#00d2ff] font-bold underline underline-offset-4 decoration-[#00d2ff]/60">
                          pre-order
                        </span>
                      </>
                    ) : (
                      <span className="text-zinc-300">
                        {text}{" "}
                        <span className="text-[#7dd3fc]">★</span>
                      </span>
                    )}
                  </span>

                  {/* Micro badge indicator */}
                  {text.includes("PRE-ORDER") && (
                    <span className="ml-3 px-2 py-0.5 text-[9px] font-mono font-black tracking-widest text-[#00d2ff] bg-[#00d2ff]/10 border border-[#00d2ff]/40 rounded-full shadow-[0_0_8px_rgba(0,210,255,0.25)]">
                      LKR 1,900
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
