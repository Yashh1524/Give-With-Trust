"use server"

import { prisma } from "@/lib/prisma"
import { Month, VoteSession } from '@prisma/client';// ensure you're importing Month enum
import { revalidatePath } from "next/cache";

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

export async function getVotingSessionByUserId(userId: string) {
    try {
        const votingSessions = await prisma.voteSession.findMany({
            where: {
                voters: {
                    some: {
                        id: userId
                    }
                }
            },
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

export async function getVotingSessionBySessionId(sessionId: string) {
    try {
        const votingSession = await prisma.voteSession.findUnique({
            where: { id: sessionId },
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
            }
        })

        return votingSession
    } catch (error) {
        console.error("Error fetching voting sessions:", error)
        throw new Error("Failed fetching voting sessions")
    }
}

export async function createVote({
    userId,
    voteSessionId,
    selectedNgoId,
}: {
    userId: string;
    voteSessionId: string;
    selectedNgoId: string;
}) {
    try {
        const existingVote = await prisma.vote.findFirst({
            where: {
                userId,
                voteSessionId,
            },
        });

        if (existingVote) {
            await prisma.vote.update({
                where: {
                    id: existingVote.id,
                },
                data: {
                    selectedNgoId,
                },
            });
        } else {
            await prisma.vote.create({
                data: {
                    userId,
                    voteSessionId,
                    selectedNgoId,
                },
            });
        }
        revalidatePath(`/voting-session/${voteSessionId}`)
    } catch (error) {
        console.error("Error creating vote:", error);
        throw new Error("Failed creating vote");
    }
}

