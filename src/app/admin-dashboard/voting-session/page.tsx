import { getAllHeldDonation } from '@/actions/donation.action'
import { getNGOsByStatus } from '@/actions/ngo.action'
import { getAllVotingSession } from '@/actions/voting.action'
import CreateVotingSessionsButton from '@/components/CreateVotingSessionsButton'


const Page = async () => {
    const donations = await getAllHeldDonation()
    const notSubmittedWorkNgos = await getNGOsByStatus("NOT_SUBMITTED")
    const submittedNGOs = await getNGOsByStatus("SUBMITTED")
    const votingSessions = await getAllVotingSession()
    console.log("votingSessions:",votingSessions);

    return (
        <div className="p-4">
            <CreateVotingSessionsButton
                donations={donations}
                notSubmittedWorkNgos={notSubmittedWorkNgos}
                submittedNGOs={submittedNGOs}
            />
        </div>
    )
}

export default Page
