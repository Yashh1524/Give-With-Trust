'use client'

import { createVotingSession, getAllVotingSession } from '@/actions/voting.action'
import { Donation, NGOProfile, VoteSession } from '@prisma/client'
import React, { useState, useTransition } from 'react'
import toast from 'react-hot-toast'

interface Props {
    donations: Donation[]
    notSubmittedWorkNgos: NGOProfile[]
    submittedNGOs: NGOProfile[]
    votingSessions: VoteSession[]
}

const CreateVotingSessionsButton: React.FC<Props> = ({
    donations,
    notSubmittedWorkNgos,
    submittedNGOs,
    votingSessions,
}) => {
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedNgos, setSelectedNgos] = useState<string[]>([])
    const [selectAll, setSelectAll] = useState(false)
    // const [votingSessions, setVotingSessions] = useState<VoteSession[]>([])

    // const fetchAllVotingSessions = async () => {
        
    //     setVotingSessions(await getAllVotingSession())
    // }
    // fetchAllVotingSessions()

    const alreadyCreatedNgoIds = new Set(votingSessions.map(vs => vs.failedNgoId))
    const eligibleNgos = notSubmittedWorkNgos.filter(ngo => !alreadyCreatedNgoIds.has(ngo.id))

    const toggleNgo = (id: string) => {
        setSelectedNgos(prev =>
            prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedNgos([])
        } else {
            setSelectedNgos(eligibleNgos.map(ngo => ngo.id))
        }
        setSelectAll(!selectAll)
    }

    const handleCreateVotingSessions = () => {
        startTransition(async () => {
            setLoading(true)
            try {
                const getRandomNgoIds = (ngos: NGOProfile[], count = 3) => {
                    const shuffled = [...ngos].sort(() => 0.5 - Math.random())
                    return shuffled.slice(0, count).map(ngo => ngo.id)
                }

                for (const ngo of eligibleNgos.filter(n => selectedNgos.includes(n.id))) {
                    const relatedDonation = donations.filter(
                        donation => donation.ngoId === ngo.id
                    )
                    const voters = [...new Set(relatedDonation.map(donation => donation.donorId))]
                    if (voters.length === 0) continue

                    const selectedNgoIds = getRandomNgoIds(
                        submittedNGOs.filter(n => n.id !== ngo.id),
                        3
                    )

                    const session = {
                        failedNgoId: ngo.id,
                        voters: voters,
                        candidates: selectedNgoIds,
                    }

                    await createVotingSession(session)
                }

                toast.success("Voting sessions created successfully")
                // fetchAllVotingSessions()
                setDialogOpen(false)
                setSelectedNgos([])
                setSelectAll(false)
            } catch (error) {
                toast.error("Failed to create voting session")
            } finally {
                setLoading(false)
            }
        })
    }

    return (
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

                        {eligibleNgos.length === 0 ? (
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
                                    {eligibleNgos.map(ngo => (
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
                                disabled={selectedNgos.length === 0 || isPending || loading}
                            >
                                {loading ? (
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
    )
}

export default CreateVotingSessionsButton
