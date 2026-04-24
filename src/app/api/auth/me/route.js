import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '@/lib/firebase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('team_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch fresh team data from Firestore
    const teamDoc = await db.collection('teams').doc(decoded.teamId).get();

    if (!teamDoc.exists) {
      return NextResponse.json(
        { authenticated: false, message: 'Team not found.' },
        { status: 404 }
      );
    }

    const teamData = teamDoc.data();

    return NextResponse.json(
      {
        authenticated: true,
        team: {
          id: teamDoc.id,
          teamName: teamData.teamName,
          leaderName: teamData.leaderName,
          leaderEmail: teamData.leaderEmail,
          createdAt: teamData.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Invalid or expired token.' },
      { status: 401 }
    );
  }
}
