"use client"

import React, { useState } from 'react'
import { VoteSession } from '@prisma/client';
import toast from 'react-hot-toast';
import { endVoteSession } from '@/actions/voting.action';

const EndAllVotingSessionButton = (votingSessions: VoteSession[]) => {

    const [loading, setLoading] = useState(false)

    const handleEndAllSession = async () => {
        try {
            setLoading(true)
            for(const session of votingSessions) {
                await endVoteSession(session.id)
            }
            toast.success("All voting session ended successfully")
        } catch (error) {
            toast.error("Failed to end all voting session")
            console.log("Error while ending all voting session:", error);
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
                'End Session'
            )}
        </button>
    )
}

export default EndAllVotingSessionButton
