import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { google } from 'googleapis';
import { Readable } from 'stream';
import db from '@/lib/firebase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Create Google Drive client using the same Firebase service account
function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  return google.drive({ version: 'v3', auth });
}

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

    // Upload to Google Drive
    const drive = getDriveClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'jpg';
    const driveFileName = `${teamName}_payment_${Date.now()}.${ext}`;

    const driveResponse = await drive.files.create({
      requestBody: {
        name: driveFileName,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
      fields: 'id, webViewLink, webContentLink',
    });

    const driveFileId = driveResponse.data.id;
    const viewLink = driveResponse.data.webViewLink;

    // Make file viewable by anyone with the link
    await drive.permissions.create({
      fileId: driveFileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get a direct thumbnail/view URL
    const driveViewUrl = `https://drive.google.com/file/d/${driveFileId}/view`;
    const driveThumbnailUrl = `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w800`;

    // Update phase 4 in Firestore
    const now = new Date().toISOString();

    const updates = {
      'phases.4.completed': true,
      'phases.4.completedAt': now,
      'phases.4.data': {
        referenceNumber: referenceNumber.trim(),
        driveFileId: driveFileId,
        driveViewUrl: driveViewUrl,
        driveThumbnailUrl: driveThumbnailUrl,
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
