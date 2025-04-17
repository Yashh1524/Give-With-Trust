"use server"

import { prisma } from "@/lib/prisma"
import { Month } from '@prisma/client';
import { revalidatePath } from "next/cache";
import { updateDonationStatusByNgoId } from "./donation.action";
import { updateNgoProofStatus } from "./ngo.action";

export async function createVotingSession(session: {
    failedNgoId: string,
    voters: string[],
    candidates: string[]
}) {
    try {
        // console.log("session:", session)
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

        // revalidatePath("/admin-dashboard/voting-sessions")

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
        revalidatePath(`/admin-dashboard/voting-sessions`);
        
    } catch (error) {
        console.error("Error creating vote:", error);
        throw new Error("Failed creating vote");
    }
}

export async function endVoteSession(voteSessionId: string) {
    try {
        const voteSession = await prisma.voteSession.findUnique({
            where: { id: voteSessionId },
            include: {
                candidates: true,
                votes: true,
                failedNgo: true,
                winnerNgo: true
            },
        });

        if (!voteSession) throw new Error("Voting session not found");

        // Count the votes per NGO
        const voteCounts = voteSession.candidates.reduce((acc, ngo) => {
            acc[ngo.id] = voteSession.votes.filter(v => v.selectedNgoId === ngo.id).length;
            return acc;
        }, {} as Record<string, number>);

        // Find the max vote count
        const maxVoteCount = Math.max(...Object.values(voteCounts));

        // Filter candidates who have the max vote count
        const topCandidates = voteSession.candidates.filter(ngo => voteCounts[ngo.id] === maxVoteCount);

        // Choose winner randomly among top candidates (handles tie or no votes)
        const winnerNgoId = topCandidates[Math.floor(Math.random() * topCandidates.length)]?.id;

        // console.log("Vote counts:", voteCounts);
        // console.log("Top candidates:", topCandidates.map(n => n.name));
        // console.log("Selected winnerNgoId:", winnerNgoId);

        // Mark session as ended
        await prisma.voteSession.update({
            where: { id: voteSessionId },
            data: {
                isOngoing: false,
                winnerNgoId: winnerNgoId,
            },
        });

        await updateDonationStatusByNgoId("REASSIGNED", voteSession.failedNgo.id, winnerNgoId);
        await updateNgoProofStatus(voteSession.failedNgo.id, "PENDING");

        revalidatePath(`/admin-dashboard/voting-sessions`);

        return { success: true, winnerNgoId };
    } catch (error) {
        console.error("Error ending vote session:", error);
        throw new Error("Failed ending vote session");
    }
}
