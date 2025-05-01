"use server"

import { prisma } from "@/lib/prisma"
import { updateNgoProofStatus } from "./ngo.action"

export async function createPayout(
    ngoId: string,
    amount: number,
    razorpayPayoutId: string
) {
    try {
        const payout = await prisma.payout.create({
            data: {
                ngoId,
                amount,
                razorpayPayoutId
            }
        })  
        
        await updateNgoProofStatus(ngoId, "PENDING")

        return payout
    } catch (error) {
        console.error("Error in creating Payout:", error)
        throw new Error("Failed to create payout")
    }
}

export async function getAllPayouts() {
    try {
        return await prisma.payout.findMany({
            include: {
                ngo: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    } catch (error) {
        console.error("Error in fetching all payouts:", error)
        throw new Error("Failed to fetch all payouts")
    }
}

export async function getPayoutsByNgoId(ngoId: string) {
    try {
        const payout = await prisma.payout.findMany({
            where: {ngoId: ngoId},
            include: {
                ngo: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        if(!payout) throw new Error("No payout found.")

        return payout

    } catch (error) {
        console.error("Error in fetching payouts by ngoId:", error)
        throw new Error("Failed to fetch payouts by ngoId")
    }
}