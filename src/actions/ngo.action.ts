'use server';

import { prisma } from '@/lib/prisma';
import { getDbUserId } from './user.action';
import { revalidatePath } from 'next/cache';

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
}) => {
    // const { userId } = await  auth();
    const userId = await getDbUserId()
    console.log(userId);
    
    if (!userId) throw new Error('Not authenticated');

    const existingNgo = await prisma.nGOProfile.findUnique({
        where: { userId },
    });

    if (existingNgo) {
        throw new Error('NGO profile already exists.');
    }

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
        },
    });

    revalidatePath("/");
};

export async function getNgoByUserId(userId: string) {
    try {
        const ngo = await prisma.nGOProfile.findUnique({
            where: { userId },
        });

        return ngo;
    } catch (error) {
        console.error("Error fetching NGO by userId:", error);
        throw new Error("Failed to fetch NGO details.");
    }
}