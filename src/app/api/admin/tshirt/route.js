import { NextResponse } from 'next/server';
import db from '@/lib/firebase';

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

export async function GET(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    if (!db) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const snapshot = await db.collection('tshirt_orders').get();

    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Sort latest first
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error('Admin tshirt orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing orderId or status.' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database unavailable.' },
        { status: 500 }
      );
    }

    await db.collection('tshirt_orders').doc(orderId).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: `Order status updated to ${status}.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin tshirt update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order status.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Missing orderId.' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: true, message: 'No database configured in local dev environment.' },
        { status: 200 }
      );
    }

    await db.collection('tshirt_orders').doc(orderId).delete();

    return NextResponse.json(
      { success: true, message: 'Order deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin tshirt delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete order.' },
      { status: 500 }
    );
  }
}

