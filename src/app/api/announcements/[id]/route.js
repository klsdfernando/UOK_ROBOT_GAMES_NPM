import { NextResponse } from 'next/server';
import db from '@/lib/firebase';

// Public GET — fetch single announcement by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const doc = await db.collection('announcements').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Announcement not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, announcement: { id: doc.id, ...doc.data() } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch single announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
