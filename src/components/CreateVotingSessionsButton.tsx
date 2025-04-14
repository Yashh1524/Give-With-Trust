'use client'

import { createVotingSession } from '@/actions/voting.action'
import React, { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface Props {
    donations: any[]
    notSubmittedWorkNgos: any[]
    submittedNGOs: any[]
}

const CreateVotingSessionsButton: React.FC<Props> = ({
    donations,
    notSubmittedWorkNgos,
    submittedNGOs,
}) => {
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(false)
    
    const handleCreateVotingSessions = () => {
        startTransition(async () => {
            setLoading(true)
            try {
                const getRandomNgoIds = (ngos: any[], count = 3) => {
                    const shuffled = [...ngos].sort(() => 0.5 - Math.random())
                    return shuffled.slice(0, count).map(ngo => ngo.id)
                }

                for (const ngo of notSubmittedWorkNgos) {
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
            } catch (error) {
                toast.error("Failed to create voting session")
            } finally {
                setLoading(false)
            }
        })
    }

    const isDisabled = isPending || loading || notSubmittedWorkNgos.length === 0

    return (
        <div>
            <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                onClick={handleCreateVotingSessions}
                disabled={isDisabled}
            >
                {isPending || loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                    </>
                ) : (
                    "Create Voting Sessions"
                )}
            </button>

            {notSubmittedWorkNgos.length === 0 && (
                <p className="mt-2 text-sm text-gray-600">
                    There is no NGO with not submitted proof, so no need to generate voting sessions.
                </p>
            )}
        </div>
    )
}

export default CreateVotingSessionsButton
