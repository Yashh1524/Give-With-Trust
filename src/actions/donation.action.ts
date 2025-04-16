"use server"

import { prisma } from '@/lib/prisma';
import { calculateAndUpdateRaisedThisMonth, updateTotamAmountRaisedThisMonth } from './ngo.action';
import { revalidatePath } from 'next/cache';
import { DonationStatus } from '@prisma/client';

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

    calculateAndUpdateRaisedThisMonth(ngoId)
    revalidatePath(`/ngos/${ngoId}`)
    
    return donation;
}

export async function getDonationByNgoId(ngoId: string) {
    try {
        const [directDonations, reassignedDonations] = await Promise.all([
            prisma.donation.findMany({
                where: { ngoId },
                orderBy: { createdAt: 'desc' },
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
            }),
            prisma.donation.findMany({
                where: { reAssignedNgoId: ngoId },
                orderBy: { createdAt: 'desc' },
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
            }),
        ]);

        // Combine and sort by createdAt descending
        const allDonations = [...directDonations, ...reassignedDonations].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        return allDonations;
    } catch (error) {
        console.error('Error fetching donations by NGO ID:', error);
        throw new Error('Failed to fetch donations');
    }
}

export async function getDonationByUserId(userId: string) {
    try {
        const donations = await prisma.donation.findMany({
            where: {donorId: userId},
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
        })

        if(!donations) throw new Error("No donation found")

        return donations
    } catch (error) {
        console.error('Error fetching donations by User ID:', error);
        throw new Error('Failed to fetch donations');
    }
}

export async function getAllDonationByStatus(status: DonationStatus) {
    try {
        return await prisma.donation.findMany({
            where: {status: status},
            include: {
                donor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                },
                reAssignedNgo: true
            }
        })
    } catch (error) {
        console.error('Error fetching all held donations', error);
        throw new Error('Failed fetching all held donations.');
    }
}

export async function updateDonationStatus(
    newStatus: DonationStatus, 
    donationId: string, 
    reassignedNgoId: string | null
) {
    try {
        return await prisma.donation.update({
            where: {id: donationId},
            data:{
                status: newStatus,
                reAssignedNgoId: reassignedNgoId || null
            },
        })
    } catch (error) {
        console.error("Error updating status of donation", error)
        throw new Error("Failed to update donation status.")
    }
}

export async function updateDonationStatusByNgoId(
    newStatus: DonationStatus, 
    ngoId: string,
    reassignedNgoId?: string | null
) {
    try {
        const donations = await prisma.donation.updateMany({
            where: {ngoId: ngoId},
            data: {
                status: newStatus,
                reAssignedNgoId: reassignedNgoId 
            }
        })
        revalidatePath("/admin-dashboard/send-money")
        return donations
    } catch (error) {
        console.error("Error updating status of donation by ngoId", error)
        throw new Error("Failed to update donation status by ngoId.")
    }
}