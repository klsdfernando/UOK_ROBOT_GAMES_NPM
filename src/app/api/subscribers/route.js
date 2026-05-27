import { NextResponse } from 'next/server';
import db from '@/lib/firebase';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'uok-admin-2026-secret';

// POST — public: subscribe with email
export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await db
      .collection('subscribers')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { success: true, message: 'Already subscribed!' },
        { status: 200 }
      );
    }

    await db.collection('subscribers').add({
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// GET — admin only: fetch all subscribers
export async function GET(req) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 }
    );
  }

  try {
    const snapshot = await db
      .collection('subscribers')
      .orderBy('subscribedAt', 'desc')
      .get();

    const subscribers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, subscribers }, { status: 200 });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE — admin only: delete a subscriber
export async function DELETE(req) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Subscriber ID is required.' },
        { status: 400 }
      );
    }

    await db.collection('subscribers').doc(id).delete();

    return NextResponse.json(
      { success: true, message: 'Subscriber removed.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
