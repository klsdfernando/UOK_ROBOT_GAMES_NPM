"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/announcements");
        const data = await res.json();
        if (data.success && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Don't render the section if no announcements
  if (loading) return null;
  if (announcements.length === 0) return null;

  // Display only the latest 3 announcements on the homepage
  const latestAnnouncements = announcements.slice(0, 3);

  return (
    <section className="py-24 px-8 border-t border-outline-variant bg-[#080808]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeader
          title="LATEST ANNOUNCEMENTS"
          subtitle="Stay updated with the latest news, notices, and updates from UOK Robot Games."
        />

        <div
          className={`grid grid-cols-1 ${
            latestAnnouncements.length >= 2 ? "md:grid-cols-2" : ""
          } ${latestAnnouncements.length >= 3 ? "lg:grid-cols-3" : ""} gap-6 w-full`}
        >
          {latestAnnouncements.map((item) => (
            <Link
              key={item.id}
              href={`/announcements/${item.id}`}
              className="group border border-white/[0.08] bg-[#0a0a0a] rounded-2xl overflow-hidden hover:border-white/[0.15] hover:shadow-[0_0_25px_rgba(0,68,145,0.2)] transition-all duration-500 flex flex-col relative no-underline"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {/* Image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-950">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                    <span className="material-symbols-outlined text-4xl">campaign</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                {/* Tag badge */}
                {item.tag && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-[#004491]/80 backdrop-blur-sm text-[10px] font-bold tracking-[0.15em] text-white uppercase rounded-md border border-white/10">
                      {item.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Date */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[14px] text-zinc-600">
                    schedule
                  </span>
                  <time className="text-[11px] font-bold tracking-[0.1em] text-zinc-500 uppercase">
                    {(item.date || item.createdAt)
                      ? new Date(item.date || item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </time>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-[#5b9aff] transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-zinc-500 leading-relaxed flex-grow line-clamp-3">
                  {item.excerpt}
                </p>

                {/* Read more */}
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] text-[#5b9aff] uppercase group-hover:gap-3 transition-all duration-300">
                    READ MORE
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All / Show More Button */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/announcements"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#004491]/15 hover:bg-[#004491]/30 border border-[#004491]/60 hover:border-[#5b9aff] text-[#5b9aff] hover:text-white font-bold text-xs tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,68,145,0.15)] hover:shadow-[0_0_30px_rgba(0,68,145,0.4)]"
          >
            <span>
              {announcements.length > 3 ? "SHOW MORE ANNOUNCEMENTS" : "VIEW ALL ANNOUNCEMENTS"}
            </span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-300">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
