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

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('paymentSlip');
    const referenceNumber = formData.get('referenceNumber');

    if (!file || !referenceNumber) {
      return NextResponse.json(
        { success: false, message: 'Payment slip and reference number are required.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Only JPG, PNG, WebP, or PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 800KB to stay within Firestore doc limits)
    if (file.size > 800 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be under 800KB.' },
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    // Update phase 4 in Firestore
    const teamRef = db.collection('teams').doc(decoded.teamId);
    const now = new Date().toISOString();

    const updates = {
      'phases.4.completed': true,
      'phases.4.completedAt': now,
      'phases.4.data': {
        referenceNumber: referenceNumber.trim(),
        slipBase64: dataUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: now,
      },
    };

    // Unlock phase 5 if it's not dev-locked
    const teamDoc = await teamRef.get();
    const teamData = teamDoc.data();
    const phase5 = teamData?.phases?.['5'] || {};
    if (!phase5.devLocked) {
      updates['phases.5.unlockedAt'] = now;
    }

    await teamRef.update(updates);

    // Return updated phases
    const updatedDoc = await teamRef.get();
    const updatedPhases = updatedDoc.data().phases;

    return NextResponse.json(
      {
        success: true,
        message: 'Payment slip uploaded successfully!',
        phases: updatedPhases,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
