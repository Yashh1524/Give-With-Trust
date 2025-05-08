"use server"

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
    console.log(ngoId)
    console.log(userId)
    console.log(message)
    console.log(rating)
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
    const latest = await prisma.feedback.findFirst({
        where: {
            ngoId,
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!latest) throw new Error("Feedback not found");

    return await prisma.feedback.update({
        where: { id: latest.id },
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
    const latest = await prisma.feedback.findFirst({
        where: {
            ngoId,
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!latest) throw new Error("Feedback not found");

    return await prisma.feedback.delete({
        where: { id: latest.id },
    });
}
