'use server';

import { prisma } from '@/lib/prisma';
import { getDbUserId, updateUserRole } from './user.action';
import { revalidatePath } from 'next/cache';
import { AccentTag, NGOStatus } from '@prisma/client';

export const registerNgo = async ({
    name,
    establishedDate,
    address,
    email,
    contactInfo,
    description,
    accountNumber,
    bankName,
    ifscCode,
    accountHolderName,
    upiId,
    logo,
    proofPdf,
    images
}: {
    name: string;
    establishedDate: string;
    address: string;
    email: string;
    contactInfo: string;
    description: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
    logo?: string;
    proofPdf?: string;
    images: string[]
}) => {
    // const { userId } = await  auth();
    const userId = await getDbUserId()
    console.log(userId);

    if (!userId) throw new Error('Not authenticated');

    await prisma.nGOProfile.create({
        data: {
            userId,
            name,
            email,
            establishedDate: new Date(establishedDate),
            address,
            contactInfo,
            description,
            status: 'SUBMITTED',
            approved: false,
            accountNumber,
            bankName,
            ifscCode,
            accountHolderName,
            upiId,
            logo,
            proofPdf,
            images
        },
    });

    // Update user role to NGO
    await updateUserRole("NGO", userId)

    revalidatePath("/");
};

export async function updateNgoDetails(ngoId: string, updatedData: Partial<{
    logo: string
    name: string
    email: string
    establishedDate: Date
    address: string
    contactInfo: string
    website: string
    description: string
    upiId: string
    accountNumber: string
    bankName: string
    ifscCode: string
    accountHolderName: string
    proofPdf: string
    images: string[]
}>) {
    try {

        const existingNgo = await prisma.nGOProfile.findUnique({
            where: { id: ngoId }
        })

        if (!existingNgo) throw new Error("NGO not found")

        const updatedNgo = await prisma.nGOProfile.update({
            where: { id: ngoId },
            data: {
                ...updatedData
            }
        })

        return updatedNgo
    } catch (error) {
        console.error("Failed to update NGO:", error)
        throw new Error("Error updating NGO details")
    }
}

export async function getNgoByUserId(userId: string | null | undefined) {
    try {
        if (!userId) return [];

        const ngo = await prisma.nGOProfile.findMany({
            where: { userId },
            include: {
                donations: {
                    include: {
                        donor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                email: true,
                                username: true,
                            },
                        },
                        reAssignedNgo: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return ngo;
    } catch (error) {
        console.error("Error fetching NGO by userId:", error);
        throw new Error("Failed to fetch NGO details.");
    }
}

export async function updateNgoProofStatus(ngoId: string, status: NGOStatus) {
    try {
        await prisma.nGOProfile.update({
            where: { id: ngoId },
            data: { status: status }
        })

    } catch (error) {
        console.error("Failed to update NGO Status:", error)
        throw new Error("Error updating NGO Status")
    }
}

export async function getAllNgo() {
    try {
        const ngos = await prisma.nGOProfile.findMany({
            include: {
                user: true, // To get user.name
            }
        });
        return ngos;
    } catch (error) {
        console.error("Error fetching all NGOs:", error);
        return [];
    }
}

export async function getNgoByNgoId(id: string) {
    try {
        const ngo = await prisma.nGOProfile.findUnique({
            where: { id },
            include: {
                proofs: true,
                user: true
            }
        });

        if (!ngo) {
            throw new Error("NGO not found");
        }

        return ngo;
    } catch (error) {
        console.error("Error fetching NGO:", error);
        throw error;
    }
}

export async function calculateAndUpdateRaisedThisMonth(ngoId: string) {
    try {
        // Fetch released donations for this month where the NGO was either the original or reassigned recipient
        const donations = await prisma.donation.findMany({
            where: {
                OR: [
                    { ngoId },
                    { reAssignedNgoId: ngoId }
                ]
            },
            select: {
                amount: true,
            },
        });

        // Calculate the total amount
        const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

        // Update the NGO profile
        await prisma.nGOProfile.update({
            where: { id: ngoId },
            data: {
                raisedThisMonth: totalAmount,
            },
        });

        return { success: true, amount: totalAmount };
    } catch (error) {
        console.error("Error calculating raisedThisMonth:", error);
        return { success: false, error: "Failed to calculate raised amount" };
    }
}


export async function updateTotamAmountRaisedThisMonth(ngoId: string, amount: number) {
    try {
        await prisma.nGOProfile.update({
            where: {
                id: ngoId
            },
            data: {
                raisedThisMonth: {
                    increment: amount,
                },
            },
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating raisedThisMonth:', error);
        return { success: false, error: 'Failed to update raised amount' };
    }
}

export async function getPendingNGOForProofs() {
    try {
        const ngos = await prisma.nGOProfile.findMany({
            where: { status: "PENDING" }
        })

        return ngos
    } catch (error) {
        console.error("Error fetching all NGOs with pending proofs:", error);
        throw new Error("Error fetching all NGOs with pending proofs")
    }
}

export const updateNgoFieldsByAdmin = async ({
    ngoId,
    status,
    accentTags,
    approved
}: {
    ngoId: string;
    status: NGOStatus;
    accentTags: AccentTag;
    approved: boolean;
}) => {
    try {
        await prisma.nGOProfile.update({
            where: { id: ngoId },
            data: {
                status,
                accentTags,
                approved,
            },
        });
        revalidatePath("/admin-dashboard")
        
    } catch (error) {
        console.error("Failed to update NGO:", error);
        throw error;
    }
};
