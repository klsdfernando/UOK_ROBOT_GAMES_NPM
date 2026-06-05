"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import SectionHeader from "@/components/SectionHeader";

import "swiper/css";
import "swiper/css/effect-coverflow";

export default function GallerySections({ sections }) {
  const [activeTab, setActiveTab] = useState(sections[0]?.id || "");
  const [shuffledMap, setShuffledMap] = useState({});

  useEffect(() => {
    // Shuffle images for each section on mount
    const map = {};
    sections.forEach((s) => {
      map[s.id] = [...s.images].sort(() => Math.random() - 0.5);
    });
    setShuffledMap(map);
  }, [sections]);

  const activeSection = sections.find((s) => s.id === activeTab);
  const activeImages = shuffledMap[activeTab] || [];

  return (
    <div className="relative w-full overflow-hidden bg-[#080808] py-24 min-h-[800px] flex flex-col items-center border-t border-outline-variant">
      {/* Header */}
      <SectionHeader
        title="PHOTO SHOWCASE"
        subtitle="Witness the carnage. The steel. The glory."
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-12 px-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`
              relative px-5 sm:px-7 py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold
              transition-all duration-300 border rounded-full
              ${activeTab === s.id
                ? "bg-[#004491]/15 text-[#5b9aff] border-[#004491]/40 shadow-[0_0_20px_rgba(0,68,145,0.15)]"
                : "bg-transparent text-zinc-600 border-white/[0.06] hover:text-zinc-400 hover:border-white/[0.12]"
              }
            `}
          >
            {activeTab === s.id && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#5b9aff] animate-pulse" />
            )}
            <span className={activeTab === s.id ? "ml-2" : ""}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative w-full max-w-[1400px] mx-auto z-10 px-0 sm:px-4 group overflow-hidden">
        {activeImages.length > 0 && (
          <Swiper
            key={activeTab}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 150,
                  modifier: 1,
                  slideShadows: true,
                },
              },
              768: {
                coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 350,
                  modifier: 1.5,
                  slideShadows: true,
                },
              },
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: true,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="w-full !py-10 md:!py-16"
          >
            {activeImages.map((img, index) => (
              <SwiperSlide
                key={index}
                className="!w-[80vw] sm:!w-[350px] md:!w-[700px] !h-[55vw] sm:!h-[250px] md:!h-[450px] rounded-xl overflow-hidden border border-[#1a1c33] shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-[#050505]"
              >
                <Image
                  src={img}
                  alt={`${activeSection?.label || "Gallery"} Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 350px, 700px"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none flex items-end p-4 md:p-8">
                  <div className="text-[#00d2ff] font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    {activeSection?.label} // FILE_{index.toString().padStart(3, "0")}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
