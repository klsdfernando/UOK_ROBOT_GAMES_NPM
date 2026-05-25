import db from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

export default async function AnnouncementPage({ params }) {
  const { id } = await params;

  let announcement = null;
  try {
    const doc = await db.collection('announcements').doc(id).get();
    if (doc.exists) {
      announcement = { id: doc.id, ...doc.data() };
    }
  } catch (error) {
    console.error('Error fetching announcement:', error);
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
        <div className="text-center">
          <span className="material-symbols-outlined text-zinc-600 text-6xl mb-4 block">article</span>
          <h1 className="text-2xl font-bold text-white mb-2">Announcement Not Found</h1>
          <p className="text-zinc-500 mb-6">This announcement may have been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-[#5b9aff] font-bold text-sm tracking-wide hover:underline">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>
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
    <div className="min-h-screen bg-[#080808]">
      {/* Hero Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <Image
          src={announcement.imageUrl}
          alt={announcement.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/40 to-transparent h-24" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-40 mb-24">
        
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/[0.08] rounded-full px-4 py-2 text-zinc-400 hover:text-white hover:border-white/[0.2] text-xs font-bold tracking-widest uppercase transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </Link>
        </div>

        <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-6 sm:p-10 md:p-16 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#004491] to-transparent opacity-80" />

          {/* Tag */}
          <div className="mb-6 flex justify-start">
            <span className="px-4 py-2 bg-[#004491]/20 text-[11px] font-bold tracking-[0.2em] text-[#5b9aff] uppercase rounded-md border border-[#004491]/30">
              {announcement.tag}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            {announcement.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-3 mb-12 pb-8 border-b border-white/[0.06]">
            <span className="material-symbols-outlined text-[18px] text-zinc-600">calendar_today</span>
            <time className="text-sm md:text-base text-zinc-500 font-medium tracking-wide">{formattedDate}</time>
          </div>

          {/* Article Body */}
          <article className="prose prose-invert max-w-none">
            {announcement.content.split('\n').map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-[16px] md:text-[18px] leading-[1.8] text-zinc-400 mb-6 font-light">
                  {paragraph}
                </p>
              ) : null
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
