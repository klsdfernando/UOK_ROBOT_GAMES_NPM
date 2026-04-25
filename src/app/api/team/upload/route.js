import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '@/lib/firebase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be under 5MB.' },
        { status: 400 }
      );
    }

    // Fetch team name for the file name
    const teamRef = db.collection('teams').doc(decoded.teamId);
    const teamDoc = await teamRef.get();
    const teamData = teamDoc.data();
    const teamName = teamData?.teamName || 'Unknown';

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileBase64 = buffer.toString('base64');
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${teamName}_payment_${Date.now()}.${ext}`;

    // Upload via Google Apps Script
    const driveRes = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileBase64,
        mimeType: file.type,
        fileName,
      }),
    });

    const driveData = await driveRes.json();

    if (!driveData.success) {
      console.error('Drive upload error:', driveData.error);
      return NextResponse.json(
        { success: false, message: driveData.error || 'Failed to upload to Google Drive.' },
        { status: 500 }
      );
    }

    // Update phase 4 in Firestore
    const now = new Date().toISOString();

    const updates = {
      'phases.4.completed': true,
      'phases.4.completedAt': now,
      'phases.4.data': {
        referenceNumber: referenceNumber.trim(),
        driveFileId: driveData.fileId,
        driveViewUrl: driveData.viewUrl,
        driveThumbnailUrl: driveData.thumbnailUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: now,
      },
    };

    // Unlock phase 5 if it's not dev-locked
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
      { success: false, message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
