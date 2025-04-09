"use server"

import { prisma } from '@/lib/prisma';
import { updateTotamAmountRaisedThisMonth } from './ngo.action';
import { revalidatePath } from 'next/cache';

const MONTH_ENUM = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
] as const;

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
    const currentMonth = MONTH_ENUM[now.getMonth()];

    const donation = await prisma.donation.create({
        data: {
            orderId,
            paymentId,
            ngoId,
            donorId,
            amount,
            message,
            month: currentMonth,
            year: now.getFullYear(),
        },
    });

    updateTotamAmountRaisedThisMonth(ngoId, amount)

    revalidatePath(`/ngos/${ngoId}`)
    return donation;
}

export async function getDonationByNgoId(ngoId: string) {
    try {
        const donations = await prisma.donation.findMany({
            where: {
                ngoId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                donor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                reAssignedNgo: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                ngo: true,
            },
        });

        return donations;
    } catch (error) {
        console.error('Error fetching donations by NGO ID:', error);
        throw new Error('Failed to fetch donations');
    }
}
