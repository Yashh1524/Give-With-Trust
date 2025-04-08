"use server"

import { prisma } from "@/lib/prisma";

const syncUser = async (
    {
        clerkId,
        firstName,
        lastName,
        email,
        username,
    } : {
        clerkId: string;
        firstName?: string | null;
        lastName?: string | null;
        email: string;
        image?: string | null;
        username?: string | null;
    }  
) => {
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
            },
        });
    }
}