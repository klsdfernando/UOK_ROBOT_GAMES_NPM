"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import SectionHeader from "@/components/SectionHeader";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

export default function ParallaxGallery({ initialImages }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Shuffle images on the client to avoid hydration mismatch
    const shuffled = [...initialImages].sort(() => Math.random() - 0.5);
    setImages(shuffled);
  }, [initialImages]);

  return (
    <div className="relative w-full overflow-hidden bg-[#000000] py-20 min-h-[800px] flex flex-col items-center justify-center">
      {/* 3D Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00d2ff 1px, transparent 1px),
            linear-gradient(to bottom, #00d2ff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center',
          transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-50px)',
          transformOrigin: 'top center',
        }}
      />
      
      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none z-0" />

      {/* Header matching original site UI */}
      <SectionHeader 
        title="PHOTO SHOWCASE" 
        subtitle="Witness the carnage. The steel. The glory."
      />

      {/* Carousel */}
      <div className="relative w-full max-w-[1400px] mx-auto z-10 px-0 sm:px-4 group overflow-hidden">
        {images.length > 0 && (
          <Swiper
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
                }
              },
              768: {
                coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 350,
                  modifier: 1.5,
                  slideShadows: true,
                }
              }
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
            {images.map((img, index) => (
              <SwiperSlide 
                key={index} 
                className="!w-[80vw] sm:!w-[350px] md:!w-[700px] !h-[55vw] sm:!h-[250px] md:!h-[450px] rounded-xl overflow-hidden border border-[#00d2ff]/40 shadow-[0_0_30px_rgba(0,210,255,0.15)] bg-[#080808]"
              >
                <Image
                  src={img}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 350px, 700px"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none flex items-end p-4 md:p-8">
                  <div className="text-[#00d2ff] font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    FILE_{index.toString().padStart(3, '0')} // ARCHIVE
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
