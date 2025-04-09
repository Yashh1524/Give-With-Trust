// app/actions/donation.action.ts
import { prisma } from '@/lib/prisma';

export async function createDonation({
    orderId,
    paymentId,
    ngoId,
    donorId,
    amount,
    message,
}: {
    orderId: string;
    paymentId: string;
    ngoId: string;
    donorId: string;
    amount: number;
    message?: string;
}) {
    const now = new Date();

    const donation = await prisma.donation.create({
        data: {
            orderId,
            paymentId,
            ngoId,
            donorId,
            amount,
            message,
            month: 3,
            year: 2025,
        },
    });

    return donation;
}
