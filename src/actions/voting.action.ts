"use server"

import { prisma } from "@/lib/prisma"
import { Month } from "@prisma/client" // ensure you're importing Month enum

export async function createVotingSession(session: {
    failedNgoId: string,
    voters: string[],
    candidates: string[]
}) {
    try {
        const now = new Date()
        const month = Month[now.toLocaleString("default", { month: "long" }).toUpperCase() as keyof typeof Month]
        const year = now.getFullYear()

        const votingSession = await prisma.voteSession.create({
            data: {
                failedNgoId: session.failedNgoId,
                month: month,
                year: year,
                voters: {
                    connect: session.voters.map(id => ({ id }))
                },
                candidates: {
                    connect: session.candidates.map(id => ({ id }))
                }
            },
            include: {
                voters: true,
                candidates: true
            }

        })

        if (!votingSession) throw new Error("Voting session not found")
        
        return votingSession
        
    } catch (error) {
        console.error("Error creating voting session:", error)
        throw new Error("Failed creating voting session")
    }
}

export async function getAllVotingSession() {
    try {
        const votingSessions = await prisma.voteSession.findMany({
            include: {
                failedNgo: {
                    include: {
                        user: true, // Get NGO owner's info
                    }
                },
                candidates: {
                    include: {
                        user: true, // Get each candidate NGO's owner info
                    }
                },
                voters: true, // Basic user info of voters
                votes: {
                    include: {
                        user: true,         // The user who voted
                        selectedNgo: true,  // The NGO they voted for
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return votingSessions
    } catch (error) {
        console.error("Error fetching voting sessions:", error)
        throw new Error("Failed fetching voting sessions")
    }
}
