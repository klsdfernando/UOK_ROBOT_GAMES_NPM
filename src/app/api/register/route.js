import { NextResponse } from 'next/server';
import { scryptSync, randomBytes } from 'crypto';
import db from '@/lib/firebase';
import { sendRegistrationEmail } from '@/lib/email';

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { teamName, leaderName, leaderEmail, password, confirmPassword } = body;

    // Validate required fields
    if (!teamName || !leaderName || !leaderEmail || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leaderEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Check password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingTeam = await db
      .collection('teams')
      .where('leaderEmail', '==', leaderEmail.toLowerCase().trim())
      .limit(1)
      .get();

    if (!existingTeam.empty) {
      return NextResponse.json(
        { success: false, message: 'A team with this email already exists.' },
        { status: 409 }
      );
    }

    // Check if team name already exists
    const existingName = await db
      .collection('teams')
      .where('teamName', '==', teamName.trim())
      .limit(1)
      .get();

    if (!existingName.empty) {
      return NextResponse.json(
        { success: false, message: 'This team name is already taken.' },
        { status: 409 }
      );
    }

    // Hash password and save
    const passwordHash = hashPassword(password);

    await db.collection('teams').add({
      teamName: teamName.trim(),
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
      // Phase progression system
      phases: {
        "1": { completed: false, unlockedAt: new Date().toISOString() },
        "2": { completed: false, unlockedAt: null },
        "3": { completed: false, unlockedAt: null },
        "4": { completed: false, unlockedAt: null },
        "5": { completed: false, unlockedAt: null, devLocked: true },
      },
    });

    // Send registration confirmation email (non-blocking)
    sendRegistrationEmail({
      teamName: teamName.trim(),
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.toLowerCase().trim(),
    }).catch(err => console.error('Email send failed:', err));

    return NextResponse.json(
      { success: true, message: 'Team registered successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
