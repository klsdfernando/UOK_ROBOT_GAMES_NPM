import { NextResponse } from 'next/server';
import db from '@/lib/firebase';

// Public GET — fetch announcements for frontend
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');

    let query = db.collection('announcements').orderBy('createdAt', 'desc');

    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        query = query.limit(parsedLimit);
      }
    }

    const snapshot = await query.get();

    const announcements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, announcements }, { status: 200 });
  } catch (error) {
    console.error('Public fetch announcements error:', error);
    return NextResponse.json(
      { success: true, announcements: [] },
      { status: 200 }
    );
  }
}
