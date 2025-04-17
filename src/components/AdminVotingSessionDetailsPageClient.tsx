'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { FaRegClock } from 'react-icons/fa'
import { LuAlarmClockOff } from 'react-icons/lu'
import toast from 'react-hot-toast'
import { endVoteSession } from '@/actions/voting.action'
import { NGOStatus, Role } from '@prisma/client'

export interface VoteSession {
    id: string;
    failedNgoId: string;
    month: string;
    year: number;
    createdAt: Date | string;
    isOngoing: boolean;
    winnerNgoId: string | null;
    failedNgo: NGODetails;
    candidates: NGODetails[];
    voters: UserDetails[];
    votes: Vote[];
}

export interface NGODetails {
    id: string;
    userId: string;
    name: string;
    email: string;
    establishedDate: string;
    address: string;
    contactInfo: string;
    description: string;
    approved: boolean;
    createdAt: Date | string;
    raisedThisMonth: number;
    status: NGOStatus;
    accentTags: string;
    website: string | null;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
    upiId: string;
    logo: string;
    proofPdf: string;
    images: string[];
    user: UserDetails;
}

export interface UserDetails {
    id: string;
    clerkId: string;
    email: string;
    username: string;
    name: string | null;
    bio: string | null;
    image: string;
    role: Role;
    createdAt: Date | string;
}

export interface Vote {
    id: string;
    userId: string;
    voteSessionId: string;
    selectedNgoId: string;
    createdAt: Date | string;
    user: UserDetails;
    selectedNgo: NGODetails;
}

interface AdminVotingSessionDetailsPageClientProps {
    voteSession: VoteSession
}

const AdminVotingSessionDetailsPageClient: React.FC<AdminVotingSessionDetailsPageClientProps> = ({ voteSession }) => {
    const { failedNgo, candidates, voters, votes, createdAt } = voteSession
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [loading, setLoading] = useState(false)
    console.log(voteSession);

    const totalVotes = voters.length
    const voteCounts = candidates.reduce((acc, ngo) => {
        acc[ngo.id] = votes.filter(v => v.selectedNgoId === ngo.id).length
        return acc
    }, {} as Record<string, number>)

    const winnerNgoId = !voteSession.isOngoing
        ? candidates.reduce((maxId, ngo) => {
            const currentVotes = voteCounts[ngo.id] || 0
            const maxVotes = voteCounts[maxId] || 0
            return currentVotes > maxVotes ? ngo.id : maxId
        }, candidates[0]?.id)
        : null

    const winnerNgo = candidates.find(ngo => ngo.id === winnerNgoId)

    useEffect(() => {
        const endTime = new Date(createdAt)
        endTime.setDate(endTime.getDate() + 3)

        const updateTimer = () => {
            const now = new Date()
            const diff = endTime.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeLeft('Voting ended')
                return
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((diff / (1000 * 60)) % 60)
            const seconds = Math.floor((diff / 1000) % 60)

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [createdAt])


    const handleEndSession = async () => {
        try {
            setLoading(true)
            await endVoteSession(voteSession.id)
            // await updateDonationStatusByNgoId("REASSIGNED", voteSession.failedNgo?.id as string, winnerNgoId)
            toast.success("Voting session ended successfully")
        } catch (error) {
            toast.error("Failed to end voting session")
            console.log("Error while ending voting session:", error);
        } finally {
            setLoading(false)
        }
    }

    if (!failedNgo) {
        return <div className="text-center text-red-500">Invalid or missing voting session data</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-center">Voting Session Overview</h1>


            {voteSession.isOngoing ? (
                <div>
                    <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400 font-medium text-sm md:text-lg">
                        <FaRegClock className="text-xl" />
                        <span>Time left: <span className="font-bold">{timeLeft}</span></span>
                    </div>
                    <button
                        className={`mt-5 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                        onClick={handleEndSession}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Ending...
                            </div>
                        ) : (
                            'End Session'
                        )}
                    </button>

                </div>
            ) : (
                <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400 font-medium text-lg">
                    <LuAlarmClockOff className="text-xl" />
                    <span>Voting Ended</span>
                </div>
            )}

            <div className="bg-red-100 dark:bg-red-900 border border-red-400 p-6 rounded-xl shadow-md">
                <div className="flex gap-4 items-center mb-3">
                    {failedNgo.logo && (
                        <img
                            src={failedNgo.logo}
                            alt={failedNgo.name}
                            width={60}
                            height={60}
                            className="rounded-full object-cover"
                        />
                    )}
                    <div>
                        <Link href={`/ngos/${failedNgo.id}`}>
                            <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 hover:text-white hover:underline">
                                {failedNgo.name}
                            </h2>
                        </Link>
                        <p className="text-sm text-white-500 dark:text-white-400">Failed to submit monthly proof</p>
                    </div>
                </div>
            </div>

            {/* Note about reallocation voting */}
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-xl shadow-sm text-sm text-yellow-800 dark:text-yellow-200">
                <p>
                    <strong>{failedNgo.name}</strong> failed to provide proof for their last month's work.
                    As a result, all funds raised by them will be reallocated to one of the NGOs listed below through this voting session.
                    <br />
                    <span className="font-medium">
                        We request you to review the NGOs and vote for the one you believe deserves the reallocation.
                    </span>
                </p>
            </div>

            {!voteSession.isOngoing && winnerNgo && (
                <div className="bg-green-100 dark:bg-green-900 border border-green-400 p-4 rounded-xl shadow-sm text-sm text-green-800 dark:text-green-200">
                    <p>
                        <strong>{winnerNgo.name}</strong> has received the highest number of votes.
                        <br />
                        All funds from <strong>{failedNgo.name}</strong> will be reallocated to them.
                    </p>
                </div>
            )}

            <div className="grid gap-6">
                {candidates.map((ngo) => {
                    const voteCount = voteCounts[ngo.id] || 0
                    const progress = totalVotes ? (voteCount / totalVotes) * 100 : 0

                    return (
                        <div
                            key={ngo.id}
                            className={`border p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-900 ${winnerNgoId === ngo.id && !voteSession.isOngoing
                                ? 'border-green-500 ring-2 ring-green-400'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex gap-4 items-center">
                                    {ngo.logo && (
                                        <img
                                            src={ngo.logo}
                                            alt={ngo.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <Link
                                            href={`/ngos/${ngo.id}`}
                                            className="text-xl font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                                        >
                                            {ngo.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{ngo.accentTags}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-4">{ngo.description}</p>

                            <Progress value={progress} />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{voteCount} / {totalVotes} votes</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AdminVotingSessionDetailsPageClient
