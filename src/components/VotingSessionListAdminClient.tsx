'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { Donation, NGOProfile, VoteSession } from '@prisma/client'
import toast from 'react-hot-toast'
import { createVotingSession, endVoteSession, getAllVotingSession } from '@/actions/voting.action'
import Link from 'next/link'
import { getUserDetails } from '@/actions/user.action'

interface Props {
    donations: Donation[]
    notSubmittedWorkNgos: NGOProfile[]
    submittedNGOs: NGOProfile[]
}

const VotingSessionListAdminClient: React.FC<Props> = ({
    donations,
    notSubmittedWorkNgos,
    submittedNGOs,
}) => {
    const [votingSessions, setVotingSessions] = useState<VoteSession[]>([])
    const [isPending, startTransition] = useTransition()
    const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const [endSessionLoading, setEndSessionLoading] = useState(false)
    const [createSessionLoading, setCreateSessionLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedNgos, setSelectedNgos] = useState<string[]>([])
    const [selectAll, setSelectAll] = useState(false)

    const fetchAllVotingSessions = async () => {
        try {
            const sessions = await getAllVotingSession()
            setVotingSessions(sessions)
            // console.log(sessions);

        } catch (error) {
            toast.error("Failed to fetch voting sessions")
        } finally {
            setInitialLoading(false)
        }
    }


    useEffect(() => {
        fetchAllVotingSessions()
    }, [])

    // const alreadyCreatedNgoIds = new Set(votingSessions.map(vs => vs.failedNgoId))
    // const notSubmittedWorkNgos = notSubmittedWorkNgos.filter(ngo => !alreadyCreatedNgoIds.has(ngo.id))
    const notSubmittedNgoHasHeldDonation = notSubmittedWorkNgos.filter(ngo =>
        donations.some(donation => donation.ngoId === ngo.id && donation.status === "HELD")
    )

    const toggleNgo = (id: string) => {
        setSelectedNgos(prev =>
            prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
        )
    }

    function ClientDate({ dateString }: { dateString: string | Date }) {
        const [formattedDate, setFormattedDate] = useState("")

        useEffect(() => {
            const date = new Date(dateString)
            setFormattedDate(date.toLocaleString())
        }, [dateString])

        return <span>{formattedDate}</span>
    }

    const handleEndSession = async (sessionId: string) => {
        try {
            setLoadingSessionId(sessionId)
            await endVoteSession(sessionId)
            // await updateDonationStatusByNgoId("REASSIGNED", session.failedNgoId, session.winnerNgoId)
            toast.success("Voting session ended successfully")
            fetchAllVotingSessions()
        } catch (error) {
            toast.error("Failed to end voting session")
            console.log("Error while ending voting session:", error)
        } finally {
            setLoadingSessionId(null)
        }
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedNgos([])
        } else {
            setSelectedNgos(notSubmittedNgoHasHeldDonation.map(ngo => ngo.id))
        }
        setSelectAll(!selectAll)
    }

    const handleCreateVotingSessions = () => {
        startTransition(async () => {
            setCreateSessionLoading(true);
            try {
                const getRandomNgoIds = (ngos: NGOProfile[], count = 3) => {
                    const shuffled = [...ngos].sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, count).map(ngo => ngo.id);
                };

                for (const ngo of notSubmittedNgoHasHeldDonation.filter(n => selectedNgos.includes(n.id))) {
                    const relatedDonation = donations.filter(
                        donation => donation.ngoId === ngo.id
                    );
                    const voters = [...new Set(relatedDonation.map(donation => donation.donorId))];
                    if (voters.length === 0) continue;

                    const selectedNgoIds = getRandomNgoIds(
                        submittedNGOs.filter(n => n.id !== ngo.id),
                        3
                    );

                    if (selectedNgoIds.length === 0) {
                        toast.error("No subbmitted NGOs found")
                    } else {
                        const createdSession = await createVotingSession({
                            failedNgoId: ngo.id,
                            voters,
                            candidates: selectedNgoIds,
                        });

                        // console.log("Created session", createdSession);

                        const emailed = new Set<string>();
                        for (const voter of voters) {
                            if (emailed.has(voter)) continue;
                            emailed.add(voter);

                            const voterDetails = await getUserDetails(voter);
                            if (!voterDetails?.email) continue;

                            await fetch('/api/send-new-voting-session-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    to: voterDetails.email,
                                    failedNgoName: ngo.name,
                                    sessionId: createdSession.id,
                                }),
                            });

                            await new Promise(res => setTimeout(res, 500));
                        }
                        toast.success("Voting sessions created successfully");
                        fetchAllVotingSessions();
                        setDialogOpen(false);
                        setSelectedNgos([]);
                        setSelectAll(false);
                    }
                }

            } catch (error) {
                toast.error("Failed to create voting session");
                console.error(error);
            } finally {
                setCreateSessionLoading(false);
            }
        });
    };


    const handleEndAllSession = async () => {
        try {
            setEndSessionLoading(true)
            for (const session of votingSessions) {
                if (session.isOngoing) await endVoteSession(session.id)
            }
            toast.success("All voting sessions ended successfully")
            fetchAllVotingSessions()
        } catch (error) {
            toast.error("Failed to end all voting sessions")
            console.log("Error while ending all voting sessions:", error)
        } finally {
            setEndSessionLoading(false)
        }
    }

    // Render loading screen while fetching sessions
    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-blue-600 font-medium">Loading voting sessions...</span>
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
                {/* Create Session Button */}
                <div>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        onClick={() => setDialogOpen(true)}
                    >
                        Create Voting Sessions
                    </button>

                    {dialogOpen && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-[#2b2a40] rounded-xl p-6 w-full max-w-lg space-y-4">
                                <h2 className="text-xl font-semibold">Select NGOs to Create Voting Sessions</h2>

                                {notSubmittedNgoHasHeldDonation.length === 0 ? (
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        No NGO found with pending monthly proof submission or they already have voting sessions.
                                    </p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                            <label className="text-sm">Select All</label>
                                        </div>

                                        <div className="max-h-60 overflow-y-auto border p-3 rounded-lg space-y-2">
                                            {notSubmittedNgoHasHeldDonation.map(ngo => (
                                                <div key={ngo.id} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedNgos.includes(ngo.id)}
                                                        onChange={() => toggleNgo(ngo.id)}
                                                    />
                                                    <div>
                                                        <div className="font-medium">{ngo.name}</div>
                                                        <div className="text-sm text-zinc-500">{ngo.email}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end gap-2">
                                    <button
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                        onClick={handleCreateVotingSessions}
                                        disabled={selectedNgos.length === 0 || isPending || createSessionLoading}
                                    >
                                        {createSessionLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Sessions"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* End All Session Button */}
                <button
                    className={`px-4 py-2 rounded text-white font-medium transition-all duration-300 ${endSessionLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    onClick={handleEndAllSession}
                    disabled={endSessionLoading}
                >
                    {endSessionLoading ? (
                        <div className="flex items-center gap-2 justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Ending...
                        </div>
                    ) : (
                        'End All Session'
                    )}
                </button>
            </div>

            {/* All Voting Sessions */}
            <div className="space-y-6 mt-6">
                {votingSessions.map((session: any) => (
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
                                    className={`my-3 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 ${loadingSessionId === session.id
                                        ? 'bg-red-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    onClick={() => handleEndSession(session.id)}
                                    disabled={loadingSessionId === session.id}
                                >
                                    {loadingSessionId === session.id ? 'Ending...' : 'End Session'}
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
                                            className="flex items-center justify-between border p-3 rounded-lg bg-zinc-100 dark:bg-[#1c1a30] flex-col md:flex-row"
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
        </div>
    )
}

export default VotingSessionListAdminClient
