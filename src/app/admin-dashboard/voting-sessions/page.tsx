import { getAllHeldDonation } from '@/actions/donation.action'
import { getNGOsByStatus } from '@/actions/ngo.action'
import { getCurrentUserRole } from '@/actions/user.action'
import { getAllVotingSession } from '@/actions/voting.action'
import CreateVotingSessionsButton from '@/components/CreateVotingSessionsButton'
import EndAllVotingSessionButton from '@/components/EndAllVotingSessionButton'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import VotingSessionsListClient from '@/components/VotingSessionsListClient'


const Page = async () => {
    const donations = await getAllHeldDonation()
    const notSubmittedWorkNgos = await getNGOsByStatus("NOT_SUBMITTED")
    const submittedNGOs = await getNGOsByStatus("SUBMITTED")
    const votingSessions = await getAllVotingSession()
    const userRole = await getCurrentUserRole()
    console.log("votingSessions:",votingSessions);

    return (
        <>
            {
                userRole === "ADMIN" ? (
                    <div className="p-4">
                        <div className='flex flex-col md:flex-row gap-3'>
                            <CreateVotingSessionsButton
                                donations={donations}
                                notSubmittedWorkNgos={notSubmittedWorkNgos}
                                submittedNGOs={submittedNGOs}
                                votingSessions={votingSessions}
                            />
                            <EndAllVotingSessionButton 
                                votingSessions={votingSessions}
                            />
                        </div>
                        <VotingSessionsListClient sessions={votingSessions}/>
                    </div>
                ) : (
                    <UnauthorizedAccess />
                )
            }
        </>
    )
}

export default Page
