import { NextResponse } from 'next/server';
import db from '@/lib/firebase';
import * as XLSX from 'xlsx';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'uok-admin-2026-secret';
const KNOWN_SECRETS = [
  ADMIN_SECRET,
  'uok-cyber-circuit-admin-x9k4m7',
  'uok-admin-2026-secret',
];

function isAuthorized(req) {
  const secret = req.headers.get('x-admin-secret');
  return KNOWN_SECRETS.includes(secret);
}

const PRICE_PER_SHIRT = 1800;

export async function GET(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database unavailable.' },
        { status: 500 }
      );
    }

    const snapshot = await db.collection('tshirt_orders').get();

    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Sort latest first
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No T-shirt orders to export.' },
        { status: 404 }
      );
    }

    // ── Sheet 1: Orders Summary ──
    const ordersRows = orders.map((o, idx) => {
      const count = o.shirtCount || (o.shirts?.length || 0);
      return {
        '#': idx + 1,
        'Order ID': o.orderId || o.id,
        'Team Name': o.teamName || '— (General Buyer)',
        'Type': o.teamId ? 'Team Order' : 'Public Pre-Order',
        'Contact Name': o.name || '',
        'WhatsApp Number': o.whatsappNumber || '',
        'Total Shirts': count,
        'Total Paid (LKR)': count * PRICE_PER_SHIRT,
        'Payment Ref / Txn': o.referenceNumber || '—',
        'Slip Uploaded': o.hasPaymentSlip ? 'Yes' : 'No',
        'Slip File Name': o.slipName || '—',
        'Order Status': (o.status || 'pending').toUpperCase(),
        'Order Date': o.createdAt
          ? new Date(o.createdAt).toLocaleString('en-LK', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—',
      };
    });

    // ── Sheet 2: Itemized Shirts List ──
    const itemizedRows = [];
    let itemIdx = 1;
    orders.forEach((o) => {
      const list = o.shirts || [];
      list.forEach((s) => {
        itemizedRows.push({
          '#': itemIdx++,
          'Order ID': o.orderId || o.id,
          'Team Name': o.teamName || '— (General Buyer)',
          'Recipient / Student Name': s.memberName || '—',
          'Role': s.memberRole || '—',
          'Category': s.category || 'Normal Size',
          'Size': s.size || '—',
          'Unit Price (LKR)': PRICE_PER_SHIRT,
          'Order Status': (o.status || 'pending').toUpperCase(),
          'Contact Person': o.name || '',
          'WhatsApp': o.whatsappNumber || '',
        });
      });
    });

    // ── Sheet 3: Manufacturing Size Totals ──
    const sizeCounts = {
      'Normal Size': { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 },
      'Kids Size': { '2XS': 0, XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0 },
    };

    orders.forEach((o) => {
      (o.shirts || []).forEach((s) => {
        const cat = s.category === 'Kids Size' ? 'Kids Size' : 'Normal Size';
        const sz = s.size;
        if (sizeCounts[cat] && sizeCounts[cat][sz] !== undefined) {
          sizeCounts[cat][sz]++;
        } else if (sizeCounts[cat]) {
          sizeCounts[cat][sz] = (sizeCounts[cat][sz] || 0) + 1;
        }
      });
    });

    const summaryRows = [];
    let totalShirtsAll = 0;

    Object.entries(sizeCounts['Normal Size']).forEach(([size, qty]) => {
      summaryRows.push({
        'Category': 'Normal Size (Adults)',
        'Size': size,
        'Quantity Needed': qty,
      });
      totalShirtsAll += qty;
    });

    Object.entries(sizeCounts['Kids Size']).forEach(([size, qty]) => {
      summaryRows.push({
        'Category': 'Kids Size',
        'Size': size,
        'Quantity Needed': qty,
      });
      totalShirtsAll += qty;
    });

    summaryRows.push({
      'Category': 'TOTAL ALL SIZES',
      'Size': 'ALL',
      'Quantity Needed': totalShirtsAll,
    });

    // Build Workbook
    const workbook = XLSX.utils.book_new();

    const wsOrders = XLSX.utils.json_to_sheet(ordersRows);
    wsOrders['!cols'] = [
      { wch: 5 }, { wch: 22 }, { wch: 25 }, { wch: 18 }, { wch: 22 },
      { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 20 }, { wch: 14 },
      { wch: 24 }, { wch: 14 }, { wch: 22 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsOrders, 'All Orders');

    const wsItemized = XLSX.utils.json_to_sheet(itemizedRows);
    wsItemized['!cols'] = [
      { wch: 5 }, { wch: 22 }, { wch: 25 }, { wch: 24 }, { wch: 16 },
      { wch: 16 }, { wch: 10 }, { wch: 16 }, { wch: 14 }, { wch: 20 },
      { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsItemized, 'Itemized Allocation');

    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    wsSummary['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, wsSummary, 'Size Manufacturing Totals');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="UOK_Robot_Games_Tshirt_Orders_${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export tshirt orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to export T-shirt orders.' },
      { status: 500 }
    );
  }
}
