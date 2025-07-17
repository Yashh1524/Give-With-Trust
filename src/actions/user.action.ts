"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
        if (!clerkId || !email) {
            console.warn("Missing required user data.");
            return;
        }

        // console.log("Syncing user:", { clerkId, firstName, lastName, email, image, username });

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (existingUser) {
            console.log("User already exists:", existingUser.id);
            return existingUser;
        }

        const newUser = await prisma.user.create({
            data: {
                clerkId,
                name: `${firstName || ""} ${lastName || ""}`.trim(),
                username: username || email.split("@")[0],
                email,
                image,
                role: "DONOR",
            },
        });

        // console.log("Created new user:", newUser.id);

        return newUser;
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

    // if (!user) throw new Error("User not found");
    if (!user) return

    return user.id;
}

export async function checkIfUserHasNgo() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return false;

    const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { ngoProfile: true },
    });

    const result = user?.ngoProfile.length

    if (result === 0) return false
    else return true;
    // return (user?.ngoProfile?.length ?? 0) > 0;

}

export async function getUserDetails(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return user
    } catch (error) {

    }
}

export async function updateUserDetails(
    userId: string,
    data: {
        name?: string;
        username?: string;
        bio?: string | null;
        image?: string | null;
    }
) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                username: data.username,
                bio: data.bio,
                image: data.image || "/avatar.png",
            },
        });

        revalidatePath(`/profile/${userId}`);
        return updatedUser;
    } catch (error) {
        console.error("Failed to update user details:", error);
        throw new Error("User update failed");
    }
}

export async function updateUserRole(role: Role, userId: string) {
    try {

        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!user) {
            throw new Error("User not found")
        }

        if(user.role !== "ADMIN") {
            await prisma.user.update({
                where: { id: userId },
                data: { role: role }
            })
        }
        
    } catch (error) {
        console.error("Failed to update user role")
        throw new Error("User role update failed")
    }
}

export async function getCurrentUserRole() {
    try {
        // const userId = await getDbUserId()
        // const use = await getUserDetails(userId)
        // return "ADMIN"

        const { userId: clerkId } = await auth();

        if (!clerkId) return null;

        const user = await getUserByClerkId(clerkId);

        if (!user) return

        return user.role
    } catch (error) {
        console.error("Failed to fetch user role")
        // throw new Error("Fetch User role failed.")
        return
    }
}

export async function getTotalUserCount() {
    try {
        const count = await prisma.user.count();
        return count;
    } catch (error) {
        console.error("Error counting all NGOs:", error);
        throw new Error("Failed to count all NGOs.");
    }
}