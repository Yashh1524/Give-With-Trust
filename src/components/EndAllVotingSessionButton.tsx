'use client'

import React, { useState } from 'react'
import { VoteSession } from '@prisma/client';
import toast from 'react-hot-toast';
import { endVoteSession } from '@/actions/voting.action';
import { updateDonationStatusByNgoId } from '@/actions/donation.action';

interface Props {
    votingSessions: VoteSession[]
}

const EndAllVotingSessionButton: React.FC<Props> = ({ votingSessions }) => {

    const [loading, setLoading] = useState(false)

    const handleEndAllSession = async () => {
        try {
            setLoading(true)
            for (const session of votingSessions) {
                if (session.isOngoing){
                    await endVoteSession(session.id)
                    // await updateDonationStatusByNgoId("REASSIGNED", session.failedNgoId, session.winnerNgoId)
                }
            }
            toast.success("All voting sessions ended successfully")
        } catch (error) {
            toast.error("Failed to end all voting sessions")
            console.log("Error while ending all voting sessions:", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            className={`px-4 py-2 rounded text-white font-medium transition-all duration-300 ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            onClick={handleEndAllSession}
            disabled={loading}
        >
            {loading ? (
                <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ending...
                </div>
            ) : (
                'End All Session'
            )}
        </button>
    )
}

export default EndAllVotingSessionButton
