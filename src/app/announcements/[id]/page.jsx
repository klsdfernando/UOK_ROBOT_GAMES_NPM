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

  const formattedDate = announcement.createdAt
    ? new Date(announcement.createdAt).toLocaleDateString('en-US', {
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
      <div className="relative z-10 max-w-3xl mx-auto px-6 -mt-32">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Home
        </Link>

        {/* Tag */}
        <div className="mb-4">
          <span className="px-3 py-1.5 bg-[#004491]/30 text-[10px] font-bold tracking-[0.15em] text-[#5b9aff] uppercase rounded-md border border-[#004491]/30">
            {announcement.tag}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
          {announcement.title}
        </h1>

        {/* Date */}
        <div className="flex items-center gap-2 mb-10 pb-8 border-b border-white/[0.08]">
          <span className="material-symbols-outlined text-[16px] text-zinc-600">calendar_today</span>
          <time className="text-sm text-zinc-500 font-medium">{formattedDate}</time>
        </div>

        {/* Article Body */}
        <article className="pb-24">
          {announcement.content.split('\n').map((paragraph, i) =>
            paragraph.trim() ? (
              <p key={i} className="text-[17px] leading-[1.8] text-zinc-400 mb-6">
                {paragraph}
              </p>
            ) : null
          )}
        </article>
      </div>
    </div>
  );
}
