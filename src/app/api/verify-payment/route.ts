import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createDonation } from '@/actions/donation.action'; // use your action function

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            orderId,
            ngoId,
            userId,
            amount,
            message,
        } = body;
        // console.log("body:", body);
        
        // Validate all required values exist
        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature ||
            !orderId ||
            !ngoId ||
            !userId ||
            !amount
        ) {
            return NextResponse.json({ success: false, error: 'Missing fields in request.' }, { status: 400 });
        }

        // Generate expected signature using Razorpay key_secret
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        // Compare with received signature
        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: 'Invalid payment signature.' }, { status: 400 });
        }

        // Create donation
        await createDonation({
            orderId,
            paymentId: razorpay_payment_id,
            ngoId,
            donorId: userId,
            amount,
            message,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ success: false, error: 'Server error during verification.' }, { status: 500 });
    }
}
