"use server"

import { getAllDonationByStatus } from '@/actions/donation.action'
import { getNGOsByStatus } from '@/actions/ngo.action'
import { getCurrentUserRole } from '@/actions/user.action'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import VotingSessionListAdminClient from '@/components/VotingSessionListAdminClient'

const Page = async () => {
    const donations = await getAllDonationByStatus("HELD")
    const notSubmittedWorkNgos = await getNGOsByStatus("NOT_SUBMITTED")
    const submittedNGOs = await getNGOsByStatus("SUBMITTED")
    // const votingSessions = await getAllVotingSession()
    const userRole = await getCurrentUserRole()
    // console.log("votingSessions:",votingSessions);

    return (
        <>
            {
                userRole === "ADMIN" ? (
                    <VotingSessionListAdminClient 
                        donations = {donations}
                        notSubmittedWorkNgos = {notSubmittedWorkNgos}
                        submittedNGOs = {submittedNGOs}
                    />
                ) : (
                    <UnauthorizedAccess />
                )
            }
        </>
    )
}

export default Page
