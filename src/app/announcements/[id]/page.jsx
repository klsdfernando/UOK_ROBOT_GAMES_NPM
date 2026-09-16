import db from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    if (db) {
      const doc = await db.collection('announcements').doc(id).get();
      if (doc.exists) {
        const data = doc.data();
        return {
          title: `${data.title} | Announcements`,
          description: data.excerpt || 'Official tournament announcement from UOK Robot Games 2K26.',
        };
      }
    }
  } catch {}
  return {
    title: 'Tournament Announcement | UOK Robot Games 2K26',
  };
}

export default async function AnnouncementPage({ params }) {
  const { id } = await params;

  let announcement = null;
  try {
    if (db) {
      const doc = await db.collection('announcements').doc(id).get();
      if (doc.exists) {
        announcement = { id: doc.id, ...doc.data() };
      }
    }
  } catch (error) {
    console.error('Error fetching announcement:', error);
  }

  if (!announcement) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 pt-24 pb-20">
          <div className="text-center">
            <span className="material-symbols-outlined text-zinc-600 text-6xl mb-4 block">
              article
            </span>
            <h1 className="text-2xl font-bold text-white mb-2">Announcement Not Found</h1>
            <p className="text-zinc-500 mb-6">This announcement may have been removed or updated.</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004491] text-white font-bold text-xs tracking-wider uppercase hover:bg-[#004491]/80 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                All Announcements
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 font-bold text-xs tracking-wider uppercase hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const displayDate = announcement.date || announcement.createdAt;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#080808]">
        {/* Hero Image */}
        <div className="relative w-full h-[45vh] md:h-[55vh] bg-zinc-950">
          {announcement.imageUrl ? (
            <Image
              src={announcement.imageUrl}
              alt={announcement.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
              <span className="material-symbols-outlined text-6xl">campaign</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/40 to-transparent h-24" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 sm:-mt-40 mb-24">
          {/* Breadcrumb / Back button bar */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/[0.1] hover:border-[#004491]/80 hover:bg-[#004491]/15 rounded-full px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              All Announcements
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.2] rounded-full px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </Link>
          </div>

          <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-6 sm:p-10 md:p-16 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-80" />

            {/* Tag */}
            {announcement.tag && (
              <div className="mb-6 flex justify-start">
                <span className="px-4 py-2 bg-[#004491]/20 text-[11px] font-bold tracking-[0.2em] text-[#5b9aff] uppercase rounded-md border border-[#004491]/30">
                  {announcement.tag}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.2] mb-8 tracking-tight">
              {announcement.title}
            </h1>

            {/* Date */}
            <div className="flex items-center gap-3 mb-12 pb-8 border-b border-white/[0.06]">
              <span className="material-symbols-outlined text-[18px] text-zinc-600">
                calendar_today
              </span>
              <time className="text-sm md:text-base text-zinc-500 font-medium tracking-wide">
                {formattedDate}
              </time>
            </div>

            {/* Article Body */}
            <article className="prose prose-invert max-w-none">
              {announcement.content ? (
                announcement.content.split('\n').map((paragraph, i) =>
                  paragraph.trim() ? (
                    <p
                      key={i}
                      className="text-[16px] md:text-[18px] leading-[1.8] text-zinc-300 mb-6 font-light"
                    >
                      {paragraph}
                    </p>
                  ) : null
                )
              ) : (
                <p className="text-zinc-500 italic">No additional content.</p>
              )}
            </article>

            {/* Bottom Back Button */}
            <div className="mt-12 pt-8 border-t border-white/[0.08] flex justify-between items-center">
              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#5b9aff] hover:text-white uppercase tracking-widest transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to All Announcements
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
