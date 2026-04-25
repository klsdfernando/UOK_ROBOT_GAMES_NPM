import { NextResponse } from 'next/server';
import db from '@/lib/firebase';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'uok-admin-2026-secret';

export async function GET(req) {
  try {
    // Verify admin secret via header
    const secret = req.headers.get('x-admin-secret');
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const snapshot = await db.collection('teams').orderBy('createdAt', 'desc').get();

    const teams = snapshot.docs.map((doc) => {
      const data = doc.data();
      const phases = data.phases || {};

      // Extract phase data safely
      const phase1 = phases['1']?.data || null;
      const phase2 = phases['2']?.data || null;
      const phase3 = phases['3']?.data || null;
      const phase4 = phases['4']?.data || null;

      return {
        id: doc.id,
        teamName: data.teamName,
        leaderName: data.leaderName,
        leaderEmail: data.leaderEmail,
        createdAt: data.createdAt,
        // Phase completion status
        phase1Completed: phases['1']?.completed || false,
        phase2Completed: phases['2']?.completed || false,
        phase3Completed: phases['3']?.completed || false,
        phase4Completed: phases['4']?.completed || false,
        phase5Completed: phases['5']?.completed || false,
        // Phase 1: Event
        eventSelection: phase1?.eventSelection || '—',
        categorySelection: phase1?.categorySelection || '—',
        // Phase 2: Members
        memberCount: phase2?.memberCount || 0,
        members: phase2?.members || [],
        // Phase 3: Organization
        teamType: phase3?.teamType || '—',
        organizationName: phase3?.orgName || '—',
        // Phase 4: Payment
        referenceNumber: phase4?.referenceNumber || '—',
        paymentFileName: phase4?.fileName || null,
        driveViewUrl: phase4?.driveViewUrl || null,
        driveThumbnailUrl: phase4?.driveThumbnailUrl || null,
        paymentUploadedAt: phase4?.uploadedAt || null,
      };
    });

    return NextResponse.json({ success: true, teams }, { status: 200 });
  } catch (error) {
    console.error('Admin teams error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
