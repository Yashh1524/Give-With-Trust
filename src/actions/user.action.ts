"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const syncUser = async ({
    clerkId,
    firstName,
    lastName,
    email,
    image,
    username,
}: {
    clerkId: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    image?: string | null;
    username?: string | null;
}) => {
    try {
        if (!clerkId) return; // Ensure userId is provided

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (existingUser) {
            return existingUser;
        }

        // If user does not exist, create new user in DB
        return await prisma.user.create({
            data: {
                clerkId,
                name: `${firstName || ""} ${lastName || ""}`.trim(),
                username: username ?? email.split("@")[0],
                email,
                image,
                role: "DONOR"
            },
        });
    } catch (error) {
        console.error("Error in syncUser:", error);
        throw new Error("Database operation failed");
    }
};

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
    });
}

export async function getDbUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    const user = await getUserByClerkId(clerkId);
    
    if (!user) throw new Error("User not found");

    return user.id;
}

export async function checkIfUserHasNgo() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return false;

    const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { ngoProfile: true },
    });

    return !!user?.ngoProfile;
}

export async function getUserDetails(userIdOrClerkId: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userIdOrClerkId },
                    { clerkId: userIdOrClerkId },
                ],
            },
        });

        return user;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw new Error('Failed to fetch user details');
    }
}
