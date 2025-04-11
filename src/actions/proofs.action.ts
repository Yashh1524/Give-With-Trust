import { prisma } from "@/lib/prisma";
import { Month } from "@prisma/client";

export async function uploadMonthlyWorkProof(
    ngoId: string,
    data: Partial<{
        month: string;
        year: string;
        description: string;
        imageUrl: string[];
        proofPdf: string[];
    }>
) {
    try {

        const existingNgo = await prisma.nGOProfile.findUnique({
            where: { id: ngoId },
        });

        if (!existingNgo) throw new Error('NGO not found');

        if (
            !data.month ||
            !data.year ||
            !data.description ||
            !data.imageUrl ||
            !data.proofPdf
        ) {
            throw new Error('Missing required proof data');
        }

        // Ensure the month enum is valid
        const validMonth = Object.values(Month).includes(data.month as Month);
        if (!validMonth) throw new Error('Invalid month value');

        // Upsert to avoid duplicate proofs for same ngo-month-year
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
        });

        return proof;
    } catch (error) {
        console.error('Failed to upload proofs:', error);
        throw new Error('Error uploading NGO monthly work proofs');
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
