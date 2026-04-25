import { NextResponse } from 'next/server';
import db from '@/lib/firebase';
import * as XLSX from 'xlsx';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'uok-admin-2026-secret';

export async function GET(req) {
  try {
    const secret = req.headers.get('x-admin-secret');
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const snapshot = await db.collection('teams').orderBy('createdAt', 'desc').get();

    const rows = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      const phases = data.phases || {};
      const p1 = phases['1']?.data || {};
      const p2 = phases['2']?.data || {};
      const p3 = phases['3']?.data || {};
      const p4 = phases['4']?.data || {};

      const row = {
        '#': index + 1,
        'Team Name': data.teamName || '',
        'Leader Name': data.leaderName || '',
        'Leader Email': data.leaderEmail || '',
        'Event': p1.eventSelection || '—',
        'Category': p1.categorySelection || '—',
        'Team Type': p3.teamType || '—',
        'Organization': p3.orgName || '—',
        'Members Count': p2.memberCount || 0,
      };

      // Flatten members (max 4 additional)
      const members = p2.members || [];
      for (let i = 0; i < 5; i++) {
        const m = members[i];
        row[`Member ${i + 1} Name`] = m?.fullName || '';
        row[`Member ${i + 1} Contact`] = m?.contactNumber || '';
      }

      row['Payment Ref'] = p4.referenceNumber || '—';
      row['Payment File'] = p4.fileName || 'Not uploaded';
      row['Payment Slip Link'] = p4.driveViewUrl || '—';
      row['Phase 1'] = phases['1']?.completed ? '✓' : '✗';
      row['Phase 2'] = phases['2']?.completed ? '✓' : '✗';
      row['Phase 3'] = phases['3']?.completed ? '✓' : '✗';
      row['Phase 4'] = phases['4']?.completed ? '✓' : '✗';
      row['Registered At'] = data.createdAt
        ? new Date(data.createdAt).toLocaleString('en-LK', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
        : '—';

      return row;
    });

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No teams to export' }, { status: 404 });
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teams');

    // Set column widths
    const keys = Object.keys(rows[0] || {});
    worksheet['!cols'] = keys.map((key) => {
      if (key === '#') return { wch: 5 };
      if (key.includes('Email')) return { wch: 28 };
      if (key.includes('Name') || key.includes('Organization')) return { wch: 22 };
      return { wch: 16 };
    });

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="UOK_Robot_Games_Teams_${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
