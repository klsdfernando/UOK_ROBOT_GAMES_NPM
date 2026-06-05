import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '@/lib/firebase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('team_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const teamId = decoded.teamId;

    // Verify this is a free registration (Robot Race + School Category)
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      return NextResponse.json({ success: false, message: 'Team not found.' }, { status: 404 });
    }

    const teamData = teamDoc.data();
    const phase1Data = teamData.phases?.['1']?.data;

    if (phase1Data?.eventSelection !== 'Robot Race' || phase1Data?.categorySelection !== 'School Category') {
      return NextResponse.json({ success: false, message: 'Free registration is only for Robot Race School Category.' }, { status: 400 });
    }

    // Complete phase 4 without payment
    const now = new Date().toISOString();
    const updates = {
      'phases.4.completed': true,
      'phases.4.completedAt': now,
      'phases.4.data': {
        referenceNumber: 'FREE-REGISTRATION',
        fileName: null,
        driveViewUrl: null,
        driveThumbnailUrl: null,
        freeRegistration: true,
        uploadedAt: now,
      },
    };

    await db.collection('teams').doc(teamId).update(updates);

    // Fetch updated phases
    const updatedDoc = await db.collection('teams').doc(teamId).get();
    const updatedPhases = updatedDoc.data().phases;

    return NextResponse.json({ success: true, phases: updatedPhases }, { status: 200 });
  } catch (error) {
    console.error('Free registration error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
