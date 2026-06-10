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
    const { phaseId, phaseData } = await req.json();

    if (!phaseId || ![1, 2, 3, 4, 5, 6].includes(phaseId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phase ID.' },
        { status: 400 }
      );
    }

    // Fetch the team doc
    const teamRef = db.collection('teams').doc(decoded.teamId);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Team not found.' },
        { status: 404 }
      );
    }

    const teamData = teamDoc.data();

    // Default phases for legacy teams that were registered before the phase system
    const defaultPhases = {
      "1": { completed: false, unlockedAt: new Date().toISOString() },
      "2": { completed: false, unlockedAt: null },
      "3": { completed: false, unlockedAt: null },
      "4": { completed: false, unlockedAt: null },
      "5": { completed: false, unlockedAt: null },
      "6": { completed: false, unlockedAt: null, devLocked: true },
    };

    // If team has no phases data, initialize it in Firestore
    let phases = teamData.phases;
    if (!phases || !phases["1"]) {
      phases = defaultPhases;
      await teamRef.update({ phases: defaultPhases });
    }

    const currentPhase = phases[String(phaseId)] || {};

    // Backward compatibility for legacy teams completing Phase 5
    if (phaseId === 5 && currentPhase.devLocked && phases['4']?.completed) {
      currentPhase.devLocked = false;
      if (!currentPhase.unlockedAt) {
        currentPhase.unlockedAt = new Date().toISOString();
      }
    }

    // Check if phase is unlocked (has unlockedAt set)
    if (!currentPhase.unlockedAt) {
      return NextResponse.json(
        { success: false, message: 'This phase is not yet unlocked.' },
        { status: 403 }
      );
    }

    // Check if developer-locked phases are still locked
    if (currentPhase.devLocked) {
      return NextResponse.json(
        { success: false, message: 'This phase is locked by the organizers.' },
        { status: 403 }
      );
    }

    // Mark phase as completed
    const now = new Date().toISOString();
    const updates = {};
    updates[`phases.${phaseId}.completed`] = true;
    updates[`phases.${phaseId}.completedAt`] = now;

    // Save any additional phase data (e.g., event selection)
    if (phaseData && typeof phaseData === 'object') {
      updates[`phases.${phaseId}.data`] = phaseData;
    }

    // Unlock the next phase if it exists and is not dev-locked
    const nextPhaseId = phaseId + 1;
    if (nextPhaseId <= 6) {
      const nextPhase = phases[String(nextPhaseId)] || {};
      // Only auto-unlock if the next phase is NOT developer-locked
      if (!nextPhase.devLocked) {
        updates[`phases.${nextPhaseId}.unlockedAt`] = now;
      }
    }

    await teamRef.update(updates);

    // Return updated phases
    const updatedDoc = await teamRef.get();
    const updatedPhases = updatedDoc.data().phases;

    return NextResponse.json(
      {
        success: true,
        message: `Phase ${phaseId} completed!`,
        phases: updatedPhases,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Phase completion error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
