import { NextResponse } from 'next/server';
import { randomInt, scryptSync, randomBytes } from 'crypto';
import db from '@/lib/firebase';
import { sendPasswordResetEmail } from '@/lib/email';

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    // ──────────────────────────────────────────────
    // ACTION: send-code
    // ──────────────────────────────────────────────
    if (action === 'send-code') {
      const { email } = body;

      if (!email) {
        return NextResponse.json(
          { success: false, message: 'Email is required.' },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Look up team by email
      const snapshot = await db
        .collection('teams')
        .where('leaderEmail', '==', normalizedEmail)
        .limit(1)
        .get();

      if (snapshot.empty) {
        // Return success even if email not found to prevent email enumeration
        return NextResponse.json({
          success: true,
          message: 'If an account with that email exists, a verification code has been sent.',
        });
      }

      const teamDoc = snapshot.docs[0];
      const teamData = teamDoc.data();

      // Generate a 6-digit verification code
      const code = randomInt(100000, 999999).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store reset code in Firestore
      await db.collection('password_resets').doc(normalizedEmail).set({
        code,
        expiresAt,
        teamId: teamDoc.id,
        attempts: 0,
        createdAt: new Date().toISOString(),
      });

      // Send email (non-blocking)
      sendPasswordResetEmail({
        leaderName: teamData.leaderName,
        leaderEmail: normalizedEmail,
        code,
      }).catch((err) => console.error('Password reset email failed:', err));

      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification code has been sent.',
      });
    }

    // ──────────────────────────────────────────────
    // ACTION: verify-code
    // ──────────────────────────────────────────────
    if (action === 'verify-code') {
      const { email, code } = body;

      if (!email || !code) {
        return NextResponse.json(
          { success: false, message: 'Email and verification code are required.' },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      const resetDoc = await db.collection('password_resets').doc(normalizedEmail).get();

      if (!resetDoc.exists) {
        return NextResponse.json(
          { success: false, message: 'No reset request found. Please request a new code.' },
          { status: 400 }
        );
      }

      const resetData = resetDoc.data();

      // Check if too many attempts
      if (resetData.attempts >= 5) {
        await db.collection('password_resets').doc(normalizedEmail).delete();
        return NextResponse.json(
          { success: false, message: 'Too many attempts. Please request a new code.' },
          { status: 429 }
        );
      }

      // Check expiry
      if (Date.now() > resetData.expiresAt) {
        await db.collection('password_resets').doc(normalizedEmail).delete();
        return NextResponse.json(
          { success: false, message: 'Verification code has expired. Please request a new one.' },
          { status: 400 }
        );
      }

      // Increment attempts
      await db.collection('password_resets').doc(normalizedEmail).update({
        attempts: resetData.attempts + 1,
      });

      // Verify code
      if (resetData.code !== code.trim()) {
        return NextResponse.json(
          { success: false, message: 'Invalid verification code.' },
          { status: 400 }
        );
      }

      // Mark as verified
      await db.collection('password_resets').doc(normalizedEmail).update({
        verified: true,
      });

      return NextResponse.json({
        success: true,
        message: 'Code verified successfully.',
      });
    }

    // ──────────────────────────────────────────────
    // ACTION: reset-password
    // ──────────────────────────────────────────────
    if (action === 'reset-password') {
      const { email, code, newPassword } = body;

      if (!email || !code || !newPassword) {
        return NextResponse.json(
          { success: false, message: 'All fields are required.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 6 characters.' },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      const resetDoc = await db.collection('password_resets').doc(normalizedEmail).get();

      if (!resetDoc.exists) {
        return NextResponse.json(
          { success: false, message: 'No reset request found. Please start over.' },
          { status: 400 }
        );
      }

      const resetData = resetDoc.data();

      // Verify the code again and check verified flag
      if (resetData.code !== code.trim() || !resetData.verified) {
        return NextResponse.json(
          { success: false, message: 'Invalid or unverified code. Please start over.' },
          { status: 400 }
        );
      }

      // Check expiry
      if (Date.now() > resetData.expiresAt) {
        await db.collection('password_resets').doc(normalizedEmail).delete();
        return NextResponse.json(
          { success: false, message: 'Reset session has expired. Please start over.' },
          { status: 400 }
        );
      }

      // Hash new password
      const passwordHash = hashPassword(newPassword);

      // Update team password in Firestore
      await db.collection('teams').doc(resetData.teamId).update({
        passwordHash,
      });

      // Delete the reset document
      await db.collection('password_resets').doc(normalizedEmail).delete();

      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully!',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
