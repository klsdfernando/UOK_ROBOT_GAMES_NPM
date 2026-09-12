import { NextResponse } from 'next/server';
import db from '@/lib/firebase';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'uok-admin-2026-secret';
const KNOWN_SECRETS = [
  ADMIN_SECRET,
  'uok-cyber-circuit-admin-x9k4m7',
  'uok-admin-2026-secret',
];

function checkAdmin(req) {
  const secret = req.headers.get('x-admin-secret');
  if (!KNOWN_SECRETS.includes(secret)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 }
    );
  }
  return null;
}

// GET — fetch all announcements (admin view)
export async function GET(req) {
  const authError = checkAdmin(req);
  if (authError) return authError;

  if (!db) {
    return NextResponse.json({ success: true, announcements: [] }, { status: 200 });
  }

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
    console.error('Fetch announcements error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// POST — create a new announcement
export async function POST(req) {
  const authError = checkAdmin(req);
  if (authError) return authError;

  try {
    // Check count
    const snapshot = await db.collection('announcements').get();
    if (snapshot.size >= 3) {
      return NextResponse.json(
        { success: false, message: 'Maximum 3 announcements allowed. Delete one first.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, tag, excerpt, content, imageUrl, date } = body;

    if (!title || !tag || !excerpt || !content || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const docRef = await db.collection('announcements').add({
      title,
      tag,
      excerpt,
      content,
      imageUrl,
      date: date || new Date().toISOString(), // Fallback if no date is provided
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, id: docRef.id, message: 'Announcement created.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// PUT — update an announcement
export async function PUT(req) {
  const authError = checkAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id, title, tag, excerpt, content, imageUrl, date } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Announcement ID is required.' },
        { status: 400 }
      );
    }

    await db.collection('announcements').doc(id).update({
      title,
      tag,
      excerpt,
      content,
      imageUrl,
      date: date || new Date().toISOString(), // Fallback if missing
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Announcement updated.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE — delete an announcement
export async function DELETE(req) {
  const authError = checkAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Announcement ID is required.' },
        { status: 400 }
      );
    }

    await db.collection('announcements').doc(id).delete();

    return NextResponse.json(
      { success: true, message: 'Announcement deleted.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
