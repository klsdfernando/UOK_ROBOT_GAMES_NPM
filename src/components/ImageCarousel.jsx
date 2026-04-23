"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageCarousel({
  images = [],
  interval = 5000,
  label = "ARCHIVE VISUALS",
  title = "Event Highlights",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative h-[500px] rounded-xl overflow-hidden border border-zinc-800/50 group shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 w-full h-full bg-zinc-900">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt || `Slide ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`carousel-slide absolute inset-0 object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out ${
              i === currentIndex ? "opacity-80 z-[1]" : "opacity-0 z-0"
            }`}
            priority={i === 0}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-[2]" />
      <div className="absolute bottom-8 left-8 flex flex-col z-[3]">
        <span className="text-[11px] font-bold text-[#00d2ff] tracking-[0.2em] uppercase mb-1">
          {label}
        </span>
        <span className="text-2xl font-semibold text-white">{title}</span>
      </div>
    </div>
  );
}
