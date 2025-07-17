"use server"

import { prisma } from '@/lib/prisma';
import { Month } from "@prisma/client";
import { updateNgoProofStatus } from './ngo.action';

export async function uploadMonthlyWorkProof(
    ngoId: string,
    data: {
        month: string;
        year: string;
        description: string;
        imageUrl: string[];
        proofPdf: string[];
    }
) {
    try {
        // console.log(ngoId, data)

        const existingNgo = await prisma.nGOProfile.findUnique({
            where: { id: ngoId },
        })

        if (!existingNgo) throw new Error('NGO not found')

        // Validate month enum
        const validMonth = Object.values(Month).includes(data.month as Month)
        if (!validMonth) throw new Error('Invalid month value')

        const proof = await prisma.proof.upsert({
            where: {
                unique_proof_per_month: {
                    ngoId,
                    month: data.month as Month,
                    year: parseInt(data.year),
                },
            },
            update: {
                description: data.description,
                imageUrl: data.imageUrl,
                pdfUrl: data.proofPdf,
                submittedAt: new Date(),
            },
            create: {
                ngoId,
                month: data.month as Month,
                year: parseInt(data.year),
                description: data.description,
                imageUrl: data.imageUrl,
                pdfUrl: data.proofPdf,
            },
        })

        // ✅ Call updateNgoStatus if this is for the current month and year
        const now = new Date()
        const currentMonth = now.toLocaleString('default', { month: 'long' }).toUpperCase() as Month
        const currentYear = now.getFullYear()

        if (data.month.toUpperCase() === currentMonth && parseInt(data.year) === currentYear) {
            await updateNgoProofStatus(ngoId, "SUBMITTED")
        }

        return proof
    } catch (error) {
        console.error('Failed to upload proofs:', error)
        throw new Error('Error uploading NGO monthly work proofs')
    }
}


export async function getMonthlyWorkProofs() {
    try {
        const proofs = await prisma.proof.findMany({
            include: {
                ngo: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        email: true,
                        userId: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        return proofs;
    } catch (error) {
        console.error("Error fetching monthly work proofs:", error);
        throw new Error("Failed to fetch monthly work proofs");
    }
}

export async function getMonthlyWorkProofsByNgoId(ngoId: string) {
    try {
        const proofs = await prisma.proof.findMany({
            where: {ngoId: ngoId},
            include: {
                ngo: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        email: true,
                        userId: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        return proofs;
    } catch (error) {
        console.error("Error fetching monthly work proofs:", error);
        throw new Error("Failed to fetch monthly work proofs");
    }
}
