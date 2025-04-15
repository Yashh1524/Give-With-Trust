'use client'

import { endVoteSession } from '@/actions/voting.action'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface VotingSessionsListClientProps {
    sessions?: any[]
}

const VotingSessionsListClient = ({ sessions }: VotingSessionsListClientProps) => {
    const [votingData, setVotingData] = useState<any[]>(sessions || [])
    const [loading, setLoading] = useState(false)

    function ClientDate({ dateString }: { dateString: string }) {
        const [formattedDate, setFormattedDate] = useState("")

        useEffect(() => {
            const date = new Date(dateString)
            setFormattedDate(date.toLocaleString()) // ensures it's rendered on the client
        }, [dateString])

        return <span>{formattedDate}</span>
    }

    const handleEndSession = async (sessionId: string) => { 
        try {
            setLoading(true)
            await endVoteSession(sessionId)
            toast.success("Voting session ended successfully")
        } catch (error) {
            toast.error("Failed to end voting session")
            console.log("Error while ending voting session:", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 mt-6">
            {votingData.map((session) => (
                <div key={session.id} className="border p-4 rounded-2xl shadow-sm bg-white dark:bg-[#2b2a40]">
                    <Link href={`voting-sessions/${session.id}`} className="flex justify-between items-center mb-2 hover:text-purple-500 hover:underline">
                        <div className="text-xl font-semibold">Voting Session: {session.month} {session.year}</div>
                        <div className="text-sm text-zinc-500">
                            <ClientDate dateString={session.createdAt} />
                        </div>
                    </Link>

                    {
                        session.isOngoing && (
                            <button
                                className={`my-3 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                onClick={() => handleEndSession(session.id)}
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
                        )
                    }

                    <div className="mb-4 border border-red-500 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-600">Failed NGO</h3>
                        <div className="flex items-center gap-4 mt-1">
                            <img
                                src={session.failedNgo.logo}
                                alt={session.failedNgo.name}
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                            <div>
                                <div className="font-medium">{session.failedNgo.name}</div>
                                <div className="text-sm text-zinc-500">{session.failedNgo.email}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Candidates</h4>
                        <div className="space-y-3">
                            {session.candidates.map((ngo: any) => {
                                const voteCount = session.votes.filter((vote: any) => vote.selectedNgoId === ngo.id).length
                                return (
                                    <div
                                        key={ngo.id}
                                        className="flex items-center justify-between border p-3 rounded-lg bg-zinc-100 dark:bg-[#1c1a30]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={ngo.logo}
                                                alt={ngo.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md"
                                            />
                                            <div>
                                                <div className="font-medium">{ngo.name}</div>
                                                <div className="text-sm text-zinc-500">{ngo.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm font-semibold">
                                            Votes: {voteCount}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className={`mt-4 text-sm ${session.isOngoing ? "text-green-500" : "text-red-500"}`}>
                        {session.isOngoing ? 'Voting is ongoing' : 'Voting Ended'}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default VotingSessionsListClient
