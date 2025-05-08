import { prisma } from "@/lib/prisma";

export async function createFeedback({
    ngoId,
    userId,
    message,
    rating,
}: {
    ngoId: string;
    userId: string;
    message: string;
    rating: number;
}) {
    return await prisma.feedback.create({
        data: {
            ngoId,
            userId,
            message,
            rating,
        },
    });
}

export async function getFeedbackByNgoId(ngoId: string) {
    return await prisma.feedback.findMany({
        where: { ngoId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function updateFeedback({
    ngoId,
    userId,
    message,
    rating,
}: {
    ngoId: string;
    userId: string;
    message: string;
    rating: number;
}) {
    // Find the existing feedback using the unique compound fields
    const existing = await prisma.feedback.findUnique({
        where: {
            userId_ngoId: {
                userId,
                ngoId,
            },
        },
    });

    if (!existing) throw new Error("Feedback not found");

    return await prisma.feedback.update({
        where: { id: existing.id },
        data: {
            message,
            rating,
        },
    });
}

export async function deleteFeedback({
    ngoId,
    userId,
}: {
    ngoId: string;
    userId: string;
}) {
    const existing = await prisma.feedback.findUnique({
        where: {
            userId_ngoId: {
                userId,
                ngoId,
            },
        },
    });

    if (!existing) throw new Error("Feedback not found");

    return await prisma.feedback.delete({
        where: { id: existing.id },
    });
}
