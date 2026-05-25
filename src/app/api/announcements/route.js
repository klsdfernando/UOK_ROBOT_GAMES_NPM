import { NextResponse } from 'next/server';
import db from '@/lib/firebase';

// Public GET — fetch announcements for frontend
export async function GET() {
  try {
    const snapshot = await db
      .collection('announcements')
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();

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
