import Link from "next/link";

export default function MerchMarqueeTicker() {
  return (
    <div className="w-full bg-black/80 border-t border-b border-[#00d2ff]/20 backdrop-blur-sm overflow-hidden py-2 select-none">
      <Link
        href="/tshirt"
        className="group block transition-colors hover:text-white"
      >
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {/* Render repeating items for continuous smooth loop */}
          {[0, 1, 2, 3].map((copyIdx) => (
            <div key={copyIdx} className="flex items-center shrink-0">
              {[0, 1, 2].map((itemIdx) => (
                <div key={itemIdx} className="flex items-center mx-6 sm:mx-10">
                  <span className="text-[13px] sm:text-[14px] tracking-[0.08em] font-medium text-white/90">
                    The official merch{" "}
                    <span className="text-[#00d2ff] font-bold">2K26</span>{" "}
                    now available for{" "}
                    <span className="text-[#38bdf8] font-semibold underline underline-offset-4 decoration-[#00d2ff]/40 group-hover:decoration-[#00d2ff]">
                      pre-order
                    </span>
                  </span>
                  <span className="mx-6 sm:mx-10 text-[#00d2ff]/50 text-xs select-none">
                    •
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}

