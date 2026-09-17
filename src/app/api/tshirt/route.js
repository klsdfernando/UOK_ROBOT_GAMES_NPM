import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const whatsappNumber = formData.get('whatsappNumber');
    const shirtCount = parseInt(formData.get('shirtCount') || '1', 10);
    const shirtsRaw = formData.get('shirts');
    const teamId = formData.get('teamId') || null;
    const teamName = formData.get('teamName') || null;
    const referenceNumber = formData.get('referenceNumber') || '';
    const file = formData.get('paymentSlip');

    // If this is a team order, check if team already placed an order (teams can only make one order)
    if (teamId) {
      try {
        const dbModule = await import('@/lib/firebase');
        const db = dbModule.default;
        if (db) {
          const existingSnap = await db
            .collection('tshirt_orders')
            .where('teamId', '==', teamId)
            .limit(1)
            .get();

          if (!existingSnap.empty) {
            return NextResponse.json(
              {
                success: false,
                message: 'Your team has already submitted a T-shirt order. Orders cannot be edited or submitted again once placed.',
              },
              { status: 400 }
            );
          }
        }
      } catch (checkErr) {
        console.warn('Error checking existing team order:', checkErr?.message);
      }
    }

    if (!name || !whatsappNumber || !shirtCount || !shirtsRaw) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    let shirts = [];
    try {
      shirts = JSON.parse(shirtsRaw);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid shirt configurations.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(shirts) || shirts.length !== shirtCount) {
      return NextResponse.json(
        { success: false, message: 'Shirt details do not match the requested count.' },
        { status: 400 }
      );
    }

    // Validate each shirt has category and size
    for (let i = 0; i < shirts.length; i++) {
      const s = shirts[i];
      if (!s.size) {
        const studentLabel = s.memberName ? ` for ${s.memberName}` : ` for Shirt #${i + 1}`;
        return NextResponse.json(
          { success: false, message: `Please select a size${studentLabel}.` },
          { status: 400 }
        );
      }
    }

    const orderId = `TSH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Upload slip to Google Drive via APPS_SCRIPT_URL if file is provided
    let driveFileId = null;
    let driveViewUrl = null;
    let driveThumbnailUrl = null;

    if (file && typeof file === 'object' && typeof file.arrayBuffer === 'function') {
      const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
      if (APPS_SCRIPT_URL) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileBase64 = buffer.toString('base64');
          const originalName = file.name || 'slip.jpg';
          const ext = originalName.split('.').pop() || 'jpg';
          const prefix = teamName ? `${teamName.replace(/[^a-zA-Z0-9_-]/g, '_')}_tshirt` : `${name.replace(/[^a-zA-Z0-9_-]/g, '_')}_tshirt`;
          const fileName = `${prefix}_${orderId}.${ext}`;

          const driveRes = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64,
              mimeType: file.type || 'image/jpeg',
              fileName,
            }),
          });

          const driveData = await driveRes.json();
          if (driveData?.success) {
            driveFileId = driveData.fileId || null;
            driveViewUrl = driveData.viewUrl || null;
            driveThumbnailUrl = driveData.thumbnailUrl || null;
          } else {
            console.warn('Google Drive tshirt slip upload error:', driveData?.error);
          }
        } catch (uploadErr) {
          console.error('Failed to upload tshirt slip to Drive:', uploadErr);
        }
      }
    }

    const paymentOption = formData.get('paymentOption') || 'full'; // 'full' | 'preorder'
    const rawAmountPaid = parseInt(formData.get('amountPaid') || '', 10);
    const rawBalanceDue = parseInt(formData.get('balanceDue') || '', 10);
    const rawTotalAmount = parseInt(formData.get('totalAmount') || '', 10);

    const amountPaid = !isNaN(rawAmountPaid)
      ? rawAmountPaid
      : (paymentOption === 'preorder' ? shirtCount * 1000 : shirtCount * 1900);
    const balanceDue = !isNaN(rawBalanceDue)
      ? rawBalanceDue
      : (paymentOption === 'preorder' ? shirtCount * 900 : 0);
    const totalAmount = !isNaN(rawTotalAmount)
      ? rawTotalAmount
      : shirtCount * 1900;

    const orderData = {
      orderId,
      name: name.trim(),
      whatsappNumber: whatsappNumber.trim(),
      shirtCount,
      shirts,
      paymentOption,
      amountPaid,
      balanceDue,
      totalAmount,
      referenceNumber: referenceNumber.trim(),
      hasPaymentSlip: Boolean(file),
      slipName: file && typeof file === 'object' && file.name ? file.name : null,
      driveFileId,
      driveViewUrl,
      driveThumbnailUrl,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...(teamId ? { teamId } : {}),
      ...(teamName ? { teamName } : {}),
    };

    // Try saving to Firestore if available
    try {
      const dbModule = await import('@/lib/firebase');
      const db = dbModule.default;
      if (db) {
        await db.collection('tshirt_orders').doc(orderId).set(orderData);
      }
    } catch (dbErr) {
      console.warn('Firestore write skipped or unavailable:', dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Your T-Shirt pre-order has been placed successfully!',
      orderId,
      order: orderData,
    });
  } catch (err) {
    console.error('T-shirt order submission error:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ success: true, orders: [] });
    }

    try {
      const dbModule = await import('@/lib/firebase');
      const db = dbModule.default;
      if (db) {
        const snapshot = await db
          .collection('tshirt_orders')
          .where('teamId', '==', teamId)
          .get();

        const orders = [];
        snapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });

        // Sort latest first
        orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        return NextResponse.json({ success: true, orders });
      }
    } catch (dbErr) {
      console.warn('Firestore query error:', dbErr?.message);
    }

    return NextResponse.json({ success: true, orders: [] });
  } catch (err) {
    console.error('T-shirt order fetch error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 500 });
  }
}
