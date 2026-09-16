"use client";

import Image from "next/image";
import Link from "next/link";

export default function AnnouncementsClientView({ initialAnnouncements = [] }) {
  const announcements = initialAnnouncements;

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Home
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-[#5b9aff]">Announcements</span>
        </div>

        {/* Hero Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004491]/20 border border-[#004491]/40 text-[#5b9aff] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(0,68,145,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5b9aff] animate-pulse" />
            Official Dispatches
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase mb-4 leading-tight">
            Tournament Announcements
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
            Stay updated with official notices, workshop links, timeline updates,
            and key competition dispatches from UOK Robot Games 2K26.
          </p>
        </div>

        {/* Empty State */}
        {announcements.length === 0 && (
          <div className="py-20 text-center bg-[#0e0f1a]/50 border border-white/[0.06] rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-zinc-500">
              <span className="material-symbols-outlined text-3xl">campaign</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Announcements Yet</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              No official announcements have been published yet. Please check back later!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#004491] hover:bg-[#004491]/80 text-white text-xs font-bold tracking-wider uppercase transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Home
            </Link>
          </div>
        )}

        {/* Announcements Grid */}
        {announcements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={`/announcements/${item.id}`}
                className="group border border-white/[0.08] bg-[#0a0a0a] rounded-2xl overflow-hidden hover:border-white/[0.18] hover:shadow-[0_0_25px_rgba(0,68,145,0.25)] transition-all duration-500 flex flex-col relative no-underline"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Cover Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-950">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                      <span className="material-symbols-outlined text-4xl">campaign</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                  {/* Category Tag badge */}
                  {item.tag && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1.5 bg-[#004491]/80 backdrop-blur-sm text-[10px] font-bold tracking-[0.15em] text-white uppercase rounded-md border border-white/10">
                        {item.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
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

                  {/* Read more button */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06]">
                    <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] text-[#5b9aff] uppercase group-hover:gap-3 transition-all duration-300">
                      READ ARTICLE
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
