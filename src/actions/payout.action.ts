"use server"

import { prisma } from "@/lib/prisma"

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
        
        return payout
    } catch (error) {
        console.error("Error in creating Payout", error)
        throw new Error("Failed to create payout")
    }
}