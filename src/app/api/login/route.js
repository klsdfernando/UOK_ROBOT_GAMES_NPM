import { NextResponse } from 'next/server';
import { scryptSync, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';
import db from '@/lib/firebase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, derivedKey);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Look up team by email
    const snapshot = await db
      .collection('teams')
      .where('leaderEmail', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const teamDoc = snapshot.docs[0];
    const teamData = teamDoc.data();

    // Verify password
    const isValid = verifyPassword(password, teamData.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        teamId: teamDoc.id,
        teamName: teamData.teamName,
        leaderEmail: teamData.leaderEmail,
        leaderName: teamData.leaderName,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful!',
        team: {
          id: teamDoc.id,
          teamName: teamData.teamName,
          leaderName: teamData.leaderName,
          leaderEmail: teamData.leaderEmail,
        },
      },
      { status: 200 }
    );

    response.cookies.set('team_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
