import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Check for env variables at startup
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, userId, ngoId, message, isAnonymousDonation } = body;

        if (!amount || !userId || !ngoId) {
            return NextResponse.json(
                { error: "Missing required fields: amount, userId, ngoId" },
                { status: 400 }
            );
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
            notes: {
                userId,
                ngoId,
                message,
                purpose: "donation",
                isAnonymousDonation,
            },
        });

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Failed to create Razorpay order" },
            { status: 500 }
        );
    }
}
